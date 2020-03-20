module.exports = function (app) {
  if (!app) throw new Error('Missing parameter: \'app\' not provided.');

  var express = require('express');
  var SpiderController = express.Router();
  var SpiderProvider = require('./spiderProvider');
  var validateSpider = require('./validateSpider');
  var VerifyToken = require(__root + 'auth/VerifyToken')(app);


  // CREATES A NEW NOTE
  SpiderController.post('/', VerifyToken, validateSpider, SpiderProvider.createSpider);

  // RETURNS ALL THE NOTES IN THE DATABASE
  SpiderController.get('/', SpiderProvider.getSpiders);

  // GETS A SINGLE NOTE FROM THE DATABASE
  SpiderController.get('/:id', SpiderProvider.getSpiders);

  // DELETES A NOTE FROM THE DATABASE
  SpiderController.delete('/:id', VerifyToken, SpiderProvider.deleteSpider);

  // UPDATES A SINGLE NOTE IN THE DATABASE
  SpiderController.put('/:id', SpiderProvider.putSpider);

  return SpiderController;

};