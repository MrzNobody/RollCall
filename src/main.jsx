import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('--- RollCall App Initializing ---');

const rootElement = document.getElementById('root');
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("RollCall Hub Crash:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-8 text-center font-sans">
          <div className="w-24 h-24 bg-rose-500/20 rounded-[2rem] flex items-center justify-center mb-10 border border-rose-500/30">
            <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-4">Platform Recovery</h1>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-12 leading-relaxed">We've hit a community connection error. Let's get you back to the Hub to try again.</p>
          <button onClick={() => window.location.href = '/'} className="bg-rose-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 transition-all shadow-2xl shadow-rose-900/40">Reset Platform</button>
        </div>
      );
    }
    return this.props.children;
  }
}

if (!rootElement) {
  console.error('CRITICAL: Root element not found in the DOM!');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
}
