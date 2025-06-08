
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import InfoSection from '@/components/FeaturedProducts';
import BundleOffers from '@/components/BundleOffers';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const Index = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoryGrid />
      <InfoSection />
      <BundleOffers />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
