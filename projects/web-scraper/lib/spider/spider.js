var mongoose = require('mongoose');
var SpiderSchema = new mongoose.Schema({
  title: String,
  description: String,
  pinned: { type: Boolean, default: false }
});
mongoose.model('Spider', NoteSchema);

module.exports = mongoose.model('Spider');