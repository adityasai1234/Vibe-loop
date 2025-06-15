import { createBrowserRouter, RouterProvider, type FutureConfig } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { LikedSongsProvider } from './context/LikedSongsContext';
import { SearchProvider } from './context/SearchContext';
import { ThemeProvider } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { UploadPage } from './pages/UploadPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { ProfilePage } from './pages/ProfilePage';
import { MoodPage } from './pages/MoodPage';
import { LikedSongsPage } from './pages/LikedSongsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { PlaybackQueue } from './components/PlaybackQueue';
import { Layout } from './components/Layout';

// Create router with future flags configuration
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'discover', element: <DiscoverPage /> },
        { path: 'upload', element: <UploadPage /> },
        { path: 'playlist/:id', element: <PlaylistPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'mood', element: <MoodPage /> },
        { path: 'liked', element: <LikedSongsPage /> },
        { path: 'favorites', element: <FavoritesPage /> },
        { path: 'queue', element: <PlaybackQueue /> },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },
  ],
  {
    future: {
      // Opt into v7 features to silence warnings
      // These flags are experimental but stable enough for our use
      v7_relativeSplatPath: true,
    } as Partial<FutureConfig>,
  }
);

export function App() {
  return (
      <AuthProvider>
      <ThemeProvider>
        <SearchProvider>
          <LikedSongsProvider>
            <MusicPlayerProvider>
              <RouterProvider router={router} />
            </MusicPlayerProvider>
          </LikedSongsProvider>
        </SearchProvider>
      </ThemeProvider>
      </AuthProvider>
  );
}

