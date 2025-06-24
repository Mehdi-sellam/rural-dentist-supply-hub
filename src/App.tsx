import React, { useEffect } from 'react';

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

// Simple Header without Router dependencies
const SimpleHeader = () => {
  try {
    console.log('Loading Simple Header component...');
    return (
      <header style={{ 
        padding: '10px 20px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#007bff', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            DG
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#007bff' }}>
            DentGo
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Home</a>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Shop</a>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>About</a>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Contact</a>
        </nav>
      </header>
    );
  } catch (error) {
    console.error('Simple Header component error:', error);
    return <div>Header Error: {(error as Error).message}</div>;
  }
};

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
          <SimpleHeader />
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
