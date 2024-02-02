const express = require('express');
const peerController = require('../controllers/peerController');

const router = express.Router();

// Route to get peer information
router.get('/', peerController.getPeerInformation);

module.exports = router;
