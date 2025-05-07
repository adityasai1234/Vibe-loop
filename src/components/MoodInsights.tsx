import React, { useState, useEffect } from 'react';
import { firestoreService, moodData } from '../services/firestoreService';
import { useThemeStore } from '../store/themeStore';

interface MoodInsightsProps {
  userId?: string;
}

interface MoodCount {
  mood: string;
  count: number;
  emoji: string;
}

interface SongMoodCorrelation {
  songId: string;
  title: string;
  artist: string;
  coverImageUrl: string;
  moods: string[];
  frequency: number;
}

export const MoodInsights: React.FC<MoodInsightsProps> = ({ userId }) => {
  const { isDark } = useThemeStore();
  const [moodCounts, setMoodCounts] = useState<MoodCount[]>([]);
  const [topSongs, setTopSongs] = useState<SongMoodCorrelation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;
    
    const fetchMoodData = async () => {
      setIsLoading(true);
      try {
        // Get journal entries
        const entries = await firestoreService.getUserJournalEntries(userId);
        
        // Filter entries based on time range
        const filteredEntries = filterEntriesByTimeRange(entries, timeRange);
        
        // Count moods
        const moodCountMap: Record<string, number> = {};
        filteredEntries.forEach(entry => {
          moodCountMap[entry.mood] = (moodCountMap[entry.mood] || 0) + 1;
        });
        
        // Format mood counts with emojis
        const formattedMoodCounts: MoodCount[] = Object.keys(moodCountMap).map(mood => {
          const moodInfo = moodData.find(m => m.mood === mood);
          return {
            mood,
            count: moodCountMap[mood],
            emoji: moodInfo?.emoji || '😐'
          };
        }).sort((a, b) => b.count - a.count);
        
        setMoodCounts(formattedMoodCounts);
        
        // Analyze songs and moods correlation
        const songMoodMap: Record<string, {
          title: string;
          artist: string;
          coverImageUrl: string;
          moods: Set<string>;
          count: number;
        }> = {};
        
        filteredEntries.forEach(entry => {
          if (entry.songs && entry.songs.length > 0) {
            entry.songs.forEach(song => {
              if (!songMoodMap[song.id]) {
                songMoodMap[song.id] = {
                  title: song.title,
                  artist: song.artist,
                  coverImageUrl: song.coverImageUrl,
                  moods: new Set([entry.mood]),
                  count: 1
                };
              } else {
                songMoodMap[song.id].moods.add(entry.mood);
                songMoodMap[song.id].count += 1;
              }
            });
          }
        });
        
        // Format song correlations
        const songCorrelations: SongMoodCorrelation[] = Object.keys(songMoodMap).map(songId => ({
          songId,
          title: songMoodMap[songId].title,
          artist: songMoodMap[songId].artist,
          coverImageUrl: songMoodMap[songId].coverImageUrl,
          moods: Array.from(songMoodMap[songId].moods),
          frequency: songMoodMap[songId].count
        })).sort((a, b) => b.frequency - a.frequency);
        
        setTopSongs(songCorrelations.slice(0, 5));
        
        // Generate insights
        generateInsights(formattedMoodCounts, songCorrelations, timeRange);
      } catch (error) {
        console.error('Error fetching mood insights:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMoodData();
  }, [userId, timeRange]);
  
  const filterEntriesByTimeRange = (entries: any[], range: 'week' | 'month' | 'all') => {
    if (range === 'all') return entries;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (range === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return entries.filter(entry => new Date(entry.timestamp) >= cutoffDate);
  };
  
  const generateInsights = (
    moodCounts: MoodCount[], 
    songCorrelations: SongMoodCorrelation[],
    range: 'week' | 'month' | 'all'
  ) => {
    const newInsights: string[] = [];
    
    // Most common mood
    if (moodCounts.length > 0) {
      const topMood = moodCounts[0];
      newInsights.push(
        `Your most frequent mood ${range === 'week' ? 'this week' : range === 'month' ? 'this month' : 'overall'} is ${topMood.emoji} ${topMood.mood} (${topMood.count} times).`
      );
    }
    
    // Mood variety
    if (moodCounts.length > 1) {
      newInsights.push(
        `You've experienced ${moodCounts.length} different moods ${range === 'week' ? 'this week' : range === 'month' ? 'this month' : 'overall'}.`
      );
    }
    
    // Top song and its moods
    if (songCorrelations.length > 0) {
      const topSong = songCorrelations[0];
      newInsights.push(
        `"${topSong.title}" by ${topSong.artist} appears most frequently in your journal (${topSong.frequency} times).`
      );
      
      if (topSong.moods.length > 1) {
        const moodsList = topSong.moods.map(mood => {
          const moodInfo = moodData.find(m => m.mood === mood);
          return moodInfo ? `${moodInfo.emoji} ${mood}` : mood;
        }).join(', ');
        
        newInsights.push(
          `This song is associated with multiple moods: ${moodsList}.`
        );
      }
    }
    
    // Mood patterns
    if (moodCounts.length > 2) {
      const happyMoods = ['Happy', 'Excited', 'Party'];
      const calmMoods = ['Calm', 'Sleepy', 'Chill'];
      const sadMoods = ['Sad', 'Angry'];
      
      const happyCount = moodCounts
        .filter(m => happyMoods.includes(m.mood))
        .reduce((sum, m) => sum + m.count, 0);
      
      const calmCount = moodCounts
        .filter(m => calmMoods.includes(m.mood))
        .reduce((sum, m) => sum + m.count, 0);
      
      const sadCount = moodCounts
        .filter(m => sadMoods.includes(m.mood))
        .reduce((sum, m) => sum + m.count, 0);
      
      const total = happyCount + calmCount + sadCount;
      
      if (total > 0) {
        if (happyCount > calmCount && happyCount > sadCount) {
          newInsights.push(
            `You tend to feel more upbeat and positive moods (${Math.round(happyCount / total * 100)}% of the time).`
          );
        } else if (calmCount > happyCount && calmCount > sadCount) {
          newInsights.push(
            `You tend to feel more calm and relaxed moods (${Math.round(calmCount / total * 100)}% of the time).`
          );
        } else if (sadCount > happyCount && sadCount > calmCount) {
          newInsights.push(
            `You tend to feel more melancholic moods (${Math.round(sadCount / total * 100)}% of the time).`
          );
        }
      }
    }
    
    setInsights(newInsights);
  };

  const getMaxCount = () => {
    return moodCounts.length > 0 ? moodCounts[0].count : 0;
  };

  return (
    <div className={`w-full rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Mood Insights
      </h2>
      
      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-full text-sm ${timeRange === 'week'
              ? 'bg-primary-500 text-white'
              : isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-full text-sm ${timeRange === 'month'
              ? 'bg-primary-500 text-white'
              : isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded-full text-sm ${timeRange === 'all'
              ? 'bg-primary-500 text-white'
              : isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary-500/50 mb-2"></div>
            <div className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Analyzing your moods...</div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Insights */}
          {insights.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Mood Patterns
              </h3>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Mood Distribution */}
          {moodCounts.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Mood Distribution
              </h3>
              <div className="space-y-3">
                {moodCounts.map((moodCount) => {
                  const percentage = getMaxCount() > 0 ? (moodCount.count / getMaxCount()) * 100 : 0;
                  return (
                    <div key={moodCount.mood} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{moodCount.emoji}</span>
                          <span className={isDark ? 'text-white' : 'text-gray-900'}>{moodCount.mood}</span>
                        </div>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {moodCount.count} {moodCount.count === 1 ? 'time' : 'times'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-primary-500 h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Top Songs */}
          {topSongs.length > 0 && (
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Emotional Soundtrack
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topSongs.map((song) => (
                  <div 
                    key={song.songId}
                    className={`flex items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <img 
                      src={song.coverImageUrl} 
                      alt={song.title} 
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {song.title}
                      </p>
                      <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {song.artist}
                      </p>
                      <div className="flex flex-wrap mt-1 gap-1">
                        {song.moods.map((mood, i) => {
                          const moodInfo = moodData.find(m => m.mood === mood);
                          return (
                            <span 
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                            >
                              {moodInfo?.emoji} {mood}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {moodCounts.length === 0 && topSongs.length === 0 && (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              No mood data available yet. Start tracking your moods in the journal to see insights!
            </div>
          )}
        </div>
      )}
    </div>
  );
};