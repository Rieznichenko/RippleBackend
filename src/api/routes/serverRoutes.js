const express = require('express');
const serverController = require('../controllers/serverController');

const router = express.Router();

// Route to get the state of a single server
router.get('/state', serverController.getServerState);

// Route to get the states of multiple servers
router.get('/states', serverController.getServerStates);

module.exports = router;
