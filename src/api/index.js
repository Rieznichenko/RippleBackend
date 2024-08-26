const express = require('express');
const router = express.Router();

const peerRoutes = require('./routes/peerRoutes');
const serverRoutes = require('./routes/serverRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const hubRoutes = require('./routes/hubRoutes');

function socket_router(socket) {
    peerRoutes(socket, '/peers');
    serverRoutes(socket, '/servers');
    ledgerRoutes(socket, '/ledger');
    statsRoutes(socket, '/stats');
}

router.use('/hubs', hubRoutes);

module.exports = {router, socket_router};