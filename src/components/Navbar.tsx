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
  isMobile: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, isMobile }) => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuth();
  const { width } = useWindowSize();
  const [showSearch, setShowSearch] = useState(false);

  const isDesktop = width !== undefined && width >= 1024;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 shadow-md transition-colors duration-300 ${
      isDark ? 'bg-secondary-950 text-secondary-100' : 'bg-white text-secondary-800'
    }`}>
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className={`p-2 rounded-md transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              }`}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
          )}
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Center section - Search (only visible on non-mobile devices) */}
        {!isMobile && (
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="w-full max-w-md lg:max-w-xs">
              <SearchBar />
            </div>
          </div>
        )}

        {/* Right section (Theme toggle and Auth buttons - hidden on mobile, handled by MobileMenu) */}
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="relative group">
                <button
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
                  }`}
                >
                  <User size={18} />
                </button>
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 transition-colors duration-200 ${
                  isDark ? 'bg-secondary-900' : 'bg-white'
                } hidden group-hover:block`}>
                  <button
                    onClick={signOut}
                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                      isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDark ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                Sign in
              </Link>
            )}
          </div>
        )}

        {/* Search icon for mobile (will open MobileMenu) */}
        {isMobile && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onMenuClick} // Opens the MobileMenu
              className={`p-2 rounded-md transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              }`}
              aria-label="Open search menu"
            >
              <Search size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};