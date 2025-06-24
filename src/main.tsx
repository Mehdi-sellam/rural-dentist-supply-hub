import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/hooks/useLanguage';
import App from './App.tsx';
import './index.css';

console.log('main.tsx is executing');

const rootElement = document.getElementById("root");
console.log('Root element:', rootElement);

if (rootElement) {
  console.log('Creating React root...');
  const root = createRoot(rootElement);
  console.log('Rendering App component with all providers...');
  root.render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
  console.log('App component rendered with all providers');
} else {
  console.error('Root element not found!');
  document.body.innerHTML = '<h1>ERROR: Root element not found!</h1>';
}
