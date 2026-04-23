import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('--- RollCall App Initializing ---');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('CRITICAL: Root element not found in the DOM!');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
