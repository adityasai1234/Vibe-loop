import React, { useState, useEffect } from 'react';
import { AudioProvider } from './context/AudioContext';
import { GamificationProvider } from './context/GamificationContext';
import { ToastProvider } from './components/ui/ToastQueue';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useDominantColor } from './hooks/useDominantColor';
import ThemeGradient from './components/ThemeGradient';

// Firebase imports
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Page imports
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
// import { ProfilePage } from './pages/ProfilePage'; // Will be default import
import ProfilePageImport from './pages/ProfilePage'; // Renamed to avoid conflict
import { MoodJournalPage } from './pages/MoodJournalPage';
// import { LoginPage } from './pages/LoginPage'; // Will be default import
import LoginPageImport from './pages/LoginPage'; // Renamed to avoid conflict
import { RegisterPage } from './pages/RegisterPage'; // Assuming this might still be used or removed later
import { ForgotPassword } from './pages/ForgotPassword';
import SearchPage from './pages/SearchPage';
import SimpleSearchPage from './pages/SimpleSearchPage';
import { BohemianRhapsodyPage } from './pages/otherpage';
import { PlayButtonDemoPage } from './pages/PlayButtonDemoPage';
import { AlbumCoverDemo } from './pages/AlbumCoverDemo';
import { AlbumClickPlayDemo } from './pages/AlbumClickPlayDemo';
import Community from './pages/Community';
import { SettingsPage } from './pages/SettingsPage'; // Added for settings route
import ChooseUsernamePageImport from './pages/ChooseUsername'; // Added for choose username route

// Component imports
import { Navbar } from './components/Navbar';
import { NavigationMenu } from './components/NavigationMenu';
import { MusicPlayer } from './components/MusicPlayer';
import RequireAuthImport from './components/RequireAuth'; // Added for protected routes

// Store and Context imports
import { useThemeStore } from './store/themeStore';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast'; // Added for notifications

// Main App component that requires authentication
const AppContent: React.FC = () => {
  const { isDark } = useThemeStore();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const { signOutUser: logout, currentUser } = useAuthContext();
  
  useDominantColor();

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    if (auth.currentUser) {
      const userRef = doc(getFirestore(), 'users', auth.currentUser.uid);
      updateDoc(userRef, { 
        currentMood: mood,
        moodHistory: {
          mood: mood,
          timestamp: new Date().getTime()
        }
      })
        .catch(error => console.error('Error saving mood:', error));
    }
    console.log(`App received mood selection: ${mood}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // This loading state is for the initial app load, AuthContext handles its own loading for auth status
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
    <>
      <ThemeGradient />
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Navbar and NavigationMenu might only render if currentUser exists and has a username */}
        {currentUser && (
          <>
            <Navbar />
            <NavigationMenu onMoodSelect={handleMoodSelect} />
          </>
        )}
      
      <main className={`transition-all duration-300 ease-in-out 
                      ${currentUser ? 'pt-16 md:pl-64 pb-16 md:pb-0' : ''}`}>
        <div className={`${currentUser ? 'container mx-auto p-4' : ''}`}>
          <Routes>
            {/* Public routes or routes handled by AuthContext redirection */}
            <Route path="/login" element={<LoginPageImport />} />
            <Route path="/choose-username" element={<ChooseUsernamePageImport />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
            {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

            {/* Protected Routes - wrapped in RequireAuth or handled by AuthContext logic */}
            <Route path="/" element={<RequireAuthImport><HomePage currentMood={currentMood} /></RequireAuthImport>} />
            <Route path="/discover" element={<RequireAuthImport><DiscoverPage currentMood={currentMood} /></RequireAuthImport>} />
            <Route path="/search" element={<RequireAuthImport><SearchPage /></RequireAuthImport>} />
            <Route path="/simple-search" element={<RequireAuthImport><SimpleSearchPage /></RequireAuthImport>} />
            <Route path="/categories" element={<RequireAuthImport><DiscoverPage currentMood={currentMood} /></RequireAuthImport>} />
            <Route path="/mood-journal" element={<RequireAuthImport><MoodJournalPage /></RequireAuthImport>} />
            <Route path="/community" element={<RequireAuthImport><Community /></RequireAuthImport>} />
            <Route path="/library" element={<RequireAuthImport><ProfilePageImport /></RequireAuthImport>} /> {/* Assuming library is part of profile or similar protected area */}
            <Route path="/favorites" element={<RequireAuthImport><ProfilePageImport /></RequireAuthImport>} /> {/* Same as above */}
            
            <Route 
              path="/settings" 
              element={
                <RequireAuthImport>
                  <SettingsPage />
                </RequireAuthImport>
              }
            />
            <Route 
              path="/profile" 
              element={
                <RequireAuthImport>
                  <ProfilePageImport />
                </RequireAuthImport>
              }
            />
            
            {/* Demo/Other Pages (assess if they need auth) */}
            <Route path="/bohemian-rhapsody" element={<BohemianRhapsodyPage />} />
            <Route path="/play-button-demo" element={<PlayButtonDemoPage />} />
            <Route path="/album-cover-demo" element={<AlbumCoverDemo />} />
            <Route path="/album-click-play" element={<AlbumClickPlayDemo />} />
            
            {/* Consider a NotFoundPage for unmatched routes */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </div>
      </main>
      
      {currentUser && <MusicPlayer />} {/* Only show player if logged in */}
      </div>
    </>
  );
};

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AudioProvider>
        <ToastProvider>
          <GamificationProvider>
            {children}
            <Toaster 
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e', // green-500
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444', // red-500
                    secondary: '#fff',
                  },
                },
              }}
            />
          </GamificationProvider>
        </ToastProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

function App() {
  const { isDark } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
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
    <AppProviders>
      <Router>
        <AppContent />
      </Router>
    </AppProviders>
  );
}

// The AppWithAuth component might no longer be needed as AuthContext handles redirection
// and AppContent can conditionally render based on currentUser from useAuth.
// export default AppWithAuth; // Commenting out or removing if AuthContext handles all

export default App;
