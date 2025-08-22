'use client';
import React from 'react';
import { useGlobalLoading } from '@/context/GlobalLoadingContext';

const GlobalLoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-sm mx-4">
        {/* Logo atau nama aplikasi */}
        <div className="text-2xl font-bold text-purple-600 mb-4 text-center">LokaAdicara</div>
        
        {/* Loading animation */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-sm text-gray-600 text-center">
          {loadingMessage}
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
