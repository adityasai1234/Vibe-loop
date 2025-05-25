import WaveSurfer from 'wavesurfer.js';
import { CanvasRecorder } from 'canvas-recorder';
import { Song } from '../types/types';

interface SnippetOptions {
  song: Song;
  startTime?: number; // seconds
  duration?: number; // seconds (default 15)
  width?: number; // canvas width (default 720)
  height?: number; // canvas height (default 720)
  backgroundColor?: string;
  waveColor?: string;
  progressColor?: string;
}

interface ExportProgress {
  stage: 'loading' | 'processing' | 'recording' | 'finalizing' | 'complete';
  progress: number; // 0-100
  message: string;
}

export class SnippetExporter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private wavesurfer: WaveSurfer | null = null;
  private recorder: CanvasRecorder | null = null;
  private audio: HTMLAudioElement | null = null;
  private onProgress?: (progress: ExportProgress) => void;

  constructor(onProgress?: (progress: ExportProgress) => void) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.onProgress = onProgress;
  }

  async exportSnippet(options: SnippetOptions): Promise<Blob> {
    const {
      song,
      startTime = 0,
      duration = 15,
      width = 720,
      height = 720,
      backgroundColor = '#000000',
      waveColor = '#ffffff',
      progressColor = '#3b82f6'
    } = options;

    this.updateProgress('loading', 0, 'Loading audio...');

    try {
      // Setup canvas
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.display = 'none';
      document.body.appendChild(this.canvas);

      // Load audio
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.src = song.audioSrc;
      
      await new Promise((resolve, reject) => {
        this.audio!.onloadeddata = resolve;
        this.audio!.onerror = reject;
        this.audio!.load();
      });

      this.updateProgress('processing', 20, 'Setting up waveform...');

      // Create hidden container for wavesurfer
      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);

      // Initialize WaveSurfer
      this.wavesurfer = WaveSurfer.create({
        container,
        waveColor,
        progressColor,
        backgroundColor: 'transparent',
        height: 200,
        normalize: true,
        backend: 'WebAudio'
      });

      await new Promise((resolve, reject) => {
        this.wavesurfer!.on('ready', resolve);
        this.wavesurfer!.on('error', reject);
        this.wavesurfer!.load(song.audioSrc);
      });

      this.updateProgress('recording', 40, 'Recording video...');

      // Setup recorder
      this.recorder = new CanvasRecorder(this.canvas, {
        fps: 30,
        videoBitsPerSecond: 2500000
      });

      // Start recording
      this.recorder.start();
      
      // Set audio position and play
      this.audio.currentTime = startTime;
      this.wavesurfer.seekTo(startTime / this.audio.duration);
      this.audio.play();

      // Record frames
      const frameInterval = 1000 / 30; // 30 FPS
      const totalFrames = duration * 30;
      let currentFrame = 0;

      await new Promise<void>((resolve) => {
        const recordFrame = () => {
          if (currentFrame >= totalFrames) {
            resolve();
            return;
          }

          // Clear canvas
          this.ctx.fillStyle = backgroundColor;
          this.ctx.fillRect(0, 0, width, height);

          // Draw waveform
          this.drawWaveform(width, height, waveColor, progressColor);

          // Draw song info overlay
          this.drawSongInfo(song, width, height);

          // Draw progress indicator
          this.drawProgress(currentFrame / totalFrames, width, height);

          // Update wavesurfer progress
          const progress = currentFrame / totalFrames;
          const seekPosition = (startTime + (progress * duration)) / this.audio!.duration;
          this.wavesurfer!.seekTo(Math.min(seekPosition, 1));

          currentFrame++;
          
          // Update export progress
          const exportProgress = 40 + (progress * 50);
          this.updateProgress('recording', exportProgress, `Recording frame ${currentFrame}/${totalFrames}`);

          setTimeout(recordFrame, frameInterval);
        };

        recordFrame();
      });

      this.updateProgress('finalizing', 90, 'Finalizing video...');

      // Stop recording and get blob
      const blob = await this.recorder.stop();

      // Cleanup
      this.audio.pause();
      this.audio = null;
      this.wavesurfer.destroy();
      this.wavesurfer = null;
      document.body.removeChild(this.canvas);
      document.body.removeChild(container);

      this.updateProgress('complete', 100, 'Video ready!');

      return blob;
    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  private drawWaveform(width: number, height: number, waveColor: string, progressColor: string) {
    if (!this.wavesurfer) return;

    // Get waveform canvas from wavesurfer
    const waveCanvas = this.wavesurfer.getWrapper().querySelector('canvas');
    if (!waveCanvas) return;

    // Calculate waveform area
    const waveHeight = height * 0.3;
    const waveY = height * 0.4;
    
    // Draw waveform background
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    this.ctx.drawImage(waveCanvas, 0, waveY, width, waveHeight);
    this.ctx.restore();

    // Draw progress overlay
    const progress = this.wavesurfer.getCurrentTime() / this.wavesurfer.getDuration();
    this.ctx.fillStyle = progressColor;
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillRect(0, waveY, width * progress, waveHeight);
    this.ctx.globalAlpha = 1;
  }

  private drawSongInfo(song: Song, width: number, height: number) {
    const centerX = width / 2;
    
    // Draw album art
    if (song.albumArt) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = song.albumArt;
      
      const artSize = Math.min(width, height) * 0.25;
      const artX = centerX - artSize / 2;
      const artY = height * 0.1;
      
      // Draw circular album art with glow effect
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(centerX, artY + artSize / 2, artSize / 2, 0, Math.PI * 2);
      this.ctx.clip();
      
      // Glow effect
      this.ctx.shadowColor = '#ffffff';
      this.ctx.shadowBlur = 20;
      this.ctx.drawImage(img, artX, artY, artSize, artSize);
      this.ctx.restore();
    }

    // Draw song title
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = `bold ${width * 0.04}px Inter, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Add text shadow
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetY = 2;
    
    this.ctx.fillText(song.title, centerX, height * 0.8);

    // Draw artist name
    this.ctx.font = `${width * 0.03}px Inter, sans-serif`;
    this.ctx.fillStyle = '#cccccc';
    this.ctx.fillText(song.artist, centerX, height * 0.85);

    // Draw VibeLoop branding
    this.ctx.font = `${width * 0.025}px Inter, sans-serif`;
    this.ctx.fillStyle = '#888888';
    this.ctx.fillText('VibeLoop', centerX, height * 0.95);
    
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetY = 0;
  }

  private drawProgress(progress: number, width: number, height: number) {
    // Draw progress bar
    const barWidth = width * 0.8;
    const barHeight = 4;
    const barX = (width - barWidth) / 2;
    const barY = height * 0.75;

    // Background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(barX, barY, barWidth, barHeight);

    // Progress
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillRect(barX, barY, barWidth * progress, barHeight);

    // Progress indicator
    const indicatorX = barX + (barWidth * progress);
    this.ctx.beginPath();
    this.ctx.arc(indicatorX, barY + barHeight / 2, 6, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fill();
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private updateProgress(stage: ExportProgress['stage'], progress: number, message: string) {
    if (this.onProgress) {
      this.onProgress({ stage, progress, message });
    }
  }

  private cleanup() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.wavesurfer = null;
    }
    if (this.recorder) {
      this.recorder.stop();
      this.recorder = null;
    }
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  // Static method for easy sharing
  static async shareSnippet(blob: Blob, song: Song): Promise<boolean> {
    const fileName = `${song.title.replace(/[^a-z0-9]/gi, '_')}_snippet.webm`;
    
    // Try native sharing first
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], fileName, { type: blob.type });
      
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${song.title} - ${song.artist}`,
            text: `Check out this snippet from VibeLoop! 🎵`,
            files: [file]
          });
          return true;
        } catch (error) {
          console.log('Native sharing cancelled or failed:', error);
        }
      }
    }

    // Fallback: download file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return false; // Indicates fallback was used
  }
}

export default SnippetExporter;