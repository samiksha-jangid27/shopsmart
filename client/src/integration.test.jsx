import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Fix: vi must be imported from vitest — was missing in original file
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          status: 'ok',
          message: 'Integration working',
          orders: 42,
          period: 'Last 7 days',
        }),
    })
  );
});

describe('App Component — Integration Tests', () => {
  it('calls the API on mount', async () => {
    render(<App />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('calls the correct API URL', async () => {
    render(<App />);
    await waitFor(() => {
      const calledUrl = global.fetch.mock.calls[0][0];
      expect(calledUrl).toContain('/api/stats');
    });
  });
});