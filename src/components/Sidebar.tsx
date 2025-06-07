import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User, Music, Plus } from 'lucide-react';
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
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const playlistItems = [
    { id: '1', name: 'Liked Songs', icon: Heart },
    { id: '2', name: 'My Playlist #1', icon: Music },
    { id: '3', name: 'My Playlist #2', icon: Music },
  ];

  const sidebarContent = (
    <div className={`h-full flex flex-col ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive(path)
                ? isDark
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDark
                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Playlists */}
      <div className="px-2 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Playlists
          </h2>
          <button
            className={`p-1 rounded-full ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          {playlistItems.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full pt-16">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};