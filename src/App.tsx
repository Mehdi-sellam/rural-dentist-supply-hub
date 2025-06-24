import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Shop from '@/pages/Shop';
import Catalog from '@/pages/Catalog';
import Bundles from '@/pages/Bundles';
import Cart from '@/pages/Cart';

// Simple Home page
const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <div className="bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🦷 DentGo - Home Page
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Welcome to DentGo! This is the home page with routing working.
          </p>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="space-y-2 text-gray-600">
              <li>✅ CSS is loading correctly</li>
              <li>✅ JavaScript is working</li>
              <li>✅ React Router is functional</li>
              <li>✅ Components are rendering</li>
              <li>✅ Original Header component added</li>
              <li>✅ HeroSection component added</li>
              <li>✅ CategoryGrid component added</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple About page
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About DentGo
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          This is the about page. Routing is working correctly!
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('App component is rendering');

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (!isReady) {
        console.log('App: Timeout reached, forcing ready state');
        setIsReady(true);
      }
    }, 5000);

    // Try to initialize the app
    try {
      console.log('App: Initializing...');
      // Simulate initialization
      setTimeout(() => {
        console.log('App: Initialization complete');
        setIsReady(true);
      }, 100);
    } catch (err) {
      console.error('App: Initialization error:', err);
      setError('Failed to initialize application');
      setIsReady(true);
    }

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing DentGo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-bold text-lg mb-2">{error}</p>
          <p className="text-muted-foreground">Please refresh the page or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/bundles" element={<Bundles />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
