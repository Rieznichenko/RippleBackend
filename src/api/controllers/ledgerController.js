const { default: axios } = require('axios');
const ledgerService = require('../services/ledgerService');

// Get the history of ledgers
const getLedgerHistory = async (req, res) => {
  try {
    const history = await ledgerService.getLedgerHistory();
    res.json({ history });
  } catch (error) {
    console.error('Error fetching ledger history:', error);
    res.status(500).send("An error occurred while fetching ledger history.");
  }
};

// Get transactions for a specific ledger identified by its index
const getLedgerTransactions = async (req, res) => {
  const ledgerIndex = req.params.id;
  try {
    const transactions = await ledgerService.getLedgerTransactions(ledgerIndex);
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching ledger transactions:', error);
    res.status(500).send("An error occurred while fetching ledger transactions.");
  }
};

const getSiginificantTransactions = async (req, res) => {
  
  try {
    const response = await axios('https://bithomp.com/api/cors/v2/transactions/whale');
    const data = response.data;
    res.json(data);
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
