
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🦷</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. Let's get you back to finding the dental supplies you need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" size="lg" className="gap-2">
                <Search className="w-4 h-4" />
                Browse Products
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2"
              onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Hello! I need help finding something on your website.', '_blank')}
            >
              <MessageCircle className="w-4 h-4" />
              Get Help
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">Quick Links</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/shop" className="text-primary hover:underline">Shop All Products</Link>
              <span className="text-gray-400">•</span>
              <Link to="/bundles" className="text-primary hover:underline">View Bundles</Link>
              <span className="text-gray-400">•</span>
              <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
              <span className="text-gray-400">•</span>
              <Link to="/faq" className="text-primary hover:underline">FAQ</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
