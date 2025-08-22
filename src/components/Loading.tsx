'use client';

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-white flex flex-col items-center justify-center">
      <div className="relative">
        {/* Logo atau nama aplikasi */}
        <div className="text-2xl font-bold text-purple-600 mb-4">LokaAdicara</div>
        
        {/* Loading animation */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce"></div>
        </div>
        
        {/* Loading text */}
        <div className="mt-4 text-sm text-gray-500">
          Loading amazing events for you...
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
