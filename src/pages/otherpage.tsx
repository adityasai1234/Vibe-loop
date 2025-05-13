import React from 'react';
import { SongDetail } from '../components/SongDetail';
import { SongPlayer } from '../components/SongPlayer';
import { AudioPlayer } from '../components/AudioPlayer';
import { useThemeStore } from '../store/themeStore';

export const BohemianRhapsodyPage: React.FC = () => {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen pt-20 pb-32 px-4 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          Featured Song
        </h1>
        
        <SongDetail showYoutubeLink={true} />
        
        {/* GitHub Pages hosted MP3 player */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Listen Now
          </h2>
          <SongPlayer 
            songTitle="Bohemian Rhapsody"
            artist="Queen"
            audioSrc="/music/youtube_fJ9rUzIMcZQ_audio.mp3"
            coverArt="https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png"
          />
        </div>
        
        {/* Simple Play/Pause Controls */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Quick Controls
          </h2>
          <AudioPlayer 
            audioSrc="/music/youtube_fJ9rUzIMcZQ_audio.mp3"
            songTitle="Bohemian Rhapsody"
            artist="Queen"
          />
        </div>
        
        <div className={`mt-8 p-6 rounded-xl ${isDark ? 'bg-gray-900/70 text-white/80' : 'bg-white/90 text-gray-700'} border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold mb-4">About This Song</h2>
          <p className="mb-4">
            "Bohemian Rhapsody" is a song by the British rock band Queen from their fourth album, A Night at the Opera (1975). 
            Written by lead singer Freddie Mercury, it is a six-minute suite, notable for its lack of a repeating chorus and consisting of several sections: 
            an intro, a ballad segment, an operatic passage, a hard rock part and a reflective coda.
          </p>
          <p>
            The song is a staple of Queen's live performances, and has appeared in numerous films and television shows. 
            It topped the UK Singles Chart for nine weeks and reached number nine on the US Billboard Hot 100. 
            A promotional video for the song is credited with popularizing the music video format.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BohemianRhapsodyPage;
