import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Song } from '../types';

interface ShareButtonProps {
  song: Song;
}

const ShareButton: React.FC<ShareButtonProps> = ({ song }) => {
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    // Create a shareable URL with song ID
    const shareUrl = `${window.location.origin}/song/${song.id}`;
    
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} by ${song.artist}`,
          text: `Check out ${song.title} by ${song.artist} on VibeLoop!`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fall back to clipboard copy
        copyToClipboard(shareUrl);
      }
    } else {
      // Fall back to clipboard copy
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Share song"
    >
      {isShared ? (
        <span className="text-sm font-medium">Copied!</span>
      ) : (
        <Share2 size={20} />
      )}
    </button>
  );
};

export default ShareButton;
