'use client';

import { useAppSelector } from '@/lib/redux/hook';

const LoadingAnimation = () => {
  const isLoading = useAppSelector((state) => state.loading);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
        </div>
      )}
    </>
  );
};

export default LoadingAnimation;
