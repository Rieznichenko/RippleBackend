const serverService = require('../services/serverService');

// Get the state of a single server
const getServerState = async (req, res) => {
  try {
    const serverState = await serverService.getServerState();
    res.json(serverState);
  } catch (error) {
    console.error('Error fetching server state:', error);
    res.status(500).send("An error occurred while fetching the server state.");
  }
};

// Get the states of multiple servers
const getServerStates = async (req, res) => {
  try {
    const serverStates = await serverService.getServerStates();
    res.json(serverStates);
  } catch (error) {
    console.error('Error fetching server states:', error);
    res.status(500).send("An error occurred while fetching server states.");
  }
};

// Get statistics data
const getStatisticsData = async (req, res) => {
  try {
    const statisticsData = await serverService.getStatisticsData();
    res.json(statisticsData);
  } catch (error) {
    console.error('Error fetching statistics data:', error);
    res.status(500).send("An error occurred while fetching statistics data.");
  }
};

module.exports = {
  getServerState,
  getServerStates,
  getStatisticsData
};
