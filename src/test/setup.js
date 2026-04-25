import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Robust LocalStorage Mock for JSDOM
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    clear: vi.fn(() => { store = {}; }),
    removeItem: vi.fn(key => { delete store[key]; })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock ResizeObserver which is missing in JSDOM but needed by some UI libs
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
