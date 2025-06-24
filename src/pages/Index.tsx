import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import InfoSection from '@/components/InfoSection';
import BundleOffers from '@/components/BundleOffers';
import TestimonialsSection from '@/components/TestimonialsSection';

const Index = () => {
  console.log('Index page: Component rendering...');
  
  try {
    // Scroll to top when component mounts
    React.useEffect(() => {
      console.log('Index page: useEffect - scrolling to top');
      window.scrollTo(0, 0);
    }, []);

    console.log('Index page: Rendering JSX...');

    return (
      <div className="min-h-screen">
        <div>Loading HeroSection...</div>
        <HeroSection />
        <div>Loading CategoryGrid...</div>
        <CategoryGrid />
        <div>Loading InfoSection...</div>
        <InfoSection />
        <div>Loading BundleOffers...</div>
        <BundleOffers />
        <div>Loading TestimonialsSection...</div>
        <TestimonialsSection />
      </div>
    );
  } catch (error) {
    console.error('Index page: Error rendering:', error);
    return <div>Index Error: {(error as Error).message}</div>;
  }
};

export default Index;
