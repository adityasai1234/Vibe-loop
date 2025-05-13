// Import mock implementation instead of the real package
import { createClient } from '../lib/mockCobaltClient';
// Import mock implementation instead of the real package
import Fuse from '../lib/mockFuse';
import { CobaltSong } from './cobaltService';

// Initialize Cobalt client
const cobaltClient = createClient({
  projectId: process.env.COBALT_PROJECT_ID || 'vibeloop',
  apiKey: process.env.COBALT_API_KEY || 'your-api-key-here',
});

// Cache for songs to improve performance and enable fuzzy search
let songsCache: CobaltSong[] = [];
let fuseInstance: Fuse<CobaltSong> | null = null;

// Initialize the Fuse.js instance for fuzzy search
const initializeFuse = (songs: CobaltSong[]) => {
  // Configure Fuse.js options for fuzzy search
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'artist', weight: 1.5 },
      { name: 'genre', weight: 1 },
      { name: 'tags', weight: 0.8 },
      { name: 'mood', weight: 0.7 },
      { name: 'activity', weight: 0.6 }
    ],
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true,
    useExtendedSearch: true
  };
  
  fuseInstance = new Fuse(songs, fuseOptions);
  return fuseInstance;
};

// Load songs into cache and initialize Fuse.js
export const loadSongsCache = async (): Promise<boolean> => {
  try {
    const result = await cobaltClient.getDocuments('songs', {
      limit: 1000 // Adjust based on your collection size
    });
    
    if (result && 'documents' in result) {
      songsCache = result.documents as CobaltSong[];
      initializeFuse(songsCache);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error loading songs cache:', error);
    return false;
  }
};

// Enhanced search function with fuzzy search capabilities
export const enhancedSearchSongs = async ({
  query = '',
  mood = [],
  activity = [],
  timeOfDay = [],
  genre = '',
  limit = 20,
  offset = 0,
  useFuzzySearch = true
}: {
  query?: string;
  mood?: string[];
  activity?: string[];
  timeOfDay?: string[];
  genre?: string;
  limit?: number;
  offset?: number;
  useFuzzySearch?: boolean;
}) => {
  try {
    // Ensure cache is loaded
    if (songsCache.length === 0) {
      await loadSongsCache();
    }
    
    // If fuzzy search is enabled and we have a query, use Fuse.js
    if (useFuzzySearch && query && fuseInstance) {
      // Perform fuzzy search
      const fuseResults = fuseInstance.search(query);
      let filteredResults = fuseResults.map(result => result.item);
      
      // Apply additional filters
      if (mood.length > 0 || activity.length > 0 || timeOfDay.length > 0 || genre) {
        filteredResults = filteredResults.filter(song => {
          // Filter by mood
          if (mood.length > 0 && (!song.mood || !mood.some(m => song.mood?.includes(m)))) {
            return false;
          }
          
          // Filter by activity
          if (activity.length > 0 && (!song.activity || !activity.some(a => song.activity?.includes(a)))) {
            return false;
          }
          
          // Filter by time of day
          if (timeOfDay.length > 0 && (!song.timeOfDay || !timeOfDay.some(t => song.timeOfDay?.includes(t)))) {
            return false;
          }
          
          // Filter by genre
          if (genre && song.genre !== genre) {
            return false;
          }
          
          return true;
        });
      }
      
      // Apply pagination
      const paginatedResults = filteredResults.slice(offset, offset + limit);
      
      return {
        documents: paginatedResults,
        total: filteredResults.length,
        hasMore: filteredResults.length > offset + limit
      };
    } else {
      // Fall back to regular search if fuzzy search is disabled or no query
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
      
      return {
        ...result,
        hasMore: result.total > offset + limit
      };
    }
  } catch (error) {
    console.error('Error searching songs:', error);
    return { documents: [], total: 0, hasMore: false };
  }
};

// Get mood suggestions based on weather
export const getMoodSuggestionsByWeather = async (latitude: number, longitude: number): Promise<string[]> => {
  try {
    // Fetch weather data from OpenWeatherMap API
    const apiKey = process.env.OPENWEATHER_API_KEY || 'your-weather-api-key';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await response.json();
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const temperature = weatherData.main.temp;
    
    // Map weather conditions to moods
    let suggestedMoods: string[] = [];
    
    // Based on weather condition
    switch (weatherCondition) {
      case 'clear':
        suggestedMoods = ['happy', 'energetic', 'confident'];
        break;
      case 'clouds':
        suggestedMoods = ['contemplative', 'relaxed', 'nostalgic'];
        break;
      case 'rain':
      case 'drizzle':
        suggestedMoods = ['chill', 'relaxed', 'contemplative'];
        break;
      case 'thunderstorm':
        suggestedMoods = ['energetic', 'confident'];
        break;
      case 'snow':
        suggestedMoods = ['peaceful', 'nostalgic', 'dreamy'];
        break;
      case 'mist':
      case 'fog':
        suggestedMoods = ['dreamy', 'peaceful'];
        break;
      default:
        suggestedMoods = ['relaxed', 'chill'];
    }
    
    // Adjust based on temperature
    if (temperature > 25) {
      // Hot weather
      suggestedMoods = [...suggestedMoods, 'energetic', 'happy'];
    } else if (temperature < 5) {
      // Cold weather
      suggestedMoods = [...suggestedMoods, 'peaceful', 'contemplative'];
    }
    
    // Remove duplicates and return
    return [...new Set(suggestedMoods)];
  } catch (error) {
    console.error('Error getting weather-based mood suggestions:', error);
    return ['relaxed', 'chill']; // Default moods if weather data can't be fetched
  }
};

// Get activity suggestions based on time and weather
export const getActivitySuggestions = async (latitude: number, longitude: number): Promise<string[]> => {
  try {
    const currentHour = new Date().getHours();
    const weatherMoods = await getMoodSuggestionsByWeather(latitude, longitude);
    
    let suggestedActivities: string[] = [];
    
    // Based on time of day
    if (currentHour >= 5 && currentHour < 9) {
      // Early morning
      suggestedActivities = ['meditation', 'workout'];
    } else if (currentHour >= 9 && currentHour < 12) {
      // Morning
      suggestedActivities = ['study', 'reading'];
    } else if (currentHour >= 12 && currentHour < 17) {
      // Afternoon
      suggestedActivities = ['study', 'commuting', 'gaming'];
    } else if (currentHour >= 17 && currentHour < 21) {
      // Evening
      suggestedActivities = ['relaxing', 'party', 'driving'];
    } else {
      // Night
      suggestedActivities = ['sleeping', 'relaxing', 'reading'];
    }
    
    // Adjust based on mood suggestions from weather
    if (weatherMoods.includes('energetic')) {
      suggestedActivities = [...suggestedActivities, 'workout', 'party'];
    }
    
    if (weatherMoods.includes('relaxed') || weatherMoods.includes('peaceful')) {
      suggestedActivities = [...suggestedActivities, 'meditation', 'reading'];
    }
    
    // Remove duplicates and return
    return [...new Set(suggestedActivities)];
  } catch (error) {
    console.error('Error getting activity suggestions:', error);
    return ['study', 'relaxing']; // Default activities
  }
};

