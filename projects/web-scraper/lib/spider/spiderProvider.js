var Spider = require('./Spider');
module.exports = {
  createSpider: createSpider,
  getSpiders: getSpiders,
  getSpider: getSpider,
  deleteSpider: deleteSpider,
  putSpider: putSpider
};

function createSpider(req, res, next) {
  return Spider.create({
    title : req.body.title,
    description : req.body.description,
    pinned : req.body.pinned
  })
    .then(note => res.status(200).send(note))
    .catch(err => next(new Error(err)));
}

function getSpiders(req, res, next) {
  return Spider.find({})
    .then(Spiders => res.status(200).send(notes))
    .catch(err => next(new Error(err)));
}

function getSpider(req, res, next) {
  return Spider.findById(req.params.id)
    .then(Spider => {
      if (!Spider) return res.status(404).send('No Spider found.');
      res.status(200).send(Spider);
    })
    .catch(err => next(new Error(err)));
}

function deleteSpider(req, res, next) {
  return Spider.findByIdAndRemove(req.params.id)
    .then(Spider => res.status(200).send(Spider))
    .catch(err => next(new Error(err)));
}

function putSpider(req, res, next) {
  return Spider.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(Spider => res.status(200).send(Spider))
    .catch(err => next(new Error(err)));
}