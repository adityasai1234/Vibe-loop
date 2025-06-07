import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import RequireAuth from './components/RequireAuth';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProfilePage } from './pages/ProfilePage';
import { MoodPage } from './pages/MoodPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useThemeStore } from './store/themeStore';
import { MusicPlayer } from './components/MusicPlayer';

function AppContent() {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <Sidebar />
      
      <main className="pt-16 pl-64"> {/* Adjust padding based on your navbar and sidebar heights */}
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/discover"
            element={
              <RequireAuth>
                <DiscoverPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/mood"
            element={
              <RequireAuth>
                <MoodPage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
      
      <MusicPlayer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicPlayerProvider>
          <AppContent />
        </MusicPlayerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;