import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className={`animate-spin rounded-full ${sizeClass} border-b-2 border-white`}></div>
  );
};

export default LoadingSpinner;