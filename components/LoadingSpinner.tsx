
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse"></div>
      </div>
      {message && <p className="text-sm text-gray-300">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
