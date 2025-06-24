import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';

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
  console.log('App component is rendering');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
