
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TestDashboard from '@/components/TestDashboard';

const TestSuite = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TestDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default TestSuite;
