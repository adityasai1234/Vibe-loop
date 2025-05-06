import React from 'react';
import { EmojiMusicSuggestions } from '../components/EmojiMusicSuggestions';

export const MoodMusicPage: React.FC = () => {
  return (
    <div className="pt-16 md:pl-60 pb-20 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mood Music</h1>
            <p className="text-gray-400">Find the perfect music for your current mood</p>
          </div>
          
          <EmojiMusicSuggestions />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-4">How it works</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-primary-500">1.</span>
                  <span>Select an emoji that matches your current mood</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary-500">2.</span>
                  <span>Get personalized genre suggestions based on your mood</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary-500">3.</span>
                  <span>Create a playlist with songs that match your mood</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-4">Popular Moods</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <span className="text-2xl mb-2 block">😊</span>
                  <h3 className="font-medium">Happy</h3>
                  <p className="text-sm text-gray-400">Upbeat and positive vibes</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <span className="text-2xl mb-2 block">🌙</span>
                  <h3 className="font-medium">Chill</h3>
                  <p className="text-sm text-gray-400">Relaxed and mellow tunes</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <span className="text-2xl mb-2 block">💪</span>
                  <h3 className="font-medium">Energetic</h3>
                  <p className="text-sm text-gray-400">High-energy workout music</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <span className="text-2xl mb-2 block">📚</span>
                  <h3 className="font-medium">Focus</h3>
                  <p className="text-sm text-gray-400">Concentration and study</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};  
