import axios from 'axios';

export async function getMoodPlaylist(token, moodParams) {
  // Check for required parameters
  if (
    !token ||
    !moodParams ||
    !Array.isArray(moodParams.genres) ||
    moodParams.genres.length === 0 ||
    typeof moodParams.valence !== "number" ||
    typeof moodParams.energy !== "number"
  ) {
    console.error("Invalid parameters for getMoodPlaylist:", { token, moodParams });
    return [];
  }

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          seed_genres: moodParams.genres.join(','),
          target_valence: moodParams.valence,
          target_energy: moodParams.energy,
          limit: 20,
        },
      }
    );
    return response.data.tracks || [];
  } catch (error) {
    console.error("Error fetching mood playlist:", error);
    return [];
  }
}