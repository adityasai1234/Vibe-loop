import React, { useEffect, useState } from "react";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/spotify-callback"; // Change to your deployed URL in production
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPE = "user-read-private user-read-email playlist-modify-public playlist-modify-private";

export default function SpotifyLogin() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // Exchange code for token via backend
      fetch("http://localhost:5000/api/spotify/token", { // Change to your backend URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            setToken(data.access_token);
            window.history.replaceState({}, document.title, "/"); // Clean up URL
          } else {
            setError("Failed to get access token");
          }
        })
        .catch(() => setError("Failed to get access token"));
    }
  }, []);

  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-96 max-w-full flex flex-col gap-6 items-center">
        <h2 className="text-2xl font-bold text-center mb-2">Vibeloop Spotify Login</h2>
        {!token ? (
          <button
            onClick={handleLogin}
            className="bg-green-500 text-white rounded-lg py-2 px-6 font-semibold hover:bg-green-600 transition"
          >
            Login with Spotify
          </button>
        ) : (
          <div className="text-green-700 font-semibold">Logged in! Access token received.</div>
        )}
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
}