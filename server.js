import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// File to store songs persistently
const SONGS_FILE = 'songs.json';

// Load songs from file or start with empty array
let uploadedSongs = [];
try {
  if (fs.existsSync(SONGS_FILE)) {
    const data = fs.readFileSync(SONGS_FILE, 'utf8');
    uploadedSongs = JSON.parse(data);
    console.log(`📂 Loaded ${uploadedSongs.length} songs from ${SONGS_FILE}`);
  }
} catch (error) {
  console.error('Error loading songs from file:', error);
  uploadedSongs = [];
}

// Function to save songs to file
const saveSongsToFile = () => {
  try {
    fs.writeFileSync(SONGS_FILE, JSON.stringify(uploadedSongs, null, 2));
    console.log(`💾 Saved ${uploadedSongs.length} songs to ${SONGS_FILE}`);
  } catch (error) {
    console.error('Error saving songs to file:', error);
  }
};

// More explicit CORS configuration
app.use(cors({
  origin: true, // Allow all origins for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'unknown'}`);
  next();
});

app.use(express.json());

// Add new song to the list
app.post('/api/upload', (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: "Missing title or url" });
  }

  const song = {
    id: Date.now(),
    title,
    url
  };

  uploadedSongs.push(song); // ⬅️ Add to array, don't replace
  saveSongsToFile(); // Save to file immediately
  
  console.log("🎵 New song added:", song);
  console.log("📊 All Songs count:", uploadedSongs.length);
  console.log("📋 All Songs:", uploadedSongs);
  res.status(201).json({ message: "Song uploaded", song });
});

// Get all uploaded songs
app.get('/api/uploads', (req, res) => {
  console.log("📡 GET /api/uploads requested");
  console.log("📊 Returning", uploadedSongs.length, "songs");
  console.log("📋 Songs:", uploadedSongs);
  res.json(uploadedSongs);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    songsCount: uploadedSongs.length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
  console.log(`🎵 Songs list: http://localhost:${PORT}/api/uploads`);
  console.log(`📊 Current songs in memory:`, uploadedSongs.length);
}); 