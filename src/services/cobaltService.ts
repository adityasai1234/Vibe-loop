// Import mock implementation instead of the real package
import { createClient } from '../lib/mockCobaltClient';

// Initialize Cobalt client
const cobaltClient = createClient({
  projectId: process.env.COBALT_PROJECT_ID || 'vibeloop',
  apiKey: process.env.COBALT_API_KEY || 'your-api-key-here', // Replace with your actual API key
});

// Define the Song interface with enhanced metadata for search and filtering
export interface CobaltSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  tags: string[];
  duration: number;
  albumArt: string;
  audioSrc: string;
  releaseDate: string;
  likes?: number;
  mood?: string[];
  activity?: string[];
  timeOfDay?: string[];
}

// Sample song data to seed into Cobalt
export const sampleSongs: CobaltSong[] = [
  {
    id: 'song-001',
    title: 'Snowman',
    artist: 'WYS',
    genre: 'Lo-fi',
    tags: ['chill', 'study', 'rainy', 'lofi', 'relax'],
    duration: 198,
    albumArt: '/images/lofi/snowman.jpg',
    audioSrc: '/audio/lofi/snowman.mp3',
    releaseDate: '2022-03-15',
    mood: ['chill', 'relaxed'],
    activity: ['study', 'reading'],
    timeOfDay: ['night', 'evening']
  },
  {
    id: 'song-002',
    title: 'Midnight Stroll',
    artist: 'Luna Waves',
    genre: 'Chill',
    tags: ['night', 'walk', 'ambient', 'electronic'],
    duration: 237,
    albumArt: 'https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audioSrc: 'https://example.com/audio/midnight-stroll.mp3',
    releaseDate: '2023-08-15',
    likes: 1245,
    mood: ['chill', 'contemplative'],
    activity: ['walking', 'relaxing'],
    timeOfDay: ['night']
  },
  {
    id: 'song-003',
    title: 'Electric Dreams',
    artist: 'Neon Pulse',
    genre: 'Electronic',
    tags: ['upbeat', 'energetic', 'synth', 'dance'],
    duration: 198,
    albumArt: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audioSrc: 'https://example.com/audio/electric-dreams.mp3',
    releaseDate: '2023-10-23',
    likes: 982,
    mood: ['happy', 'energetic'],
    activity: ['party', 'workout'],
    timeOfDay: ['day', 'afternoon']
  },
  {
    id: 'song-004',
    title: 'Ocean Breeze',
    artist: 'Coastal Echoes',
    genre: 'Ambient',
    tags: ['calm', 'nature', 'ocean', 'peaceful'],
    duration: 254,
    albumArt: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audioSrc: 'https://example.com/audio/ocean-breeze.mp3',
    releaseDate: '2024-01-07',
    likes: 1567,
    mood: ['calm', 'peaceful'],
    activity: ['meditation', 'sleep'],
    timeOfDay: ['morning', 'evening']
  },
  {
    id: 'song-005',
    title: 'Urban Rhythm',
    artist: 'Metro Beats',
    genre: 'Hip Hop',
    tags: ['urban', 'beats', 'rhythm', 'city'],
    duration: 214,
    albumArt: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audioSrc: 'https://example.com/audio/urban-rhythm.mp3',
    releaseDate: '2023-12-05',
    likes: 2341,
    mood: ['energetic', 'confident'],
    activity: ['workout', 'commuting'],
    timeOfDay: ['day']
  },
  {
    id: 'song-006',
    title: 'Sunset Memories',
    artist: 'Horizon Flux',
    genre: 'Lo-fi',
    tags: ['nostalgic', 'sunset', 'warm', 'memories'],
    duration: 187,
    albumArt: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audioSrc: 'https://example.com/audio/sunset-memories.mp3',
    releaseDate: '2023-09-18',
    likes: 1876,
    mood: ['nostalgic', 'calm'],
    activity: ['relaxing', 'reflecting'],
    timeOfDay: ['evening']
  },
  {
    id: 'song-007',
    title: 'Crystal Skies',
    artist: 'Aurora Glow',
    genre: 'Indie',
    tags: ['dreamy', 'atmospheric', 'indie', 'ethereal'],
    duration: 302,
    albumArt: 'https://images.pexels.com/photos/1617122/pexels-photo-1617122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audioSrc: 'https://example.com/audio/crystal-skies.mp3',
    releaseDate: '2024-02-28',
    likes: 1102,
    mood: ['dreamy', 'inspired'],
    activity: ['creating', 'daydreaming'],
    timeOfDay: ['night']
  },
  {
    id: 'song-008',
    title: 'Midnight Drive',
    artist: 'Neon Pulse',
    genre: 'Synthwave',
    tags: ['retro', 'night', 'driving', 'synth'],
    duration: 226,
    albumArt: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audioSrc: 'https://example.com/audio/midnight-drive.mp3',
    releaseDate: '2023-11-12',
    likes: 1843,
    mood: ['energetic', 'nostalgic'],
    activity: ['driving', 'gaming'],
    timeOfDay: ['night']
  },
  {
    id: 'song-009',
    title: 'Summer Nostalgia',
    artist: 'Coastal Echoes',
    genre: 'Pop',
    tags: ['summer', 'upbeat', 'nostalgic', 'happy'],
    duration: 195,
    albumArt: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audioSrc: 'https://example.com/audio/summer-nostalgia.mp3',
    releaseDate: '2023-07-21',
    likes: 2194,
    mood: ['happy', 'nostalgic'],
    activity: ['beach', 'party'],
    timeOfDay: ['day']
  },
  {
    id: 'song-010',
    title: 'Rainy Day Jazz',
    artist: 'Mellow Tones',
    genre: 'Jazz',
    tags: ['rainy', 'jazz', 'cozy', 'relaxing'],
    duration: 245,
    albumArt: '/images/jazz/rainy-day.jpg',
    audioSrc: '/audio/jazz/rainy-day.mp3',
    releaseDate: '2022-11-08',
    mood: ['relaxed', 'contemplative'],
    activity: ['reading', 'relaxing'],
    timeOfDay: ['evening', 'night']
  }
];

// Function to seed songs into Cobalt CMS
export const seedSongsToCobalt = async () => {
  try {
    // Check if songs collection exists, if not create it
    const collections = await cobaltClient.getCollections();
    if (!collections.find(c => c.name === 'songs')) {
      await cobaltClient.createCollection({
        name: 'songs',
        fields: [
          { name: 'title', type: 'string', required: true },
          { name: 'artist', type: 'string', required: true },
          { name: 'genre', type: 'string', required: true },
          { name: 'tags', type: 'array', required: true },
          { name: 'duration', type: 'number', required: true },
          { name: 'albumArt', type: 'string', required: true },
          { name: 'audioSrc', type: 'string', required: true },
          { name: 'releaseDate', type: 'string', required: true },
          { name: 'likes', type: 'number', required: false },
          { name: 'mood', type: 'array', required: false },
          { name: 'activity', type: 'array', required: false },
          { name: 'timeOfDay', type: 'array', required: false }
        ]
      });
    }

    // Seed songs into the collection
    for (const song of sampleSongs) {
      await cobaltClient.createDocument('songs', song);
    }

    console.log('Successfully seeded songs to Cobalt CMS');
    return true;
  } catch (error) {
    console.error('Error seeding songs to Cobalt:', error);
    return false;
  }
};

// Function to search songs with various filters
export const searchSongs = async ({
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
  try {
    let queryParams: any = {};
    
    // Add text search if query is provided
    if (query) {
      queryParams.search = query;
      queryParams.searchFields = ['title', 'artist', 'tags'];
    }
    
    // Add filters for mood, activity, timeOfDay if provided
    if (mood && mood.length > 0) {
      queryParams.mood = { $containsAny: mood };
    }
    
    if (activity && activity.length > 0) {
      queryParams.activity = { $containsAny: activity };
    }
    
    if (timeOfDay && timeOfDay.length > 0) {
      queryParams.timeOfDay = { $containsAny: timeOfDay };
    }
    
    // Add genre filter if provided
    if (genre) {
      queryParams.genre = genre;
    }
    
    // Execute the query
    const result = await cobaltClient.getDocuments('songs', {
      query: queryParams,
      limit,
      offset,
      sort: { likes: -1 } // Sort by popularity (likes) by default
    });
    
    return result;
  } catch (error) {
    console.error('Error searching songs:', error);
    return { documents: [], total: 0 };
  }
};

// Function to get song recommendations based on context
export const getContextualSongs = async ({
  mood = [],
  activity = [],
  timeOfDay = [],
  limit = 5
}: {
  mood?: string[];
  activity?: string[];
  timeOfDay?: string[];
  limit?: number;
}) => {
  try {
    // Create a query based on the provided context
    const contextQuery: any = {};
    
    if (mood && mood.length > 0) {
      contextQuery.mood = { $containsAny: mood };
    }
    
    if (activity && activity.length > 0) {
      contextQuery.activity = { $containsAny: activity };
    }
    
    if (timeOfDay && timeOfDay.length > 0) {
      contextQuery.timeOfDay = { $containsAny: timeOfDay };
    }
    
    // Get songs matching the context
    const result = await cobaltClient.getDocuments('songs', {
      query: contextQuery,
      limit,
      sort: { likes: -1 } // Sort by popularity
    });
    
    return result.documents as CobaltSong[];
  } catch (error) {
    console.error('Error getting contextual songs:', error);
    return [];
  }
};

// Function to get song by ID
export const getSongById = async (id: string) => {
  try {
    const song = await cobaltClient.getDocument('songs', id);
    return song as CobaltSong;
  } catch (error) {
    console.error(`Error getting song with ID ${id}:`, error);
    return null;
  }
};

export default {
  seedSongsToCobalt,
  searchSongs,
  getContextualSongs,
  getSongById,
  sampleSongs
};