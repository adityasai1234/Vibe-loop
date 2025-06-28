import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let uploadedSongs = [];  // ⬅️ Stores multiple songs like [ { title, url }, ... ]

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
  console.log("All Songs:", uploadedSongs); // ✅ Debug
  res.status(201).json({ message: "Song uploaded", song });
});

// Get all uploaded songs
app.get('/api/uploads', (req, res) => {
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
  console.log(`🎵 Songs: http://localhost:${PORT}/api/uploads`);
}); 