import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import RequireAuth from './components/RequireAuth';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MusicPlayer } from './components/MusicPlayer';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProfilePage } from './pages/ProfilePage';
import { MoodPage } from './pages/MoodPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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