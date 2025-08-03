import HeroSection from '@/components/heroSection';
import UpcomingConcerts from '@/components/Upcomingconcerts';
import CustomBanner from '@/components/MyCustomBanner';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <UpcomingConcerts />
      <CustomBanner />
    </div>
  );
}
