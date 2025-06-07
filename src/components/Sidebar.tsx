import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Music, User, Heart, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useWindowSize } from '../hooks/useWindowSize';

interface SidebarProps {
  isOpen?: boolean; // Optional prop for controlling drawer state on tablet
  onClose?: () => void; // Optional prop to close the drawer
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isDark } = useThemeStore();
  const location = useLocation();
  const { width } = useWindowSize();

  // Determine current screen size
  const isMobile = width !== undefined && width < 640;
  const isTablet = width !== undefined && width >= 640 && width < 1024;
  const isDesktop = width !== undefined && width >= 1024;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/discover', icon: Music, label: 'Discover' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  // Base classes for permanent sidebar on desktop
  const desktopClasses = `fixed left-0 top-0 bottom-0 w-64 border-r 
    ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
    pt-16 pb-24 z-30 hidden lg:block`;

  // Classes for mobile/tablet drawer
  const mobileTabletDrawerClasses = `fixed top-0 left-0 h-full w-64 z-50 transform 
    ${isDark ? 'bg-gray-900' : 'bg-white'} transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden lg:hidden`;

  // Render nothing on mobile, unless it's the slide-in drawer
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay for Tablet/Mobile Drawer */}
      {(isTablet || isMobile) && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`${isDesktop ? desktopClasses : mobileTabletDrawerClasses} 
        ${isTablet ? 'block' : ''} ${isMobile && isOpen ? 'block' : ''}
      `}>
        {/* Close button for mobile/tablet drawer */}
        {(isTablet || isMobile) && isOpen && ( // Only show on tablet/mobile when drawer is open
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <X size={24} />
          </button>
        )}

        <nav className="p-4 pt-16 md:pt-4">
          <ul className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={onClose} // Close drawer on navigation
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(path)
                      ? isDark
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};