import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock fetch to simulate the backend API integration
global.fetch = vi.fn((url) => {
  if (url === 'http://localhost:5005/api/stats') {
    return Promise.resolve({
      json: () => Promise.resolve({ orders: 99, period: "All Time" })
    });
  }
  return Promise.reject(new Error("Unknown URL"));
});

describe('App Component', () => {
  it('renders the ShopSmart logo', () => {
    render(<App />);
    expect(screen.getByText(/Shop/i)).toBeInTheDocument();
    expect(screen.getByText(/Smart/i)).toBeInTheDocument();
  });

  it('fetches and displays dynamic stats', async () => {
    render(<App />);
    
    // Check loading state (defined as "..." in useState)
    expect(screen.getByText("...")).toBeInTheDocument();

    // Wait for the mock fetch to resolve
    await waitFor(() => {
      expect(screen.getByText("99")).toBeInTheDocument();
      expect(screen.getByText("All Time")).toBeInTheDocument();
    });
  });
});