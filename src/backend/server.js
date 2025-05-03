// ... existing imports ...
import express from "express";
import cors from "cors";
import { getSpotifyToken } from "./getSpotifyToken.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/spotify/token", async (req, res) => {
  const { code, redirectUri } = req.body;
  try {
    const tokenData = await getSpotifyToken(code, redirectUri);
    res.json(tokenData);
  } catch (err) {
    res.status(500).json({ error: "Failed to get token" });
  }
});

// ... existing code ...
app.listen(5000, () => console.log("Backend running on port 5000"));