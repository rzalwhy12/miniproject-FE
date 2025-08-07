import HeroSection from '@/components/heroSection';
import UpcomingConcerts from '@/components/Upcomingconcerts';
import CustomBanner from '@/components/MyCustomBanner';
import Testimoni from '@/components/testimoni';
import ExploreByCategory from '@/components/exploreByCategory';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <UpcomingConcerts />
      <CustomBanner />
      <ExploreByCategory/>
      <Testimoni/>
    </div>
  );
}
