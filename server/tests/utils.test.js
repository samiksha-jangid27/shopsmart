const { formatPrice } = require('../src/utils');

describe('Unit Tests — Utility Functions', () => {
  test('formatPrice formats a positive integer correctly', () => {
    expect(formatPrice(36)).toBe('$36.00');
  });

  test('formatPrice formats a float correctly', () => {
    expect(formatPrice(89.99)).toBe('$89.99');
  });

  test('formatPrice rejects a string input', () => {
    expect(formatPrice('100')).toBeNull();
  });

  test('formatPrice rejects null', () => {
    expect(formatPrice(null)).toBeNull();
  });
});
