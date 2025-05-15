import { Song } from '../types';

export const songs: Song[] = [
  {
    id: 'sunflower',
    title: 'Sunflower',
    artist: 'Post Malone & Swae Lee',
    albumArt: '/images/sunflower-cover.png',
    audioSrc: '/music/youtube_ApXoWvfEYVU_audio.mp3',
    duration: 158, // 2:38 in seconds
    genre: 'Hip Hop',
    releaseDate: '2018',
    likes: 3500,
    mood: ['Happy', 'Chill'],
    tags: ['soundtrack', 'spiderverse', 'pop']
  },
  {
    id: 'bohemian-rhapsody',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    albumArt: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png',
    audioSrc: '/music/bohemian_rhapsody.mp3',
    duration: 354, // 5:54 in seconds
    genre: 'Rock',
    releaseDate: '1975',
    mood: ['Angry', 'Reflective'],
    tags: ['classic', 'rock', 'queen']
  },
  {
    id: '1',
    title: 'Midnight Stroll',
    artist: 'Luna Waves',
    albumArt: 'https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 237,
    audioSrc: 'https://example.com/audio/midnight-stroll.mp3',
    genre: 'Chill',
    releaseDate: '2023-08-15',
    likes: 1245
  },
  {
    id: '2',
    title: 'Electric Dreams',
    artist: 'Neon Pulse',
    albumArt: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 198,
    audioSrc: 'https://example.com/audio/electric-dreams.mp3',
    genre: 'Electronic',
    releaseDate: '2023-10-23',
    likes: 982
  },
  {
    id: '3',
    title: 'Ocean Breeze',
    artist: 'Coastal Echoes',
    albumArt: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 254,
    audioSrc: 'https://example.com/audio/ocean-breeze.mp3',
    genre: 'Ambient',
    releaseDate: '2024-01-07',
    likes: 1567
  },
  {
    id: '4',
    title: 'Urban Rhythm',
    artist: 'Metro Beats',
    albumArt: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 214,
    audioSrc: 'https://example.com/audio/urban-rhythm.mp3',
    genre: 'Hip Hop',
    releaseDate: '2023-12-05',
    likes: 2341
  },
  {
    id: '5',
    title: 'Sunset Memories',
    artist: 'Horizon Flux',
    albumArt: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 187,
    audioSrc: 'https://example.com/audio/sunset-memories.mp3',
    genre: 'Lo-fi',
    releaseDate: '2023-09-18',
    likes: 1876
  },
  {
    id: '6',
    title: 'Crystal Skies',
    artist: 'Aurora Glow',
    albumArt: 'https://images.pexels.com/photos/1617122/pexels-photo-1617122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 302,
    audioSrc: 'https://example.com/audio/crystal-skies.mp3',
    genre: 'Indie',
    releaseDate: '2024-02-28',
    likes: 1102
  },
  {
    id: '7',
    title: 'Midnight Drive',
    artist: 'Neon Pulse',
    albumArt: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 226,
    audioSrc: 'https://example.com/audio/midnight-drive.mp3',
    genre: 'Synthwave',
    releaseDate: '2023-11-12',
    likes: 1843
  },
  {
    id: '8',
    title: 'Summer Nostalgia',
    artist: 'Coastal Echoes',
    albumArt: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 195,
    audioSrc: 'https://example.com/audio/summer-nostalgia.mp3',
    genre: 'Pop',
    releaseDate: '2023-07-21',
    likes: 2194
  }
];

// Search and filter songs
export const searchSongs = ({
  query = '',
  mood = [],
  activity = [],
  timeOfDay = [],
  genre = '',
  limit = 20,
  offset = 0
}: {
  query?: string;
  mood?: string[];
  activity?: string[];
  timeOfDay?: string[];
  genre?: string;
  limit?: number;
  offset?: number;
}) => {
  // Convert query to lowercase for case-insensitive search
  const searchQuery = query.toLowerCase();
  
  // Filter songs based on search query and filters
  let filteredSongs = songs;
  
  // Apply text search if query is provided
  if (searchQuery) {
    filteredSongs = filteredSongs.filter(song => 
      song.title.toLowerCase().includes(searchQuery) ||
      song.artist.toLowerCase().includes(searchQuery) ||
      song.genre.toLowerCase().includes(searchQuery)
    );
  }
  
  // Apply genre filter
  if (genre) {
    filteredSongs = filteredSongs.filter(song => song.genre === genre);
  }
  
  // Sort by popularity (likes) by default
  filteredSongs.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  
  // Calculate total before pagination
  const total = filteredSongs.length;
  
  // Apply pagination
  const paginatedSongs = filteredSongs.slice(offset, offset + limit);
  
  return {
    documents: paginatedSongs,
    total,
    hasMore: total > offset + limit
  };
};

// Get mood suggestions based on time of day
export const getMoodSuggestionsByTime = (): string[] => {
  const currentHour = new Date().getHours();
  
  // Map time of day to moods
  if (currentHour >= 5 && currentHour < 12) {
    // Morning: 5 AM - 12 PM
    return ['energetic', 'happy'];
  } else if (currentHour >= 12 && currentHour < 17) {
    // Afternoon: 12 PM - 5 PM
    return ['confident', 'energetic'];
  } else if (currentHour >= 17 && currentHour < 21) {
    // Evening: 5 PM - 9 PM
    return ['relaxed', 'nostalgic'];
  } else {
    // Night: 9 PM - 5 AM
    return ['chill', 'dreamy'];
  }
};

// Get activity suggestions based on time of day
export const getActivitySuggestions = (): string[] => {
  const currentHour = new Date().getHours();
  
  if (currentHour >= 5 && currentHour < 9) {
    // Early morning
    return ['meditation', 'workout'];
  } else if (currentHour >= 9 && currentHour < 12) {
    // Morning
    return ['study', 'reading'];
  } else if (currentHour >= 12 && currentHour < 17) {
    // Afternoon
    return ['study', 'commuting', 'gaming'];
  } else if (currentHour >= 17 && currentHour < 21) {
    // Evening
    return ['relaxing', 'party', 'driving'];
  } else {
    // Night
    return ['sleeping', 'relaxing', 'reading'];
  }
};