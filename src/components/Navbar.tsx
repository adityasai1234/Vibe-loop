import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, LogOut, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { useWindowSize } from '../hooks/useWindowSize';

interface NavbarProps {
  onMenuClick: () => void; // For mobile menu toggle
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 640;

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false); // Close menu after sign out
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    } shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              Discover
            </Link>
            <Link
              to="/mood"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              Mood
            </Link>
          </div>

          {/* Right Side Actions & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Search - Show only on tablet and desktop */}
            {!isMobile && <SearchBar />}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Profile - Desktop */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`p-2 rounded-full ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`hidden md:block px-4 py-2 rounded-md text-sm font-medium ${
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button - Show only on mobile */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-gray-800' : 'bg-gray-50'} pb-3 space-y-1`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              Home
            </Link>
            <Link
              to="/discover"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              Discover
            </Link>
            <Link
              to="/mood"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              Mood
            </Link>
            {user && (
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                Profile
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700 dark:border-gray-200">
            {user ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://via.placeholder.com/40" // Placeholder for user avatar
                    alt="User Avatar"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none">{user.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className={`ml-auto flex-shrink-0 p-2 rounded-full ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
