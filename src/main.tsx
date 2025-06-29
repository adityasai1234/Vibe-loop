import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { ProfilePage } from './pages/ProfilePage';
import { MoodPage } from './pages/MoodPage';
import { LikedSongsPage } from './pages/LikedSongsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AuthProvider } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { LikedSongsProvider } from './context/LikedSongsContext';
import { SearchProvider } from './context/SearchContext';
// import other pages as needed
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SearchProvider>
        <LikedSongsProvider>
          <MusicPlayerProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="upload" element={<UploadPage />} />
                    <Route path="playlist/:id" element={<PlaylistPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="mood" element={<MoodPage />} />
                    <Route path="liked" element={<LikedSongsPage />} />
                    <Route path="favorites" element={<FavoritesPage />} />
                    {/* Add more routes here as needed */}
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </MusicPlayerProvider>
        </LikedSongsProvider>
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
);
