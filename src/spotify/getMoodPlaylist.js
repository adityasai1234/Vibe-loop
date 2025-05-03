import axios from 'axios';

export async function getMoodPlaylist(token, moodParams) {
  // moodParams: { valence, energy, genres }
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
  return response.data.tracks;
}