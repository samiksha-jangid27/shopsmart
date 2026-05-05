/**
 * Stats Service — business logic separated from controller
 */

function getDashboardStats() {
  // In production this would query a DB / analytics service.
  // Keeping it deterministic so tests are stable.
  return {
    orders: 42,
    period: 'Last 7 days',
  };
}

module.exports = { getDashboardStats };
