const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPlaylists,
} = require('../controllers/playlistController');
const auth = require('../middleware/auth');

router.post('/', auth, createPlaylist);
router.post('/:id/add', auth, addSongToPlaylist);
router.post('/:id/remove', auth, removeSongFromPlaylist);
router.get('/', auth, getPlaylists);

module.exports = router; 