const puppeteer = require('puppeteer'); // v 1.1.0
const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
const xml = require('xml2js');

async function start(urlToFetch, pathName) {
  /* 1 */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
   await page.setRequestInterception(true);
  /* 2 */
  page.on('response', async (response) => {

    try {
      const status = response.status;

      page.on("console", (log)=>{
        console.log(log.text());
      });
      const url = new URL(response.url());

      console.log(interceptedRequest.url(), url, status);
      if(interceptedRequest.url().endsWith('/api')){
          interceptedRequest.respond({
              status: 422,
              body: "FAKE"
          })
      } else interceptedRequest.continue();

      let filePath = path.resolve(`./output/` + pathName + '/' + `${url.pathname}`);
      if (path.extname(url.pathname).trim() === '') {
        filePath = `${filePath}/index.html`;
      }
      if ((status >= 300) && (status <= 399)) {
          console.log('Redirect from', response.url(), 'to', response.headers()['location']);

        await new Promise(function(resolve, reject) {
            // Save Data
            resolve(null);
        });
      } else {
        await fse.outputFile(filePath, await response.buffer());
      }

    } catch (err) {
        console.log('Redirect from', response.url(), 'to', response.headers()['location']);

      console.log(err, response.status)
    }
  });



  /* 3 */
  await page.goto(urlToFetch, {
    waitUntil: 'networkidle2'
  });

  /* 4 */
  setTimeout(async () => {
    await browser.close();
  }, 60000 * 4);
}

// start('https://www.lamayor.org/', 'www');
// start('https://sdg.lamayor.org/', 'sdg');
// start('https://sdgdata.lamayor.org/', 'sdgdata');