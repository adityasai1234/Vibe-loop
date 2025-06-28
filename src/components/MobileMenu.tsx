import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User, Search, Sun, Moon, LogOut, X, Music, Upload, DoorOpen } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from './SearchBar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/liked', icon: Heart, label: 'Liked Songs' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/queue', icon: Music, label: 'Queue' },
  ];

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Trap focus within the modal when open
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (firstElement) firstElement.focus();

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) { // if shift + tab key pressed
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else { // if tab key pressed
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      menuRef.current.addEventListener('keydown', handleTabKey);
      return () => {
        if (menuRef.current) {
          menuRef.current.removeEventListener('keydown', handleTabKey);
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out lg:hidden
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose} // Close on backdrop click
        aria-hidden="true"
      ></div>

      {/* Mobile Menu Panel */}
      <div
        ref={menuRef}
        className={`absolute top-0 left-0 bottom-0 w-64 transform transition-transform duration-300 ease-in-out
          ${isDark ? 'bg-secondary-950 text-secondary-100' : 'bg-white text-secondary-800'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
            }`}
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar (Mobile specific) */}
        <div className="px-4 mb-4">
          <SearchBar />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose} // Close menu on navigation
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${location.pathname === path
                  ? (isDark ? 'bg-primary-700 text-white' : 'bg-primary-500 text-white')
                  : (isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100')
                }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'}
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} className="mr-3" /> : <Moon size={20} className="mr-3" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Login/Logout */}
          {user ? (
            <button
              onClick={() => {
                signOut();
                onClose(); // Close menu after sign out
              }}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'}
              }`}
            >
              <DoorOpen size={20} className="mr-3" />
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={onClose} // Close menu after navigation
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'}
              }`}
            >
              <User size={20} className="mr-3" />
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};