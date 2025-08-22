"use client"
import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from '@/components/heroSection';
import UpcomingConcerts from '@/components/Upcomingconcerts';
import CustomBanner from '@/components/MyCustomBanner';
import Testimoni from '@/components/testimoni';
import ExploreByCategory from '@/components/exploreByCategory';
import { useAsyncWithLoading } from '@/hooks/useAsyncWithLoading';

export default function Home() {
  const [componentsLoaded, setComponentsLoaded] = useState({
    heroSection: false,
    upcomingConcerts: false,
    customBanner: false,
    exploreByCategory: false
  });
  
  const { executeWithLoading } = useAsyncWithLoading();

  // Simulasi loading saat page pertama kali dimuat
  useEffect(() => {
    const initializePage = async () => {
      // Simulasi loading initial page
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    executeWithLoading(initializePage, 'Loading page...');
  }, [executeWithLoading]);

  const updateComponentLoaded = useCallback((component: string) => {
    console.log(`🚀 Component ${component} loaded`);
    setComponentsLoaded(prev => {
      const newState = { ...prev, [component]: true };
      console.log('📊 Updated components state:', newState);
      return newState;
    });
  }, []);

  return (
    <div>
      <HeroSection onLoaded={() => updateComponentLoaded('heroSection')} />
      <UpcomingConcerts onLoaded={() => updateComponentLoaded('upcomingConcerts')} />
      <CustomBanner onLoaded={() => updateComponentLoaded('customBanner')} />
      <ExploreByCategory onLoaded={() => updateComponentLoaded('exploreByCategory')} />
      <Testimoni />
    </div>
  );
}
