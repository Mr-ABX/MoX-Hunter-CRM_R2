import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppRouter } from './app-router';
import { ModelProvider } from './contexts/model-context';

// Add global suppression for Monaco editor cancellation errors
window.addEventListener('unhandledrejection', (event) => {
  try {
    if (event.reason) {
      const reason = event.reason;
      const isCancelation = 
        reason === 'cancelation' ||
        reason.type === 'cancelation' ||
        reason.msg === 'operation is manually canceled' ||
        reason.message === 'operation is manually canceled' ||
        (typeof reason === 'string' && (reason.includes('cancelation') || reason.includes('manually canceled'))) ||
        (reason.stack && (reason.stack.includes('cancelation') || reason.stack.includes('manually canceled')));
        
      if (isCancelation) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }

      // Safe stringify check
      const reasonStr = typeof reason === 'object' ? JSON.stringify(reason) : String(reason);
      if (reasonStr.includes('cancelation') || reasonStr.includes('manually canceled') || reasonStr.includes('operation is manually canceled')) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    }
  } catch (err) {
    // Avoid circular structure errors while checking
    if (event.reason) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }
});

// Suppress error event for cancelation
window.addEventListener('error', (event) => {
  try {
    if (event.error) {
      const errorStr = typeof event.error === 'object' ? JSON.stringify(event.error) : String(event.error);
      if (errorStr.includes('cancelation') || errorStr.includes('operation is manually canceled')) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
    }
    if (event.message?.includes('cancelation') || event.message?.includes('operation is manually canceled')) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  } catch (err) {
    // Ignore issues in error stringification
  }
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ModelProvider>
        <AppRouter />
      </ModelProvider>
    </ErrorBoundary>
  </StrictMode>,
);

