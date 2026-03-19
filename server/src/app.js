const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Dashboard Stats Route
app.get('/api/stats', (req, res) => {
  res.json({
    orders: 42,
    period: "Last 7 days"
  });
});

// Root Route
app.get("/", (req, res) => {
  res.status(200).send("Server running");
});

module.exports = app;
