import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProfilePage } from './pages/ProfilePage';
import { MoodJournalPage } from './pages/MoodJournalPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPassword } from './pages/ForgotPassword';
import SearchPage from './pages/SearchPage';
import SimpleSearchPage from './pages/SimpleSearchPage';
import { Navbar } from './components/Navbar';
import { NavigationMenu } from './components/NavigationMenu';
import { MusicPlayer } from './components/MusicPlayer';
import { useThemeStore } from './store/themeStore';
import { AuthProvider, useAuth } from './context/AuthContext';

// Main App component that requires authentication
const AppContent: React.FC = () => {
  const { isDark } = useThemeStore();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const { logout } = useAuth();

  // Handle mood selection and store in state
  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    // Save mood to Firebase if user is logged in
    if (auth.currentUser) {
      const userRef = doc(getFirestore(), 'users', auth.currentUser.uid);
      // Save current mood
      updateDoc(userRef, { 
        currentMood: mood,
        // Add to mood history with timestamp
        moodHistory: {
          mood: mood,
          timestamp: new Date().getTime()
        }
      })
        .catch(error => console.error('Error saving mood:', error));
    }
    console.log(`App received mood selection: ${mood}`);
  };

  // Effect to handle theme and auth state
  useEffect(() => {
    // Simulate loading state for smooth transitions
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="animate-pulse text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          VibeLoop
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <NavigationMenu onMoodSelect={handleMoodSelect} />
      
      <main className="transition-all duration-300 ease-in-out pt-16 md:pl-64 pb-16 md:pb-0">
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage currentMood={currentMood} />} />
            <Route path="/discover" element={<DiscoverPage currentMood={currentMood} />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/simple-search" element={<SimpleSearchPage />} />
            <Route path="/categories" element={<DiscoverPage currentMood={currentMood} />} />
            <Route path="/mood-journal" element={<MoodJournalPage />} />
            <Route path="/library" element={<ProfilePage />} />
            <Route path="/favorites" element={<ProfilePage />} />
            <Route path="/settings" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

// Main App component that handles authentication state
function App() {
  const { isDark } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);

  // Effect to handle theme and loading state
  useEffect(() => {
    // Simulate loading state for smooth transitions
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="animate-pulse text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          VibeLoop
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={<AppWithAuth />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Component that conditionally renders based on auth state
const AppWithAuth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <AppContent /> : <LoginPage />;
};

export default App;