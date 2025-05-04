import axios from "axios";

export async function getSpotifyToken(code, redirectUri) {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${authHeader}`,
        },
      }
    );
    return response.data; // { access_token, refresh_token, expires_in, ... }
  } catch (error) {
    console.error("Error fetching Spotify token:", error.response?.data || error.message);
    throw new Error("Failed to get Spotify token, please try again later.");
  }
}