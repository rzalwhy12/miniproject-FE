import HeroSection from '@/components/heroSection';
import UpcomingConcerts from '@/components/Upcomingconcerts';
import CustomBanner from '@/components/MyCustomBanner';
import Testimoni from '@/components/testimoni';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <UpcomingConcerts />
      <CustomBanner />
      <Testimoni/>
    </div>
  );
}
