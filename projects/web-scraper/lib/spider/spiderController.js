module.exports = function (app) {
  if (!app) throw new Error('Missing parameter: \'app\' not provided.');

  var express = require('express');
  var SpiderController = express.Router();
  var SpiderProvider = require('./SpiderProvider');
  var validateSpider = require('./validateSpider');
  var VerifyToken = require(__root + 'auth/VerifyToken')(app);
  let z = 1;

  const puppeteer = require('puppeteer'); // v 1.1.0
  const { URL } = require('url');
  const fse = require('fs-extra'); // v 5.0.0
  const path = require('path');
  const xml = require('xml2js');
  const parser = new xml.Parser();


  // Puppeteer worker.
  async function start(urlToFetch, siteName) {
    /* 1 */
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //await page.setRequestInterception(true);
    /* 2 */
    page.on('response', async (response) => {

      try {
        const status = response.status;

        page.on(  "console", function (log) {
          console.log(log.text());
        });
        const url = new URL(response.url());

        // This intercept is a method of blocking potential URL redirects
        // console.log(interceptedRequest.url(), url, status);
        // if (interceptedRequest.url().endsWith('/api')) {
        //     interceptedRequest.respond({
        //         status: 422,
        //         body: "FAKE"
        //     })
        // } else interceptedRequest.continue();

        let filePath = path.resolve(`./output/` + siteName + '/' + `${url.pathname}`);
        if (path.extname(url.pathname).trim() === '') {
           console.log(url.pathname, `${filePath}/index.html`)
          filePath = `${filePath}/index.html`;
        }

        // Save Data
        if ((status >= 300) && (status <= 399)) {
          console.log('Redirect from', response.url(), 'to', response.headers()['location']);
          await new Promise(function(resolve, reject) {
            resolve(null);
          });
        } else {
          await fse.outputFile(filePath, await response.buffer());
          await fse.outputFile(filePath + z, await response.buffer());
          z++;
        }

      } catch (err) {
        console.log('Redirect from', response.url(), 'to', response.headers()['location'], err, response.status);
      }
    });

    /* 3 */
    await page.goto(urlToFetch, {
      waitUntil: 'load'
    });

    /* 4 */
    setTimeout(async () => {
      await browser.close();
    }, 60000 * 4);
  }

  // Headless chrome requires a lot or resources.
  function createQueue(tasks, maxNumOfWorkers = 4) {
    var numOfWorkers = 0;
    var taskIndex = 0;

    return new Promise( done => {
      const handleResult = index => result => {
        tasks[index] = result;
        numOfWorkers--;
        getNextTask();
      };
      const getNextTask = () => {
        if (numOfWorkers < maxNumOfWorkers && taskIndex < tasks.length) {
          tasks[taskIndex]().then(handleResult(taskIndex)).catch(handleResult(taskIndex));
          taskIndex++;
          numOfWorkers++;
          getNextTask();
        } else if (numOfWorkers === 0 && taskIndex === tasks.length) {
          done(tasks);
        }
      };
      getNextTask();
    });
  }

  let items = [];

  // Read sites generated by web indexer.
  let xmlInjest = (siteName, path) => {
    fse.readFile(__dirname + path, (err, data) => {
      parser.parseString(data, (err, result) => {
        result.urlset.url.forEach((item, index) => {
          items.push(async () => {
            //console.log(item.loc[0]);
            start(item.loc[0]);
          });
        });
        console.log(JSON.stringify(items[0]));
        // Read X items, Y at a time.
        createQueue(items.slice(0,2), 1);
      });
    });
  };

  //start('https://www.lamayor.org/', 'www');
  xmlInjest('www-lamayor', '/siteMap.xml');

  // CREATES A NEW NOTE
  SpiderController.post('/', VerifyToken, validateNote, SpiderProvider.createNote);

  // RETURNS ALL THE NOTES IN THE DATABASE
  SpiderController.get('/', SpiderProvider.getNotes);

  // GETS A SINGLE NOTE FROM THE DATABASE
  SpiderController.get('/:id', SpiderProvider.getNote);

  // DELETES A NOTE FROM THE DATABASE
  SpiderController.delete('/:id', VerifyToken, SpiderProvider.deleteNote);

  // UPDATES A SINGLE NOTE IN THE DATABASE
  SpiderController.put('/:id', VerifyToken, SpiderProvider.putNote);

  return SpiderController;

};