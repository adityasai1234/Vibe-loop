const Song = require('../models/Song');
const path = require('path');

exports.uploadSong = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { title, artist, album } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const song = new Song({
      title,
      artist,
      album,
      fileUrl,
      user: req.user.id,
    });
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('user', 'username');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    if (song.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await song.remove();
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 