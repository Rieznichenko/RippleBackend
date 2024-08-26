const express = require('express');
const serverController = require('../controllers/serverController');
const path = require('path')

function router(socket, rootPath){
    // Route to get the state of a single server
    socket.on(path.resolve(rootPath, '/hubstate'), data => serverController.getServerState(data, socket));

    // Route to get the states of multiple servers
    socket.on(path.resolve(rootPath, '/allstates'), data => serverController.getServerStates(data, socket));
}

module.exports = router;
