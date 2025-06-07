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

  // Wavy SVG patterns as data URIs
  const darkWaveBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,40 C150,80 350,0 500,40 C650,80 850,0 1000,40 L1000,0 L0,0 Z' fill='%231f2937'/%3E%3Cpath d='M1000,40 C1150,80 1350,0 1500,40 L1500,0 L1000,0 Z' fill='%231f2937'/%3E%3C/svg%3E")`;
  const lightWaveBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,40 C150,80 350,0 500,40 C650,80 850,0 1000,40 L1000,0 L0,0 Z' fill='%23e5e7eb'/%3E%3Cpath d='M1000,40 C1150,80 1350,0 1500,40 L1500,0 L1000,0 Z' fill='%23e5e7eb'/%3E%3C/svg%3E")`;

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: isDark ? '#111827' : '#f9fafb',
        backgroundImage: isDark ? darkWaveBg : lightWaveBg,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '1200px 120px',
        backgroundPosition: 'bottom',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isDesktop ? 'ml-64' : ''
        } ${isDark ? 'bg-gray-900 bg-opacity-80' : 'bg-white bg-opacity-80'} backdrop-blur-sm`}>
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

