import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './i18n/config';
import '../styles/globals.css';
import App from '../App';

// Start MSW for development
async function enableMocking() {
  try {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    });
    console.log('✅ MSW started successfully');
  } catch (error) {
    console.warn('⚠️ MSW not available:', error);
  }
}

enableMocking()
  .then(() => {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error('❌ Failed to initialize app:', error);
    // Render anyway without MSW
    const rootElement = document.getElementById('root');
    if (rootElement) {
      ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </React.StrictMode>
      );
    }
  });