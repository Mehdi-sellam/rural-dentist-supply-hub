import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('main.tsx is executing');

const App = () => {
  return React.createElement('div', {
    style: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }
  }, [
    React.createElement('h1', { key: 'title' }, 'DentGo - Test Page'),
    React.createElement('p', { key: 'message' }, 'If you can see this, React is working!'),
    React.createElement('p', { key: 'time' }, `Current time: ${new Date().toLocaleString()}`),
    React.createElement('p', { key: 'status' }, 'Status: SUCCESS!')
  ]);
};

const rootElement = document.getElementById("root");
console.log('Root element:', rootElement);

if (rootElement) {
  console.log('Creating React root...');
  const root = createRoot(rootElement);
  console.log('Rendering App component...');
  root.render(React.createElement(App));
  console.log('App component rendered');
} else {
  console.error('Root element not found!');
  document.body.innerHTML = '<h1>ERROR: Root element not found!</h1>';
}
