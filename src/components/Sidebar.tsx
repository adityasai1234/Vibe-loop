import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User, Music, Plus, X, Upload } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useWindowSize } from '../hooks/useWindowSize';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isDark } = useThemeStore();
  const { isDesktop } = useWindowSize();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/liked', icon: Heart, label: 'Liked Songs' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/queue', icon: Music, label: 'Queue' },
  ];

  const playlistItems = [
    { id: '1', name: 'My Playlist #1', icon: Music },
    { id: '2', name: 'My Playlist #2', icon: Music },
  ];

  const sidebarContent = (
    <div className={`h-full flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-secondary-950 text-secondary-100' : 'bg-white text-secondary-800'
    }`}>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              isActive(path)
                ? isDark
                  ? 'bg-primary-700 text-white'
                  : 'bg-primary-500 text-white'
                : isDark
                ? 'hover:bg-secondary-800'
                : 'hover:bg-secondary-100'
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Playlists */}
      <div className={`px-4 py-4 border-t border-dashed ${
        isDark ? 'border-secondary-800' : 'border-secondary-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? 'text-secondary-400' : 'text-secondary-500'
          }`}>
            Playlists
          </h2>
          <button
            className={`p-1 rounded-full transition-colors duration-200 ${
              isDark
                ? 'hover:bg-secondary-800'
                : 'hover:bg-secondary-100'
            }`}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          {playlistItems.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                isDark
                  ? 'hover:bg-secondary-800'
                  : 'hover:bg-secondary-100'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 fixed top-16 bottom-0 overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Backdrop for overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Overlay Sidebar */}
      <div
        className={`fixed inset-x-0 top-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="h-full pt-16 flex flex-col">
          <div className={`px-4 py-4 flex items-center justify-end ${
            isDark ? 'bg-secondary-950' : 'bg-white'
          }`}>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              }`}
            >
              <X size={24} />
            </button>
          </div>
          {sidebarContent}
        </div>
      </div>
    </>
  );
};
