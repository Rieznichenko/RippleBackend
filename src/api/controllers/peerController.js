const peerService = require('../services/peerService');

// Get information about peers
const getPeerInformation = async (req, res) => {
  try {
    const peerInfo = await peerService.getPeerInformation();
    res.json(peerInfo);
  } catch (error) {
    console.error('Error fetching peer information:', error);
    res.status(500).send("An error occurred while fetching peer information.");
  }
};

module.exports = {
  getPeerInformation
};
