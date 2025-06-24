import React, { useEffect } from 'react';
import Header from '@/components/Header';

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

// Simple test components to isolate issues
const TestHero = () => {
  try {
    console.log('Loading Hero component...');
    return <div style={{ padding: '20px', textAlign: 'center' }}>Hero Section</div>;
  } catch (error) {
    console.error('Hero component error:', error);
    return <div>Hero Error: {(error as Error).message}</div>;
  }
};

const App = () => {
  console.log('App component is rendering');

  return (
    <ErrorBoundary>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <TestHero />
        <div style={{ padding: '20px' }}>
          <h1>DentGo - Components Test</h1>
          <p>Testing individual components...</p>
          <p>Current time: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
