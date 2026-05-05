import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock global fetch before each test
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({ orders: 99, period: 'Test Period' }),
    })
  );
});

describe('App Component — Unit Tests', () => {
  it('renders the ShopSmart logo text', () => {
    render(<App />);
    expect(screen.getByText(/Shop/i)).toBeInTheDocument();
    expect(screen.getByText(/Smart/i)).toBeInTheDocument();
  });

  it('shows loading state before fetch resolves', () => {
    render(<App />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('fetches and renders dynamic stats from API', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('Test Period')).toBeInTheDocument();
    });
  });
});