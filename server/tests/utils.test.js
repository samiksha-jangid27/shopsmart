const { formatPrice } = require('../src/utils');

describe('Utility Functions - formatPrice', () => {
  test('should format positive integer correctly', () => {
    expect(formatPrice(36)).toBe('$36.00');
  });

  test('should handle floats correctly', () => {
    expect(formatPrice(89.99)).toBe('$89.99');
  });

  test('should reject non-numbers', () => {
    expect(formatPrice('100')).toBeNull();
  });
});
