const peerService = require('../services/peerService');
const fs = require('fs').promises;
const { readJsonFile } = require("../../utils/readJsonFile");


// Get information about peers
const getPeerInformation = async (data, socket) => {
  try {
    //const peerInfo = await peerService.getPeerInformation();
    const peerInfo = await readJsonFile("peerinformation.json");
    socket.emit('/peers', {status:200, peerInfo});
  } catch (error) {
    console.error('Error fetching peer information:', error);
    socket.emit('/peers', {status:500, message: "An error occurred while fetching peer information."});
  }
};

module.exports = {
  getPeerInformation
};
