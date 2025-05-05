import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sendEmailVerification } from 'firebase/auth';

interface Mood {
  emoji: string;
  name: string;
  genres: string[];
  songs: {
    title: string;
    artist: string;
    genre: string;
  }[];
}

const moods: Mood[] = [
  {
    emoji: '😊',
    name: 'Happy',
    genres: ['Pop', 'Dance', 'Disco', 'Funk', 'Reggae', 'Ska', 'Jazz', 'Soul', 'R&B', 'Hip Hop'],
    songs: [
      { title: "Happy", artist: "Pharrell Williams", genre: "Pop" },
      { title: "Walking on Sunshine", artist: "Katrina and the Waves", genre: "Pop Rock" },
      { title: "Good Vibrations", artist: "The Beach Boys", genre: "Pop" },
      { title: "Don't Stop Me Now", artist: "Queen", genre: "Rock" },
      { title: "I Gotta Feeling", artist: "The Black Eyed Peas", genre: "Pop" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Funk" },
      { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "Pop" },
      { title: "Shake It Off", artist: "Taylor Swift", genre: "Pop" }
    ]
  },
  {
    emoji: '😢',
    name: 'Sad',
    genres: ['Blues', 'Soul', 'R&B', 'Indie', 'Folk', 'Alternative', 'Classical', 'Ambient', 'Lo-fi', 'Jazz'],
    songs: [
      { title: "Someone Like You", artist: "Adele", genre: "Pop" },
      { title: "Hurt", artist: "Johnny Cash", genre: "Country" },
      { title: "All I Want", artist: "Kodaline", genre: "Indie" },
      { title: "Fix You", artist: "Coldplay", genre: "Alternative Rock" },
      { title: "Skinny Love", artist: "Bon Iver", genre: "Indie Folk" },
      { title: "Say Something", artist: "A Great Big World", genre: "Pop" },
      { title: "The Scientist", artist: "Coldplay", genre: "Alternative Rock" },
      { title: "Nothing Compares 2 U", artist: "Sinead O'Connor", genre: "Pop" }
    ]
  },
  {
    emoji: '😡',
    name: 'Angry',
    genres: ['Metal', 'Rock', 'Punk', 'Hardcore', 'Industrial', 'Nu Metal', 'Alternative Metal', 'Thrash Metal', 'Death Metal', 'Grunge'],
    songs: [
      { title: "Break Stuff", artist: "Limp Bizkit", genre: "Nu Metal" },
      { title: "Killing in the Name", artist: "Rage Against the Machine", genre: "Rap Metal" },
      { title: "Du Hast", artist: "Rammstein", genre: "Industrial Metal" },
      { title: "Bodies", artist: "Drowning Pool", genre: "Nu Metal" },
      { title: "Chop Suey!", artist: "System of a Down", genre: "Alternative Metal" },
      { title: "Down with the Sickness", artist: "Disturbed", genre: "Nu Metal" },
      { title: "The Beautiful People", artist: "Marilyn Manson", genre: "Industrial Metal" },
      { title: "Before I Forget", artist: "Slipknot", genre: "Nu Metal" }
    ]
  },
  {
    emoji: '😌',
    name: 'Relaxed',
    genres: ['Ambient', 'Chillout', 'Lo-fi', 'Classical', 'Jazz', 'Acoustic', 'Folk', 'New Age', 'Meditation', 'Nature Sounds'],
    songs: [
      { title: "Weightless", artist: "Marconi Union", genre: "Ambient" },
      { title: "Claire de Lune", artist: "Debussy", genre: "Classical" },
      { title: "The Sound of Silence", artist: "Simon & Garfunkel", genre: "Folk" },
      { title: "River Flows in You", artist: "Yiruma", genre: "Piano" },
      { title: "Breathe Me", artist: "Sia", genre: "Pop" },
      { title: "Comptine d'un autre été", artist: "Yann Tiersen", genre: "Piano" },
      { title: "Experience", artist: "Ludovico Einaudi", genre: "Classical" },
      { title: "Nuvole Bianche", artist: "Ludovico Einaudi", genre: "Classical" }
    ]
  },
  {
    emoji: '💪',
    name: 'Energetic',
    genres: ['Rock', 'Electronic', 'Hip Hop', 'Dance', 'Pop', 'Metal', 'Punk', 'House', 'Techno', 'Dubstep'],
    songs: [
      { title: "Eye of the Tiger", artist: "Survivor", genre: "Rock" },
      { title: "Titanium", artist: "David Guetta ft. Sia", genre: "Dance" },
      { title: "Lose Yourself", artist: "Eminem", genre: "Hip Hop" },
      { title: "Thunderstruck", artist: "AC/DC", genre: "Rock" },
      { title: "Till I Collapse", artist: "Eminem", genre: "Hip Hop" },
      { title: "Remember the Name", artist: "Fort Minor", genre: "Hip Hop" },
      { title: "The Final Countdown", artist: "Europe", genre: "Rock" },
      { title: "Stronger", artist: "Kanye West", genre: "Hip Hop" }
    ]
  },
  {
    emoji: '😍',
    name: 'Romantic',
    genres: ['R&B', 'Soul', 'Pop', 'Jazz', 'Ballad', 'Indie Pop', 'Acoustic', 'Piano', 'Neo-Soul', 'Soft Rock'],
    songs: [
      { title: "All of Me", artist: "John Legend", genre: "R&B" },
      { title: "Thinking Out Loud", artist: "Ed Sheeran", genre: "Pop" },
      { title: "Perfect", artist: "Ed Sheeran", genre: "Pop" },
      { title: "A Thousand Years", artist: "Christina Perri", genre: "Pop" },
      { title: "Can't Help Falling in Love", artist: "Elvis Presley", genre: "Pop" },
      { title: "Just the Way You Are", artist: "Bruno Mars", genre: "Pop" },
      { title: "Make You Feel My Love", artist: "Adele", genre: "Pop" },
      { title: "Your Song", artist: "Elton John", genre: "Pop" }
    ]
  },
  {
    emoji: '🎉',
    name: 'Party',
    genres: ['Dance', 'House', 'EDM', 'Techno', 'Disco', 'Funk', 'Pop', 'Hip Hop', 'Reggaeton', 'Dancehall'],
    songs: [
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Funk" },
      { title: "Get Lucky", artist: "Daft Punk", genre: "Disco" },
      { title: "Shape of You", artist: "Ed Sheeran", genre: "Pop" },
      { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
      { title: "Dance Monkey", artist: "Tones and I", genre: "Pop" },
      { title: "Don't Start Now", artist: "Dua Lipa", genre: "Pop" },
      { title: "Levitating", artist: "Dua Lipa", genre: "Pop" },
      { title: "Stay With Me", artist: "Calvin Harris", genre: "Dance" }
    ]
  },
  {
    emoji: '🎯',
    name: 'Focused',
    genres: ['Classical', 'Ambient', 'Instrumental', 'Lo-fi', 'Jazz', 'Post-rock', 'Electronic', 'Minimal', 'Experimental', 'Piano'],
    songs: [
      { title: "Experience", artist: "Ludovico Einaudi", genre: "Classical" },
      { title: "Weightless", artist: "Marconi Union", genre: "Ambient" },
      { title: "Claire de Lune", artist: "Debussy", genre: "Classical" },
      { title: "Time", artist: "Hans Zimmer", genre: "Soundtrack" },
      { title: "Nuvole Bianche", artist: "Ludovico Einaudi", genre: "Classical" },
      { title: "The Last Goodbye", artist: "Ólafur Arnalds", genre: "Ambient" },
      { title: "Spiegel im Spiegel", artist: "Arvo Pärt", genre: "Classical" },
      { title: "Comptine d'un autre été", artist: "Yann Tiersen", genre: "Piano" }
    ]
  },
  {
    emoji: '🌧️',
    name: 'Melancholic',
    genres: ['Indie', 'Alternative', 'Folk', 'Dream Pop', 'Slowcore', 'Post-rock', 'Ambient', 'Indie Rock', 'Shoegaze', 'Indie Folk'],
    songs: [
      { title: "Skinny Love", artist: "Bon Iver", genre: "Indie Folk" },
      { title: "Holocene", artist: "Bon Iver", genre: "Indie Folk" },
      { title: "Motion Picture Soundtrack", artist: "Radiohead", genre: "Alternative" },
      { title: "Fourth of July", artist: "Sufjan Stevens", genre: "Indie Folk" },
      { title: "The Night We Met", artist: "Lord Huron", genre: "Indie Folk" },
      { title: "Cherry Wine", artist: "Hozier", genre: "Indie Folk" },
      { title: "To Build a Home", artist: "The Cinematic Orchestra", genre: "Post-rock" },
      { title: "Roslyn", artist: "Bon Iver & St. Vincent", genre: "Indie Folk" }
    ]
  },
  {
    emoji: '🌞',
    name: 'Summer',
    genres: ['Reggae', 'Pop', 'Tropical', 'Dance', 'House', 'Reggaeton', 'Dancehall', 'Afrobeat', 'Calypso', 'Soca'],
    songs: [
      { title: "Island in the Sun", artist: "Weezer", genre: "Alternative Rock" },
      { title: "Summertime", artist: "DJ Jazzy Jeff & The Fresh Prince", genre: "Hip Hop" },
      { title: "Walking on Sunshine", artist: "Katrina and the Waves", genre: "Pop Rock" },
      { title: "Summer Vibes", artist: "Lofi Fruits Music", genre: "Lo-fi" },
      { title: "Summer", artist: "Calvin Harris", genre: "Dance" },
      { title: "Summertime Sadness", artist: "Lana Del Rey", genre: "Pop" },
      { title: "Summer Wind", artist: "Frank Sinatra", genre: "Jazz" },
      { title: "Summer of '69", artist: "Bryan Adams", genre: "Rock" }
    ]
  },
  {
    emoji: '🌙',
    name: 'Night',
    genres: ['Lo-fi', 'Ambient', 'Chillout', 'Downtempo', 'Trip Hop', 'Dream Pop', 'Indie', 'Post-rock', 'Experimental', 'New Age'],
    songs: [
      { title: "Midnight City", artist: "M83", genre: "Synth-pop" },
      { title: "Nightcall", artist: "Kavinsky", genre: "Synthwave" },
      { title: "The Night We Met", artist: "Lord Huron", genre: "Indie Folk" },
      { title: "Night Changes", artist: "One Direction", genre: "Pop" },
      { title: "Nightcall", artist: "London Grammar", genre: "Indie Pop" },
      { title: "Midnight", artist: "Coldplay", genre: "Alternative Rock" },
      { title: "Night Moves", artist: "Bob Seger", genre: "Rock" },
      { title: "Night Swimming", artist: "R.E.M.", genre: "Alternative Rock" }
    ]
  },
  {
    emoji: '🏃',
    name: 'Workout',
    genres: ['Electronic', 'Hip Hop', 'Rock', 'Drum and Bass', 'House', 'Techno', 'Trap', 'EDM', 'Hardstyle', 'Trance'],
    songs: [
      { title: "Eye of the Tiger", artist: "Survivor", genre: "Rock" },
      { title: "Stronger", artist: "Kanye West", genre: "Hip Hop" },
      { title: "Titanium", artist: "David Guetta ft. Sia", genre: "Dance" },
      { title: "Remember the Name", artist: "Fort Minor", genre: "Hip Hop" },
      { title: "Till I Collapse", artist: "Eminem", genre: "Hip Hop" },
      { title: "The Final Countdown", artist: "Europe", genre: "Rock" },
      { title: "Lose Yourself", artist: "Eminem", genre: "Hip Hop" },
      { title: "Thunderstruck", artist: "AC/DC", genre: "Rock" }
    ]
  }
];

export const EmojiMusicSuggestions: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<typeof moods[0]['songs']>([]);

  const handleEmojiClick = (mood: Mood) => {
    setSelectedMood(mood);
    // Get 3 random genres
    const randomGenres = [...mood.genres]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setSelectedGenres(randomGenres);
    // Get 3 random songs
    const randomSongs = [...mood.songs]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setSelectedSongs(randomSongs);
  };

  const getNewSuggestions = () => {
    if (selectedMood) {
      handleEmojiClick(selectedMood);
    }
  };

  return (
    <div className="p-6 bg-white/5 rounded-xl backdrop-blur-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">How are you feeling today?</h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {moods.map((mood) => (
          <motion.button
            key={mood.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEmojiClick(mood)}
            className={`text-4xl p-4 rounded-full transition-colors ${
              selectedMood?.name === mood.name
                ? 'bg-primary-500/20 ring-2 ring-primary-500'
                : 'hover:bg-white/10'
            }`}
          >
            {mood.emoji}
          </motion.button>
        ))}
      </div>

      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-white">
            {selectedMood.emoji} {selectedMood.name} Mood Suggestions
          </h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-white">Recommended Genres:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-white">Recommended Songs:</h4>
            <div className="space-y-3">
              {selectedSongs.map((song) => (
                <div
                  key={song.title}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="font-medium text-white">{song.title}</div>
                  <div className="text-sm text-gray-400">
                    {song.artist} • {song.genre}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={getNewSuggestions}
            className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Get New Suggestions
          </button>
        </motion.div>
      )}
    </div>
  );
}; 