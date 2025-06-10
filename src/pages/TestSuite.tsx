
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TestDashboard from '@/components/TestDashboard';

const TestSuite = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <TestDashboard />
      <Footer />
    </div>
  );
};

export default TestSuite;
