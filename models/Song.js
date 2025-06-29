const mongoose = require('mongoose');
const SongSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  artist:   { type: String },
  album:    { type: String },
  filepath: { type: String, required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
module.exports = mongoose.model('Song', SongSchema); 