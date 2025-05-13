import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Music, TrendingUp, Coffee, Dumbbell, Brain, Moon as MoonIcon,
  Home, Search, Library, Heart, Settings, Disc3, Compass, Smile, Play, Pause
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAudio } from '../context/AudioContext';
import { MoodPanel } from './MoodPanel';

// Define mood emojis with their corresponding mood names
const moodEmojis = [
  { emoji: '😊', mood: 'Happy', description: 'Upbeat & cheerful' },
  { emoji: '😢', mood: 'Sad', description: 'Melancholic & reflective' },
  { emoji: '😡', mood: 'Angry', description: 'Intense & powerful' },
  { emoji: '😴', mood: 'Sleepy', description: 'Calm & relaxing' },
  { emoji: '🥳', mood: 'Party', description: 'Energetic & fun' },
  { emoji: '😌', mood: 'Chill', description: 'Laid back & easy' },
];

// Define music categories with their icons
const categories = [
  { name: 'Trending', icon: <TrendingUp size={18} />, emoji: '🔥' },
  { name: 'Chill', icon: <Coffee size={18} />, emoji: '🧊' },
  { name: 'Workout', icon: <Dumbbell size={18} />, emoji: '💪' },
  { name: 'Focus', icon: <Brain size={18} />, emoji: '🧠' },
  { name: 'Sleep', icon: <MoonIcon size={18} />, emoji: '😴' },
];

// Define main navigation items - we'll add the Moods action later
const navigationItems = [
  { name: 'Home', icon: <Home size={20} />, path: '/', emoji: '🏠' },
  { name: 'Explore', icon: <Compass size={20} />, path: '/discover', emoji: '🔍' },
  { name: 'Search', icon: <Search size={20} />, path: '/search', emoji: '🔎' },
  { name: 'Simple Search', icon: <Search size={20} />, path: '/simple-search', emoji: '🔍' },
  { name: 'Categories', icon: <Music size={20} />, path: '/categories', emoji: '🎵' },
  // Featured song - will be handled specially for play/pause functionality
  { 
    name: 'Bohemian Rhapsody', 
    icon: <Music size={20} />, 
    path: '/bohemian-rhapsody', 
    emoji: '🎸',
    special: 'bohemian'
  },
  // Moods navigation item placeholder (will be updated in the component)
  { 
    name: 'Moods', 
    icon: <Smile size={20} />, 
    path: '#', 
    emoji: '🎭', 
    action: null
  },
  { name: 'Mood Journal', icon: <Disc3 size={20} />, path: '/mood-journal', emoji: '📝' },
  { name: 'Library', icon: <Library size={20} />, path: '/library', emoji: '📚' },
  { name: 'Favorites', icon: <Heart size={20} />, path: '/favorites', emoji: '❤️' },
  { name: 'Settings', icon: <Settings size={20} />, path: '/settings', emoji: '⚙️' },
];

interface NavigationMenuProps {
  onMoodSelect?: (mood: string) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ onMoodSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('main'); // 'main', 'moods', 'categories'
  const [isMoodPanelOpen, setIsMoodPanelOpen] = useState(false);
  const { isDark } = useThemeStore();
  const { isPlaying, currentSong, play, pause } = useAudio();
  const location = useLocation();
  
  // Bohemian Rhapsody song URL - using GitHub Pages hosted version to avoid 500 error
  const bohemianRhapsodyUrl = "https://adityasai1234.github.io/static-site-for-vibeloop/youtube_fJ9rUzIMcZQ_audio.mp3";

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  // Reset to main navigation when menu is closed (mobile only)
  useEffect(() => {
    if (!isOpen) {
      setActiveSection('main');
    }
  }, [isOpen]);

  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
    // Here you would typically save to Firebase
    console.log(`Selected mood: ${mood}`);
    setIsMoodPanelOpen(false);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Here you would typically filter content based on category
    console.log(`Selected category: ${category}`);
  };
  
  // Handle section change (for mobile navigation)
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };
  
  // Handle Bohemian Rhapsody play/pause
  const handleBohemianPlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if this song is currently playing
    const isBohemianPlaying = isPlaying && currentSong === bohemianRhapsodyUrl;
    
    if (isBohemianPlaying) {
      pause();
    } else {
      play(bohemianRhapsodyUrl, "Bohemian Rhapsody", "Queen");
    }
  };

  return (
    <div className="relative z-40">
      {/* Mood Panel */}
      <MoodPanel 
        isOpen={isMoodPanelOpen} 
        onClose={() => setIsMoodPanelOpen(false)} 
        onMoodSelect={handleMoodSelect} 
      />
      {/* Mobile menu button - positioned in the header for better mobile UX */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 left-4 p-2 rounded-full z-50 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg transition-all duration-300`}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Navigation menu - responsive for both mobile and desktop */}
      <div
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          fixed top-0 left-0 h-screen w-3/4 sm:w-1/2 md:w-60 transition-transform duration-300 ease-in-out 
          ${isDark ? 'bg-black/95 text-white' : 'bg-white/95 text-gray-900'} 
          backdrop-blur-lg border-r z-30 md:flex md:flex-col pt-16
          ${isDark ? 'border-white/10' : 'border-gray-200'}`}
      >
        {/* Mobile navigation header with back button */}
        {activeSection !== 'main' && (
          <div className={`md:hidden flex items-center p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <button 
              onClick={() => setActiveSection('main')}
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <X size={18} />
              <span>Back to Menu</span>
            </button>
          </div>
        )}
        
        {/* Logo for sidebar */}
        <div className={`hidden md:flex items-center justify-center p-4 mb-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <Link to="/" className="flex items-center">
            <div className="text-primary-500 mr-2">
              <Disc3 size={24} strokeWidth={2} />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              VibeLoop
            </span>
          </Link>
        </div>

        {/* Main Navigation Section */}
        {(activeSection === 'main' || !isOpen) && (
          <div className="p-4 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  {item.name === 'Categories' ? (
                    <button
                      onClick={() => handleSectionChange('categories')}
                      className={`flex items-center justify-between w-full p-3 rounded-md transition-colors
                        ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-current">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs">{item.emoji}</span>
                    </button>
                  ) : item.name === 'Moods' ? (
                    <button
                      onClick={() => setIsMoodPanelOpen(true)}
                      className={`flex items-center justify-between w-full p-3 rounded-md transition-colors
                        ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-current">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs">{item.emoji}</span>
                    </button>
                  ) : item.special === 'bohemian' ? (
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.path}
                        className={`flex-grow flex items-center justify-between p-3 rounded-l-md transition-colors
                          ${location.pathname === item.path ? 
                            (isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-600') : 
                            (isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100')}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-current">{item.icon}</span>
                           <span>{item.name}</span>
                           {isPlaying && currentSong === bohemianRhapsodyUrl && (
                             <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                           )}
                        </div>
                        <span className="text-xs">{item.emoji}</span>
                      </Link>
                      <button
                        onClick={handleBohemianPlayPause}
                        className={`p-3 rounded-r-md transition-colors ${isDark ? 'bg-primary-500/30 hover:bg-primary-500/50 text-white' : 'bg-primary-100 hover:bg-primary-200 text-primary-700'}`}
                        aria-label={(isPlaying && currentSong === bohemianRhapsodyUrl) ? 'Pause' : 'Play'}
                       >
                         {(isPlaying && currentSong === bohemianRhapsodyUrl) ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between p-3 rounded-md transition-colors
                        ${location.pathname === item.path ? 
                          (isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-600') : 
                          (isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100')}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-current">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs">{item.emoji}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Categories Section */}
        {activeSection === 'categories' && isOpen && (
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className={`font-semibold mb-3 ${isDark ? 'text-white/80' : 'text-gray-900/80'}`}>
              CATEGORIES
            </h2>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.name}>
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    className={`flex items-center justify-between p-3 rounded-md w-full transition-colors 
                      ${selectedCategory === category.name ? 
                        (isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-600') : 
                        (isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100')}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-current">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-lg">{category.emoji}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mood Selector Section */}
        {activeSection === 'moods' && isOpen && (
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className={`font-semibold mb-3 ${isDark ? 'text-white/80' : 'text-gray-900/80'}`}>
              HOW ARE YOU FEELING?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moodEmojis.map((item) => (
                <button
                  key={item.mood}
                  onClick={() => handleMoodSelect(item.mood)}
                  className={`flex flex-col items-center p-3 rounded-md transition-all transform hover:scale-105 
                    ${selectedMood === item.mood ? 
                      (isDark ? 'bg-primary-500/20 ring-2 ring-primary-400' : 'bg-primary-100 ring-2 ring-primary-500') : 
                      (isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100')}`}
                  title={item.description}
                >
                  <span className="text-3xl mb-2">{item.emoji}</span>
                  <span className="text-sm">{item.mood}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom navigation bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-opacity-95 backdrop-blur-md border-t z-40
        ${isDark ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <div className="flex justify-around items-center p-2">
          {navigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-md transition-colors
                ${location.pathname === item.path ? 
                  (isDark ? 'text-primary-400' : 'text-primary-600') : 
                  (isDark ? 'text-white/70' : 'text-gray-600')}`}
            >
              <span className="text-current">{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay for mobile - closes menu when clicking outside */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};