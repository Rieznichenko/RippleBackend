const express = require('express');
const peerController = require('../controllers/peerController');
const path = require('path')

function router(socket, rootPath){
   socket.on(path.resolve(rootPath,''), (data) => peerController.getPeerInformation(data, socket));
}

module.exports = router;
