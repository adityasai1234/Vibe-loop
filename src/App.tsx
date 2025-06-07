import React, { useState } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { MoodPage } from './pages/MoodPage';
import { ProfilePage } from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RequireAuth from './components/RequireAuth';
import { LikedSongsPage } from './pages/LikedSongsPage';
import { FavoritesPage } from './pages/FavoritesPage';

const AppContent = () => {
  const { isDark } = useThemeStore();
  const { isTablet, isDesktop } = useWindowSize();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isDesktop ? 'ml-64' : ''
        }`}>
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
              <Route path="/discover" element={<RequireAuth><DiscoverPage /></RequireAuth>} />
              <Route path="/mood" element={<RequireAuth><MoodPage /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="/liked" element={<RequireAuth><LikedSongsPage /></RequireAuth>} />
              <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
            </Routes>
          </div>
        </main>
      </div>

      {!isDesktop && (
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
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicPlayerProvider>
          <LikedSongsProvider>
            <SearchProvider>
              <AppContent />
            </SearchProvider>
          </LikedSongsProvider>
        </MusicPlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

import { PlaylistPage } from './pages/PlaylistPage';
import { useWindowSize } from './hooks/useWindowSize';
import { BottomNav } from './components/BottomNav';

export const App: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 640;
  const isTablet = width !== undefined && width >= 640 && width < 1024;
  const isDesktop = width !== undefined && width >= 1024;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar drawer

  return (
    <Router>
      <AuthProvider>
        <MusicPlayerProvider>
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} /> {/* Pass handler to Navbar */}
          
          <div className="flex min-h-screen">
            {/* Sidebar for Tablet and Desktop */}
            {(isTablet || isDesktop) && (
              <Sidebar 
                isOpen={isTablet && isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Main Content Area */}
            <main className={`flex-1 overflow-auto p-4 transition-all duration-300 
              ${isDesktop ? 'ml-64 pt-20 pb-24' : isTablet ? 'pt-20 pb-24' : 'pt-16 pb-20'}
              ${isMobile ? 'px-2' : 'px-4'}
            `}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
                <Route path="/discover" element={<RequireAuth><DiscoverPage /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                <Route path="/mood" element={<RequireAuth><MoodPage /></RequireAuth>} />
                <Route path="/playlist/:id" element={<RequireAuth><PlaylistPage /></RequireAuth>} />
                {/* Add other protected routes here */}
              </Routes>
            </main>

            {/* Music Player */}
            <MusicPlayer />

            {/* Bottom Navigation for Mobile */}
            {isMobile && <BottomNav />}
          </div>
        </MusicPlayerProvider>
      </AuthProvider>
    </Router>
  );
};

