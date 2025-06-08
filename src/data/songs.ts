export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  url: string;
  genre: string;
  mood: string[];
  duration: number;
  releaseDate: string;
}

export const songs: Song[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'Chill Wave',
    album: 'Summer Collection',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Electronic',
    mood: ['Happy'],
    duration: 180,
    releaseDate: '2024-01-01'
  },
  {
    id: '2',
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    album: 'Night Tales',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Ambient',
    mood: ['Relaxed'],
    duration: 240,
    releaseDate: '2024-01-15'
  },
  {
    id: '3',
    title: 'Urban Rhythm',
    artist: 'Beat Collective',
    album: 'City Beats',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Hip Hop',
    mood: ['Energetic'],
    duration: 210,
    releaseDate: '2024-02-01'
  },
  {
    id: '4',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    album: 'Natural Harmony',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Ambient',
    mood: ['Calm'],
    duration: 300,
    releaseDate: '2024-02-15'
  },
  {
    id: '5',
    title: 'Electric Dreams',
    artist: 'Synth Master',
    album: 'Digital Age',
    coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Synthwave',
    mood: ['Energetic'],
    duration: 195,
    releaseDate: '2024-03-01'
  },
  {
    id: '6',
    title: 'Mountain Echo',
    artist: 'Acoustic Soul',
    album: 'Natural Elements',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Folk',
    mood: ['Peaceful'],
    duration: 225,
    releaseDate: '2024-03-15'
  },
  {
    id: '7',
    title: 'City Lights',
    artist: 'Urban Beats',
    album: 'Metropolitan',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Electronic',
    mood: ['Energetic'],
    duration: 210,
    releaseDate: '2024-04-01'
  },
  {
    id: '8',
    title: 'Rainy Day',
    artist: 'Cloud Nine',
    album: 'Weather Patterns',
    coverUrl: 'https://images.unsplash.com/photo-1501691223387-dd0506c89d7a?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Lo-fi',
    mood: ['Relaxed'],
    duration: 180,
    releaseDate: '2024-04-15'
  }
];