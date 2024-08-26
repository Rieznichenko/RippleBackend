const express = require('express');
const statsController = require('../controllers/statsController');

function router(socket){
    // Route to get general statistics data
    socket.on('/', statsController.getStatistics);
}
module.exports = router;
