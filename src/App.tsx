import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryGrid from '@/components/CategoryGrid';
import BundleOffers from '@/components/BundleOffers';
import TestimonialsSection from '@/components/TestimonialsSection';
import InfoSection from '@/components/InfoSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Index from '@/pages/Index';
import Shop from '@/pages/Shop';
import Bundles from '@/pages/Bundles';
import Catalog from '@/pages/Catalog';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Auth from '@/pages/Auth';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Account from '@/pages/Account';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Loyalty from '@/pages/Loyalty';
import FAQ from '@/pages/FAQ';
import NotFound from '@/pages/NotFound';

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  console.log('App component is rendering');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <ErrorBoundary>
          <div>Loading Header...</div>
          <Header />
        </ErrorBoundary>
        
        <main>
          <ErrorBoundary>
            <div>Loading Routes...</div>
            <Routes>
              <Route path="/" element={
                <ErrorBoundary>
                  <div>Loading Index page...</div>
                  <Index />
                </ErrorBoundary>
              } />
              <Route path="/shop" element={<Shop />} />
              <Route path="/bundles" element={<Bundles />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/account" element={<Account />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>

        <ErrorBoundary>
          <div>Loading Footer...</div>
          <Footer />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div>Loading WhatsApp...</div>
          <WhatsAppFloat />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default App;
