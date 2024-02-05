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

const getNumberOfAccounts = async (req, res) => {
  try {
    const response = await axios('https://bithomp.com/api/cors/v2/statistics');
    const data = response.data;
    res.json({
      accounts : data.accounts.created - data.accounts.deleted
    });
  } catch (error) {
    console.error('Error fetching ledger transactions:', error);
    res.status(500).send("An error occurred while fetching ledger transactions.");
  }
}

module.exports = {
  getStatistics,
  getNumberOfAccounts
};
