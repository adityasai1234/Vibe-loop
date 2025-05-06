import axios from 'axios';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

// Get Spotify access token using client credentials
export const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}; 