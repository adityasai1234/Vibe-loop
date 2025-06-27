import React, { useState } from 'react';
import { usePlaylistStore } from '../store/playlistStore';
import { useThemeStore } from '../store/themeStore';
import { X, Copy, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { Playlist } from '../types';

interface SharePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist;
}

export const SharePlaylistModal: React.FC<SharePlaylistModalProps> = ({ isOpen, onClose, playlist }) => {
  const { generateShareLink } = usePlaylistStore();
  const { isDark } = useThemeStore();
  
  const [copied, setCopied] = useState(false);
  const shareLink = generateShareLink(playlist.id);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async (platform: 'facebook' | 'twitter') => {
    const text = `Check out my playlist "${playlist.title}" on Vibe Loop!`;
    const url = encodeURIComponent(shareLink);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Share Playlist</h2>

        <div className="space-y-6">
          {/* Share Link */}
          <div>
            <label className="block text-sm font-medium mb-2">Share Link</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className={`flex-1 px-3 py-2 rounded-md border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-50 border-gray-300'
                }`}
              />
              <button
                onClick={handleCopyLink}
                className={`p-2 rounded-md ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } ${copied ? 'text-green-500' : ''}`}
                title={copied ? 'Copied!' : 'Copy link'}
              >
                {copied ? <LinkIcon size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">Share on Social Media</label>
            <div className="flex space-x-3">
              <button
                onClick={() => handleShare('facebook')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md ${
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white dark:text-black`}
              >
                <Facebook size={20} />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md ${
                  isDark
                    ? 'bg-blue-400 hover:bg-blue-500'
                    : 'bg-blue-400 hover:bg-blue-500'
                } text-white dark:text-black`}
              >
                <Twitter size={20} />
                <span>Twitter</span>
              </button>
            </div>
          </div>

          {/* Native Share (if available) */}
          {navigator.share && (
            <button
              onClick={() => {
                navigator.share({
                  title: playlist.title,
                  text: `Check out my playlist "${playlist.title}" on Vibe Loop!`,
                  url: shareLink,
                }).catch(console.error);
              }}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Share2 size={20} />
              <span>Share via...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
