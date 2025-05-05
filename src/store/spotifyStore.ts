import { create } from 'zustand';
import { 
  getPlaybackState, 
  getCurrentlyPlaying, 
  controlPlayback,
  playlistService,
  followingService,
  userService
} from '../services/spotifyService';

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  product: string;
  type: string;
  uri: string;
}

interface SpotifyState {
  // User Profile
  userProfile: SpotifyUser | null;
  
  // Playback State
  currentTrack: any | null;
  playbackState: any | null;
  isPlaying: boolean;
  deviceInfo: any | null;
  
  // Playlists
  userPlaylists: any[];
  loadingPlaylists: boolean;
  
  // Following
  followingArtists: any[];
  loadingFollowing: boolean;
  
  // Actions
  fetchUserProfile: () => Promise<SpotifyUser>;
  fetchPlaybackState: () => Promise<void>;
  fetchCurrentlyPlaying: () => Promise<void>;
  togglePlayback: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  
  // Playlist Actions
  fetchUserPlaylists: () => Promise<void>;
  createPlaylist: (name: string, isPublic?: boolean) => Promise<any>;
  addTracksToPlaylist: (playlistId: string, trackUris: string[]) => Promise<any>;
  
  // Following Actions
  fetchFollowingArtists: () => Promise<void>;
  followArtist: (artistId: string) => Promise<void>;
  unfollowArtist: (artistId: string) => Promise<void>;
  followPlaylist: (playlistId: string) => Promise<void>;
  unfollowPlaylist: (playlistId: string) => Promise<void>;
}

export const useSpotifyStore = create<SpotifyState>((set, get) => ({
  // Initial State
  userProfile: null,
  currentTrack: null,
  playbackState: null,
  isPlaying: false,
  deviceInfo: null,
  userPlaylists: [],
  loadingPlaylists: false,
  followingArtists: [],
  loadingFollowing: false,

  // User Profile Actions
  fetchUserProfile: async () => {
    try {
      const profile = await userService.getCurrentUser();
      set({ userProfile: profile });
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Playback Actions
  fetchPlaybackState: async () => {
    try {
      const state = await getPlaybackState();
      set({
        playbackState: state,
        isPlaying: state?.is_playing || false,
        deviceInfo: state?.device || null
      });
    } catch (error) {
      console.error('Error fetching playback state:', error);
    }
  },

  fetchCurrentlyPlaying: async () => {
    try {
      const track = await getCurrentlyPlaying();
      set({ currentTrack: track });
    } catch (error) {
      console.error('Error fetching currently playing:', error);
    }
  },

  togglePlayback: async () => {
    const { isPlaying } = get();
    try {
      if (isPlaying) {
        await controlPlayback.pause();
      } else {
        await controlPlayback.play();
      }
      set({ isPlaying: !isPlaying });
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  },

  nextTrack: async () => {
    try {
      await controlPlayback.next();
      await get().fetchCurrentlyPlaying();
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  },

  previousTrack: async () => {
    try {
      await controlPlayback.previous();
      await get().fetchCurrentlyPlaying();
    } catch (error) {
      console.error('Error going to previous track:', error);
    }
  },

  seekTo: async (position: number) => {
    try {
      await controlPlayback.seek(position);
      await get().fetchPlaybackState();
    } catch (error) {
      console.error('Error seeking:', error);
    }
  },

  setVolume: async (volume: number) => {
    try {
      await controlPlayback.setVolume(volume);
      await get().fetchPlaybackState();
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  },

  // Playlist Actions
  fetchUserPlaylists: async () => {
    set({ loadingPlaylists: true });
    try {
      const playlists = await playlistService.getUserPlaylists();
      set({ userPlaylists: playlists.items, loadingPlaylists: false });
    } catch (error) {
      console.error('Error fetching playlists:', error);
      set({ loadingPlaylists: false });
    }
  },

  createPlaylist: async (name: string, isPublic = false) => {
    try {
      const profile = await get().fetchUserProfile();
      if (!profile?.id) {
        throw new Error('User profile not found');
      }
      const playlist = await playlistService.createPlaylist(profile.id, name, isPublic);
      await get().fetchUserPlaylists();
      return playlist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  },

  addTracksToPlaylist: async (playlistId: string, trackUris: string[]) => {
    try {
      const result = await playlistService.addTracksToPlaylist(playlistId, trackUris);
      return result;
    } catch (error) {
      console.error('Error adding tracks to playlist:', error);
      throw error;
    }
  },

  // Following Actions
  fetchFollowingArtists: async () => {
    set({ loadingFollowing: true });
    try {
      const artists = await followingService.getFollowingArtists();
      set({ followingArtists: artists.artists.items, loadingFollowing: false });
    } catch (error) {
      console.error('Error fetching following artists:', error);
      set({ loadingFollowing: false });
    }
  },

  followArtist: async (artistId: string) => {
    try {
      await followingService.followArtist(artistId);
      await get().fetchFollowingArtists();
    } catch (error) {
      console.error('Error following artist:', error);
    }
  },

  unfollowArtist: async (artistId: string) => {
    try {
      await followingService.unfollowArtist(artistId);
      await get().fetchFollowingArtists();
    } catch (error) {
      console.error('Error unfollowing artist:', error);
    }
  },

  followPlaylist: async (playlistId: string) => {
    try {
      await followingService.followPlaylist(playlistId);
      await get().fetchUserPlaylists();
    } catch (error) {
      console.error('Error following playlist:', error);
    }
  },

  unfollowPlaylist: async (playlistId: string) => {
    try {
      await followingService.unfollowPlaylist(playlistId);
      await get().fetchUserPlaylists();
    } catch (error) {
      console.error('Error unfollowing playlist:', error);
    }
  },
})); 