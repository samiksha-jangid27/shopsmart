function formatPrice(price) {
  // reject non-numbers
  if (typeof price !== "number") return null;

  // format to 2 decimal places
  return `$${price.toFixed(2)}`;
}

module.exports = { formatPrice };