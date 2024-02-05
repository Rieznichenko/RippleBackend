const express = require('express');
const ledgerController = require('../controllers/ledgerController');

const router = express.Router();

// Route to get ledger history
router.get('/latest', ledgerController.getLedgerHistory);

// Route to get transactions for a specific ledger
router.get('/transactions/:id', ledgerController.getLedgerTransactions);

//Route to get most significant transactions in last 24 hours
router.get('/:id/transactions', ledgerController.getSiginificantTransactions);

module.exports = router;
