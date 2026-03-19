exports.getStats = (req, res) => {
  res.json({
    orders: 42,
    period: "Last 7 days"
  });
};
