const serverService = require('../services/serverService');
const fs = require('fs').promises;
const { readJsonFile } = require("../../utils/readJsonFile");

// Get the state of a single server
const getServerState = async (data, socket) => {
  try {
    // const serverState = await serverService.getServerState();
    const serverState = await readJsonFile("serverstate.json");
    // console.log(serverState);
    socket.emit('/servers/hubstate', {status:200, serverState});
  } catch (error) {
    // console.error('Error fetching server state:', error);
    socket.emit('/servers/hubstate', {status:500, message:"An error occurred while fetching the server state."});
  }
};

// Get the states of multiple servers
const getServerStates = async (data, socket) => {
  try {
    // const serverStates = await serverService.getServerStates();
    const serverStates = await readJsonFile("serverstates.json");
    //console.log(serverStates);
    socket.emit('/servers/allstates', {status:200, serverStates});

  } catch (error) {
    // console.error('Error fetching server states:', error);
    socket.emit('/servers/allstates', {status:500, message:"An error occurred while fetching the server state."});
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
