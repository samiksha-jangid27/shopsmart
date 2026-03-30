require('dotenv').config();
const express = require('express');
const cors = require('cors');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/healthRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/stats', statsRoutes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).send('ShopSmart API is running');
});

// Error Handling Middleware (must be last)
app.use(errorHandler);

module.exports = app;   // ✅ IMPORTANT