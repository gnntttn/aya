
import React from 'react';

interface LoadingIndicatorProps {
    message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in" aria-label={message}>
      <div className="relative w-12 h-12">
          <div className="absolute border-4 border-solid border-transparent border-t-[var(--accent-primary)] rounded-full w-full h-full animate-spin"></div>
          <div className="absolute border-4 border-solid border-transparent border-t-[var(--accent-primary)] rounded-full w-full h-full animate-spin opacity-50" style={{animationDelay: '0.2s'}}></div>
      </div>
      <p className="mt-4 text-lg text-[var(--text-secondary)] font-lora">{message}</p>
       <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
