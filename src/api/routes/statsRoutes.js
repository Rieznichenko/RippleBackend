const express = require('express');
const statsController = require('../controllers/statsController');

const router = express.Router();

// Route to get general statistics data
router.get('/', statsController.getStatistics);
module.exports = router;
