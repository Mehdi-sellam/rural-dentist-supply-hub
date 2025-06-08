
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import BundleOffers from '@/components/BundleOffers';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <BundleOffers />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
