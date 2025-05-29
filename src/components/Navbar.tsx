import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { User, Settings, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import LogoutButton from './LogoutButton';

export const Navbar: React.FC = () => {
  const { currentUser, userProfile, loading: authLoading } = useAuthContext();
  const { isDark, toggleTheme } = useThemeStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (authLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800/80 backdrop-blur-md text-white shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-purple-400">VibeLoop</Link>
          <div className="animate-pulse h-8 w-24 bg-gray-700 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 shadow-lg ${isDark ? 'bg-gray-900/80 text-gray-200' : 'bg-white/80 text-gray-800'} backdrop-blur-md`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>VibeLoop</Link>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {currentUser && userProfile ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
              >
                <img 
                  src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.displayName || userProfile.email}&background=random&size=32`}
                  alt={userProfile.displayName || 'User Avatar'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                />
                <span className="hidden md:inline text-sm font-medium">
                  {userProfile.displayName || userProfile.username}
                </span>
              </button>

              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5`}>
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm ${
                      isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="inline-block w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={`block px-4 py-2 text-sm ${
                      isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="inline-block w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <div className="px-4 py-2">
                    <LogoutButton variant="text" className="w-full justify-start" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-md ${
                isDark 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
