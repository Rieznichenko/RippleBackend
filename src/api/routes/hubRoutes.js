const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');

router.get('/', hubController.getHubData);

module.exports = router;
