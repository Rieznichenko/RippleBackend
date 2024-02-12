const { default: axios } = require('axios');
const statsService = require('../services/statsService');

// Get general statistics data
const getStatistics = async (req, res) => {
  try {
    const statistics = await statsService.getStatisticsData();
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send("An error occurred while fetching statistics.");
  }
};

module.exports = {
  getStatistics,
};
