import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

describe('App', () => {
  it('renders ShopSmart title', async () => {
    // Mock fetch
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 'ok',
            message: 'Test Msg',
            timestamp: 'now',
          }),
      })
    );

    render(<App />);

    const element = await screen.findByText((content, element) =>
  element.textContent === "ShopSmart"
);
    expect(element).toBeInTheDocument();
  });
});