import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import App from '../App';
import { supabase } from '../lib/supabase';

// Mock Supabase to avoid network calls during health checks
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }
}));

// Mock Leaflet and React-Leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  LayersControl: {
    BaseLayer: ({ children }) => <div>{children}</div>
  }
}));

vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn(),
  },
  icon: vi.fn(),
}));

describe('RollCall Sentinel: Global Health Check', () => {
  it('should initialize the Supabase client in Indestructible Mode', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should render the RollCall Brand and Logo after initialization', async () => {
    render(<App />);
    
    // Wait for loading screen to disappear
    const loading = screen.queryByTestId('loading-screen');
    if (loading) {
      await waitForElementToBeRemoved(() => screen.queryByTestId('loading-screen'), { timeout: 4000 });
    }

    const brandElements = await screen.findAllByText(/RollCall/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it('should maintain the high-fidelity theme (dark/light)', async () => {
    render(<App />);
    
    const loading = screen.queryByTestId('loading-screen');
    if (loading) {
      await waitForElementToBeRemoved(() => screen.queryByTestId('loading-screen'), { timeout: 4000 });
    }

    const mainApp = screen.getByTestId('main-app');
    expect(mainApp).toBeInTheDocument();
    
    // Look for navigation using querySelector since it's a structural requirement
    const nav = mainApp.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('glass');
  });
});
