import React from 'react';

interface LoadingIndicatorProps {
    message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in" aria-label={message}>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="mt-4 text-lg text-[var(--text-secondary)]">{message}</p>
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
