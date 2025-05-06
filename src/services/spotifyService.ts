import { auth } from '../config/firebase';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Types
interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  product: 'premium' | 'free';
  type: 'user';
  uri: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache for API responses
const cache = new Map<string, CacheEntry<any>>();

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

// Helper function to get access token with caching
const getAccessToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  
  const cacheKey = `token_${user.uid}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const token = await user.getIdToken();
  const response = await fetch('/api/spotify/token', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get Spotify access token: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Invalid token response from server');
  }
  
  cache.set(cacheKey, { data: data.access_token, timestamp: Date.now() });
  return data.access_token;
};

// Generic fetch wrapper with caching
const fetchWithCache = async <T>(url: string, options?: RequestInit, useCache = true): Promise<T> => {
  if (useCache) {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  const token = await getAccessToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText} (${response.status})`);
  }

  const data = await response.json();
  if (useCache) {
    cache.set(url, { data, timestamp: Date.now() });
  }
  return data;
};

// Playback State
export const getPlaybackState = () => fetchWithCache(endpoints.playback.state);
export const getCurrentlyPlaying = () => fetchWithCache(endpoints.playback.currentlyPlaying);

// Playback Control
export const controlPlayback = {
  play: () => fetchWithCache(endpoints.playback.play, { method: 'PUT' }, false),
  pause: () => fetchWithCache(endpoints.playback.pause, { method: 'PUT' }, false),
  next: () => fetchWithCache(endpoints.playback.next, { method: 'POST' }, false),
  previous: () => fetchWithCache(endpoints.playback.previous, { method: 'POST' }, false),
  seek: (position: number) => 
    fetchWithCache(`${endpoints.playback.seek}?position_ms=${position}`, { method: 'PUT' }, false),
  setVolume: (volume: number) => 
    fetchWithCache(`${endpoints.playback.volume}?volume_percent=${volume}`, { method: 'PUT' }, false),
};

// Playlist Management
export const playlistService = {
  getUserPlaylists: () => fetchWithCache(endpoints.playlists.user),
  createPlaylist: (userId: string, name: string, isPublic = false) => 
    fetchWithCache(
      endpoints.playlists.create.replace('{user_id}', userId),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, public: isPublic }),
      },
      false
    ),
  addTracksToPlaylist: (playlistId: string, trackUris: string[]) =>
    fetchWithCache(
      endpoints.playlists.tracks.replace('{playlist_id}', playlistId),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uris: trackUris }),
      },
      false
    ),
};

// Following Management
export const followingService = {
  getFollowingArtists: () => fetchWithCache(endpoints.following.artists),
  followArtist: (artistId: string) =>
    fetchWithCache(
      endpoints.following.artists,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [artistId] }),
      },
      false
    ),
  unfollowArtist: (artistId: string) =>
    fetchWithCache(
      endpoints.following.artists,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [artistId] }),
      },
      false
    ),
  followPlaylist: (playlistId: string) =>
    fetchWithCache(
      endpoints.following.playlists.replace('{playlist_id}', playlistId),
      { method: 'PUT' },
      false
    ),
  unfollowPlaylist: (playlistId: string) =>
    fetchWithCache(
      endpoints.following.playlists.replace('{playlist_id}', playlistId),
      { method: 'DELETE' },
      false
    ),
};

// User Service
export const userService = {
  getCurrentUser: () => fetchWithCache(`${SPOTIFY_API_BASE}/me`),
};

// Mock data for development
export const MOCK_USERS: Record<string, SpotifyUser> = {
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
