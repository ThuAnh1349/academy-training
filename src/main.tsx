
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Fix for Chrome extensions (like LastPass, AdBlock, Grammarly) causing Vite Error Overlays
// This prevents the harmless extension error from triggering the red screen of death.
window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message || event.reason?.toString() || '';
  if (msg.includes('A listener indicated an asynchronous response')) {
    event.preventDefault(); // Stop the error from bubbling up to Vite
    console.warn('Suppressed harmless Chrome extension error');
  }
});

async function enableMocking() {
  // MSW disabled, connecting to real API
  return
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  )
})
