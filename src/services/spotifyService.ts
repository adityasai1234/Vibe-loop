import { auth } from '../config/firebase';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Spotify API endpoints
const endpoints = {
  playback: {
    state: `${SPOTIFY_API_BASE}/me/player`,
    currentlyPlaying: `${SPOTIFY_API_BASE}/me/player/currently-playing`,
    devices: `${SPOTIFY_API_BASE}/me/player/devices`,
    play: `${SPOTIFY_API_BASE}/me/player/play`,
    pause: `${SPOTIFY_API_BASE}/me/player/pause`,
    next: `${SPOTIFY_API_BASE}/me/player/next`,
    previous: `${SPOTIFY_API_BASE}/me/player/previous`,
    seek: `${SPOTIFY_API_BASE}/me/player/seek`,
    volume: `${SPOTIFY_API_BASE}/me/player/volume`,
  },
  playlists: {
    user: `${SPOTIFY_API_BASE}/me/playlists`,
    create: `${SPOTIFY_API_BASE}/users/{user_id}/playlists`,
    modify: `${SPOTIFY_API_BASE}/playlists/{playlist_id}`,
    tracks: `${SPOTIFY_API_BASE}/playlists/{playlist_id}/tracks`,
  },
  following: {
    artists: `${SPOTIFY_API_BASE}/me/following?type=artist`,
    users: `${SPOTIFY_API_BASE}/me/following?type=user`,
    playlists: `${SPOTIFY_API_BASE}/playlists/{playlist_id}/followers`,
  },
};

// Helper function to get access token
const getAccessToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  
  // Get the Spotify access token from your backend
  const token = await user.getIdToken();
  const response = await fetch('/api/spotify/token', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to get Spotify access token');
  const data = await response.json();
  return data.access_token;
};

// Playback State
export const getPlaybackState = async () => {
  const token = await getAccessToken();
  const response = await fetch(endpoints.playback.state, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getCurrentlyPlaying = async () => {
  const token = await getAccessToken();
  const response = await fetch(endpoints.playback.currentlyPlaying, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Playback Control
export const controlPlayback = {
  play: async () => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.playback.play, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to play');
  },

  pause: async () => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.playback.pause, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to pause');
  },

  next: async () => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.playback.next, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to skip to next track');
  },

  previous: async () => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.playback.previous, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to go to previous track');
  },

  seek: async (position: number) => {
    const token = await getAccessToken();
    const response = await fetch(`${endpoints.playback.seek}?position_ms=${position}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to seek');
  },

  setVolume: async (volume: number) => {
    const token = await getAccessToken();
    const response = await fetch(`${endpoints.playback.volume}?volume_percent=${volume}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to set volume');
  },
};

// Playlist Management
export const playlistService = {
  getUserPlaylists: async () => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.playlists.user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get user playlists');
    return response.json();
  },

  createPlaylist: async (userId: string, name: string, isPublic = false) => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.playlists.create.replace('{user_id}', userId), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        public: isPublic,
      }),
    });
    if (!response.ok) throw new Error('Failed to create playlist');
    return response.json();
  },

  addTracksToPlaylist: async (playlistId: string, trackUris: string[]) => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.playlists.tracks.replace('{playlist_id}', playlistId), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    });
    if (!response.ok) throw new Error('Failed to add tracks to playlist');
    return response.json();
  },
};

// Following Management
export const followingService = {
  getFollowingArtists: async () => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.following.artists, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get following artists');
    return response.json();
  },

  followArtist: async (artistId: string) => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.following.artists, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: [artistId],
      }),
    });
    if (!response.ok) throw new Error('Failed to follow artist');
  },

  unfollowArtist: async (artistId: string) => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.following.artists, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: [artistId],
      }),
    });
    if (!response.ok) throw new Error('Failed to unfollow artist');
  },

  followPlaylist: async (playlistId: string) => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.following.playlists.replace('{playlist_id}', playlistId), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to follow playlist');
  },

  unfollowPlaylist: async (playlistId: string) => {
    const token = await getAccessToken();
    const response = await fetch(endpoints.following.playlists.replace('{playlist_id}', playlistId), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to unfollow playlist');
  },
};

// User Service
export const userService = {
  getCurrentUser: async () => {
    const token = await getAccessToken();
    const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  },
};

// Mock data for development
const MOCK_USERS = {
  'spotify:user:123456789': {
    id: '123456789',
    display_name: 'John Doe',
    email: 'john@example.com',
    images: [{ url: 'https://i.pravatar.cc/150?u=john' }],
    product: 'premium',
    type: 'user',
    uri: 'spotify:user:123456789'
  },
  'spotify:user:987654321': {
    id: '987654321',
    display_name: 'Jane Smith',
    email: 'jane@example.com',
    images: [{ url: 'https://i.pravatar.cc/150?u=jane' }],
    product: 'free',
    type: 'user',
    uri: 'spotify:user:987654321'
  },
  'spotify:user:456789123': {
    id: '456789123',
    display_name: 'Alex Johnson',
    email: 'alex@example.com',
    images: [{ url: 'https://i.pravatar.cc/150?u=alex' }],
    product: 'premium',
    type: 'user',
    uri: 'spotify:user:456789123'
  },
  'spotify:user:789123456': {
    id: '789123456',
    display_name: 'Sarah Wilson',
    email: 'sarah@example.com',
    images: [{ url: 'https://i.pravatar.cc/150?u=sarah' }],
    product: 'premium',
    type: 'user',
    uri: 'spotify:user:789123456'
  }
}; 