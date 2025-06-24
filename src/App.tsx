import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Simple Header component
const SimpleHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DG</span>
          </div>
          <span className="font-bold text-xl text-blue-600">DentGo</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Shop</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
        </nav>
      </div>
    </header>
  );
};

// Simple Home page
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
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
          </ul>
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
      <SimpleHeader />
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
