import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize theme from localStorage on app load
const initializeTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme-settings');
    if (savedTheme) {
      const themeData = JSON.parse(savedTheme);
      
      // Apply theme to DOM
      document.documentElement.setAttribute('data-theme', themeData.mode);
      document.documentElement.style.setProperty('--primary-color', themeData.primaryColor);
      document.documentElement.style.setProperty('--font-size', `${themeData.fontSize}px`);
      
      // Apply dark/light mode classes
      if (themeData.mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    } else {
      // Default to light mode
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    }
  } catch (error) {
    console.error('Error initializing theme:', error);
    // Fallback to light mode
    document.documentElement.classList.add('light');
    document.body.classList.add('light');
  }
};

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
