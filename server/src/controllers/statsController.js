const { getDashboardStats } = require('../services/statsService');

exports.getStats = (req, res) => {
  const data = getDashboardStats();
  res.json(data);
};
