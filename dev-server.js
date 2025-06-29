import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Load environment variables from env_temp.txt
const envPath = path.join(__dirname, 'env_temp.txt');
let envVars = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
}

// Hetzner S3 client
const s3Client = new S3Client({
  endpoint: envVars.HETZNER_ENDPOINT || 'https://serenidad.hel1.your-objectstorage.com',
  region: envVars.HETZNER_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: envVars.HETZNER_ACCESS_KEY || '1BY6DNARWDPSQT4DXA18',
    secretAccessKey: envVars.HETZNER_SECRET_KEY || 'ieGy5o6biNPCc09iKbE55sPe01JywW8u5pFpnk8J'
  },
  forcePathStyle: true
});

const BUCKET_NAME = envVars.HETZNER_BUCKET_NAME || 'serenidad';

// In-memory song storage
let songs = [];

// Load existing songs from songs.json
try {
  if (fs.existsSync(path.join(__dirname, 'songs.json'))) {
    const songsData = fs.readFileSync(path.join(__dirname, 'songs.json'), 'utf8');
    songs = JSON.parse(songsData);
    console.log(`Loaded ${songs.length} songs from songs.json`);
  }
} catch (error) {
  console.error('Error loading songs.json:', error);
}

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API Routes
app.get('/api/uploads', (req, res) => {
  res.json(songs);
});

app.post('/api/upload', (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Missing title or url' });
  }
  const song = { id: Date.now(), title, url };
  songs.unshift(song); // Add to beginning
  res.status(201).json({ message: 'Song uploaded', song });
});

// Upload file to Hetzner
app.post('/api/upload-to-hetzner', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.body.userId;
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.originalname);
    const baseName = file.originalname.replace(/\.[^/.]+$/, '');
    
    let fileKey;
    if (userId) {
      fileKey = `users/${userId}/${timestamp}-${randomId}-${baseName}${extension}`;
    } else {
      fileKey = `uploads/${timestamp}-${randomId}-${baseName}${extension}`;
    }

    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const publicUrl = `${envVars.HETZNER_ENDPOINT || 'https://serenidad.hel1.your-objectstorage.com'}/${BUCKET_NAME}/${fileKey}`;
    
    // Add to local songs array
    const song = {
      id: timestamp,
      title: file.originalname,
      url: publicUrl
    };
    songs.unshift(song);

    console.log('✅ File uploaded to Hetzner:', {
      fileKey,
      publicUrl,
      bucket: BUCKET_NAME
    });

    res.json({
      success: true,
      fileKey,
      publicUrl: publicUrl,
    });
  } catch (error) {
    console.error('❌ Hetzner upload error:', error);
    res.status(500).json({ error: 'Failed to upload to Hetzner', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log(`📁 API endpoints available:`);
  console.log(`   GET  /api/uploads - List all songs`);
  console.log(`   POST /api/upload - Upload song metadata`);
  console.log(`   POST /api/upload-to-hetzner - Upload file to Hetzner`);
  console.log(`🌐 Hetzner Bucket: ${BUCKET_NAME}`);
}); 