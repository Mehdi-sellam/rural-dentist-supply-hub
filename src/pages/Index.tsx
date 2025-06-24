import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import InfoSection from '@/components/InfoSection';
import BundleOffers from '@/components/BundleOffers';
import TestimonialsSection from '@/components/TestimonialsSection';

const Index = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <InfoSection />
      <BundleOffers />
      <TestimonialsSection />
    </div>
  );
};

export default Index;
