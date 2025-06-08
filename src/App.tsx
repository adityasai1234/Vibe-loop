import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { LikedSongsProvider } from './context/LikedSongsContext';
import { SearchProvider } from './context/SearchContext';
import { useThemeStore } from './store/themeStore';
import { useWindowSize } from './hooks/useWindowSize';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { MusicPlayer } from './components/MusicPlayer';
import { MobileMenu } from './components/MobileMenu';

import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { MoodPage } from './pages/MoodPage';
import { ProfilePage } from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RequireAuth from './components/RequireAuth';
import { LikedSongsPage } from './pages/LikedSongsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { PlaybackQueue } from './components/PlaybackQueue';

export default function App() {
  const { isDark } = useThemeStore();
  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 640;
  const isTablet = width !== undefined && width >= 640 && width < 1024;
  const isDesktop = width !== undefined && width >= 1024;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMobileMenuOpen]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicPlayerProvider>
          <LikedSongsProvider>
            <SearchProvider>
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
                      <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
                        <Route path="/discover" element={<RequireAuth><DiscoverPage /></RequireAuth>} />
                        <Route path="/mood" element={<RequireAuth><MoodPage /></RequireAuth>} />
                        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                        <Route path="/liked" element={<RequireAuth><LikedSongsPage /></RequireAuth>} />
                        <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
                        <Route path="/playlist/:id" element={<RequireAuth><PlaylistPage /></RequireAuth>} />
                        <Route path="/queue" element={<RequireAuth><PlaybackQueue /></RequireAuth>} />
                      </Routes>
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
              </div>

              {isMobile && isMobileMenuOpen && (
                <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
              )}
            </SearchProvider>
          </LikedSongsProvider>
        </MusicPlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

