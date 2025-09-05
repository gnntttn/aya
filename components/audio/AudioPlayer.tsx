import React, { useRef, useEffect, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  title: string;
  autoPlay: boolean;
  onClose: () => void;
}

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

export function AudioPlayer({ src, title, autoPlay, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      if (audioEl.src !== src) {
        audioEl.src = src;
      }
      if (autoPlay) {
        audioEl.play().catch(e => console.error("Autoplay failed:", e));
      }
    }
  }, [src, autoPlay]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };
  
  const handleClose = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
      }
      onClose();
  }

  useEffect(() => {
      const audioEl = audioRef.current;
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      
      audioEl?.addEventListener('play', onPlay);
      audioEl?.addEventListener('pause', onPause);
      
      return () => {
          audioEl?.removeEventListener('play', onPlay);
          audioEl?.removeEventListener('pause', onPause);
      };
  }, []);

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-30 animate-fade-in">
      <div className="glass-card p-3 flex items-center justify-between gap-3 shadow-2xl">
         <audio ref={audioRef} className="hidden" />
        <button onClick={togglePlayPause} className="text-[var(--accent-primary)] flex-shrink-0" aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="flex-1 min-w-0 text-center">
          <p className="text-sm font-semibold truncate text-[var(--text-primary)]" dir="rtl">{title}</p>
        </div>
        <button onClick={handleClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex-shrink-0" aria-label="Close player">
            <CloseIcon />
        </button>
      </div>
    </div>
  );
}