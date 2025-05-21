import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

// Add polyfill for URL constructor for older browsers
if (typeof window !== 'undefined') {
  window.URL = window.URL || window.webkitURL;
}

// Add additional console logging for debugging
console.log('Starting SEO Analyzer application');

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
