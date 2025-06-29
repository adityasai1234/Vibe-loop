const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

exports.createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    const playlist = new Playlist({ name, user: req.user.id, songs: [] });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    const song = await Song.findById(req.body.songId);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    if (!playlist.songs.includes(song._id)) playlist.songs.push(song._id);
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    playlist.songs = playlist.songs.filter(
      (songId) => songId.toString() !== req.body.songId
    );
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).populate('songs');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 