const express = require('express');
const peerRoutes = require('./routes/peerRoutes');
const serverRoutes = require('./routes/serverRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const statsRoutes = require('./routes/statsRoutes');

const router = express.Router();

router.use('/peers', peerRoutes);
router.use('/servers', serverRoutes);
router.use('/ledgers', ledgerRoutes);
router.use('/stats', statsRoutes);

module.exports = router;