import React from 'react';
import type { Radio } from '../../types';

interface RadioCardProps {
  radio: Radio;
  isPlaying: boolean;
  onPlay: () => void;
  index: number;
}

const PlayIcon = ({size = 36, className=""}) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <path d="M15 24V12L24 18L15 24Z" fill="currentColor"/>
    </svg>
);

const PauseIcon = ({size = 36, className=""}) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <rect x="13" y="12" width="3" height="12" rx="1.5" fill="currentColor"/>
      <rect x="20" y="12" width="3" height="12" rx="1.5" fill="currentColor"/>
    </svg>
);

const BroadcastIcon = ({size=24, className=""}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M15.5 15.5a5.5 5.5 0 0 0 0-7" />
        <path d="M8.5 8.5a5.5 5.5 0 0 0 0 7" />
        <path d="M18.5 18.5a10 10 0 0 0 0-13" opacity="0.5"/>
        <path d="M5.5 5.5a10 10 0 0 0 0 13" opacity="0.5"/>
    </svg>
);


export function RadioCard({ radio, isPlaying, onPlay, index }: RadioCardProps) {
  return (
    <div
      style={{ animationDelay: `${index * 0.05}s` }}
      className={`glass-card p-3 transition-all duration-300 hover:border-[var(--accent-primary)] animate-fade-in ${isPlaying ? 'border-[var(--accent-primary)]' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Broadcast button (renders on the right in RTL) */}
        <button
          onClick={onPlay}
          aria-label={`Listen to ${radio.name}`}
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors bg-black/5 dark:bg-white/10 text-[var(--accent-primary)]"
        >
          <BroadcastIcon size={28} />
        </button>

        {/* Text */}
        <div className="flex-1 min-w-0 text-right">
          <h3 className="font-semibold text-base text-[var(--text-primary)] font-amiri truncate" dir="rtl">{radio.name}</h3>
        </div>

        {/* Play/Pause button (renders on the left in RTL) */}
        <button
          onClick={onPlay}
          aria-label={isPlaying ? `Pause ${radio.name}` : `Play ${radio.name}`}
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          {isPlaying ? (
            <PauseIcon size={40} className="text-[var(--accent-primary)]"/>
          ) : (
            <PlayIcon size={40}/>
          )}
        </button>
      </div>
    </div>
  );
}