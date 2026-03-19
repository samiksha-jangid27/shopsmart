/**
 * Formats a number to a USD price string
 * @param {number} amount 
 * @returns {string} 
 */
function formatPrice(amount) {
  if (typeof amount !== 'number') return null;
  return `$${amount.toFixed(2)}`;
}

module.exports = { formatPrice };
