const { default: axios } = require('axios');
const ledgerService = require('../services/ledgerService');
const fs = require('fs').promises;
const { readJsonFile } = require("../../utils/readJsonFile");


// Get the history of ledgers
const getLedgerHistory = async (data, socket) => {
  try {
    // const history = await ledgerService.getLedgerHistory();
    const history = await readJsonFile("ledgerhistory.json");
    

    socket.emit('/ledger/latest', {status:200, history});
  } catch (error) {
    console.error('Error fetching ledger history:', error);
    socket.emit('/ledger/latest',{status : 500, message: "An error occurred while fetching ledger history."});
  }
};

// Get transactions for a specific ledger identified by its index
const getLedgerTransactions = async (data, socket) => {
  const ledgerIndex = data.id;
  try {
    const transactions = await ledgerService.getLedgerTransactions(ledgerIndex);
    socket.emit('/ledger/transactions',{status:200, transactions });
  } catch (error) {
    console.error('Error fetching ledger transactions:', error);
    socket.emit('/ledger/transactions',{status:500, message:"An error occurred while fetching ledger transactions."});
  }
};

const getSiginificantTransactions = async (req, res) => {
  
  try {
    const scrapData = fs.readFileSync('scrapData.json');
    res.json(JSON.parse(new String(scrapData)).top_transactions);
  } catch (error) {
    console.error('Error fetching ledger transactions:', error);
    res.status(500).send("An error occurred while fetching ledger transactions.");
  }
}

module.exports = {
  getLedgerHistory,
  getLedgerTransactions,
  getSiginificantTransactions
};
