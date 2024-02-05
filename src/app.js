const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api');
const { getSiginificantTransactions } = require('./api/controllers/ledgerController');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;