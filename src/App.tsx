import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProfilePage } from './pages/ProfilePage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MusicPlayer } from './components/MusicPlayer';
import { useThemeStore } from './store/themeStore';

function App() {
  const { isDark } = useThemeStore();

  return (
    <Router>
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar />
        <Sidebar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        
        <MusicPlayer />
      </div>
    </Router>
  );
}

export default App