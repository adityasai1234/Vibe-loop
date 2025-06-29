const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadSong, getSongs, deleteSong } = require('../controllers/songController');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only MP3 and WAV files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post('/upload', auth, upload.single('file'), uploadSong);
router.get('/', getSongs);
router.delete('/:id', auth, deleteSong);

module.exports = router; 