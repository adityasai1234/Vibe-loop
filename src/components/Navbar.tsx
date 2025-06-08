import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Sun, Moon, User, LogOut } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { SearchBar } from '../components/SearchBar';
import { useWindowSize } from '../hooks/useWindowSize';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuth();
  const { isMobile, isTablet, isDesktop } = useWindowSize();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 ${
      isDark ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            {!isDesktop && (
              <button
                onClick={onMenuClick}
                className={`p-2 rounded-md ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Menu size={24} />
              </button>
            )}
            <Link to="/" className="ml-2 sm:ml-4">
              <Logo />
            </Link>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            {isMobile ? (
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-md ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Search size={20} />
              </button>
            ) : (
              <div className="w-full max-w-lg lg:max-w-xs">
                <SearchBar />
              </div>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative group">
                <button
                  className={`p-2 rounded-full ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <User size={20} />
                </button>
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } hidden group-hover:block`}>
                  <button
                    onClick={signOut}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search overlay */}
        {isMobile && showSearch && (
          <div className={`absolute inset-x-0 top-16 p-4 ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <SearchBar />
          </div>
        )}
      </div>
    </nav>
  );
};