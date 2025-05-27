import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { motion } from 'framer-motion';

interface WaveformProps {
  audioUrl: string;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  backgroundColor?: string;
  normalize?: boolean;
  responsive?: boolean;
  onReady?: (wavesurfer: WaveSurfer) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (position: number) => void;
  onFinish?: () => void;
  className?: string;
}

const Waveform: React.FC<WaveformProps> = ({
  audioUrl,
  height = 100,
  waveColor = '#3b82f6',
  progressColor = '#1d4ed8',
  backgroundColor = 'transparent',
  normalize = true,
  responsive = true,
  onReady,
  onPlay,
  onPause,
  onSeek,
  onFinish,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      height,
      waveColor,
      progressColor,
      backgroundColor,
      normalize,
      responsive,
      backend: 'WebAudio',
      mediaControls: false,
      interact: true,
      cursorColor: progressColor,
      cursorWidth: 2,
      barWidth: 2,
      barGap: 1,
      barRadius: 1
    });

    wavesurferRef.current = wavesurfer;

    // Event listeners
    wavesurfer.on('ready', () => {
      setIsLoading(false);
      setDuration(wavesurfer.getDuration());
      onReady?.(wavesurfer);
    });

    wavesurfer.on('play', () => {
      setIsPlaying(true);
      onPlay?.();
    });

    wavesurfer.on('pause', () => {
      setIsPlaying(false);
      onPause?.();
    });

    wavesurfer.on('seek', (position) => {
      const time = position * wavesurfer.getDuration();
      setCurrentTime(time);
      onSeek?.(position);
    });

    wavesurfer.on('audioprocess', (time) => {
      setCurrentTime(time);
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onFinish?.();
    });

    wavesurfer.on('error', (error) => {
      console.error('WaveSurfer error:', error);
      setError('Failed to load audio');
      setIsLoading(false);
    });

    // Load audio
    wavesurfer.load(audioUrl);

    // Cleanup
    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl, height, waveColor, progressColor, backgroundColor, normalize, responsive]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          disabled={isLoading}
          className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </motion.button>

        <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-mono">{formatTime(currentTime)}</span>
          <span className="mx-2">/</span>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
            Loading...
          </div>
        )}
      </div>

      {/* Waveform */}
      <div className="relative">
        <div 
          ref={containerRef} 
          className="w-full"
          style={{ minHeight: height }}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Loading waveform...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar (fallback for small screens) */}
      <div className="md:hidden p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
};

export { Waveform };