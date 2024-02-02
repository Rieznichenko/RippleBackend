const express = require('express');
const ledgerController = require('../controllers/ledgerController');

const router = express.Router();

// Route to get ledger history
router.get('/history', ledgerController.getLedgerHistory);

// Route to get transactions for a specific ledger
router.get('/:id/transactions', ledgerController.getLedgerTransactions);

module.exports = router;
