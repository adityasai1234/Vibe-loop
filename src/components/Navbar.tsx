import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, LogOut } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuth();

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

          {/* Navigation Links */}
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Profile */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={signOut}
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
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};