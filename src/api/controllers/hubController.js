const { default: axios } = require('axios');
const hubService = require('../services/hubService');
const fs = require('fs').promises;


// Get the history of ledgers
const getHubData = async (req, res) => {
    try {
        let ret = await hubService.getHubData();
        res.json({ ret });
    } catch (error) {
        console.error('Error fetching hub servers:', error);
        res.status(500).send("An error occurred while fetching hub servers.");
    }
};

module.exports = {
    getHubData,
};
