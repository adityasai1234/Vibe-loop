import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useWindowSize } from '../hooks/useWindowSize';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { MobileMenu } from './MobileMenu';
import { MusicPlayer } from './MusicPlayer';
import { RequireAuth } from './RequireAuth';

export const Layout: React.FC = () => {
  const { isDark } = useThemeStore();
  const { width } = useWindowSize();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <RequireAuth>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} isMobile={isMobile} />

        <div className="flex h-[calc(100vh-4rem)]">
          {(isTablet || isDesktop) && (
            <Sidebar isOpen={isTablet ? isSidebarOpen : isDesktop} onClose={() => setIsSidebarOpen(false)} />
          )}

          <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isDesktop ? 'ml-64' : ''
          }`}>
            <div className="container mx-auto px-4 py-8">
              <Outlet />
            </div>
          </main>
        </div>

        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <BottomNav />
          </div>
        )}
        <div className={`fixed bottom-0 left-0 right-0 z-40 ${
          isDesktop ? 'ml-64' : ''
        }`}>
          <MusicPlayer />
        </div>

        {isMobile && isMobileMenuOpen && (
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </div>
    </RequireAuth>
  );
}; 