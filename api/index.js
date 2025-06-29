const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory song storage (replace with DB for production)
let songs = [];

// Hetzner S3 config from environment variables
const s3 = new S3Client({
  endpoint: process.env.HETZNER_ENDPOINT,
  region: process.env.HETZNER_REGION,
  credentials: {
    accessKeyId: process.env.HETZNER_ACCESS_KEY,
    secretAccessKey: process.env.HETZNER_SECRET_KEY,
  },
  forcePathStyle: true,
});
const BUCKET_NAME = process.env.HETZNER_BUCKET_NAME;

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload song metadata
app.post('/api/upload', (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Missing title or url' });
  }
  const song = { id: Date.now(), title, url };
  songs.push(song);
  res.status(201).json({ message: 'Song uploaded', song });
});

// List all songs
app.get('/api/uploads', (req, res) => {
  res.json(songs);
});

// Upload file to Hetzner
app.post('/api/upload-to-hetzner', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const fileKey = `uploads/${Date.now()}-${file.originalname}`;
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));
    const publicUrl = `${process.env.HETZNER_ENDPOINT}/${BUCKET_NAME}/${fileKey}`;
    res.json({ publicUrl });
  } catch (error) {
    console.error('Hetzner upload error:', error);
    res.status(500).json({ error: 'Failed to upload to Hetzner', details: error.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app); 