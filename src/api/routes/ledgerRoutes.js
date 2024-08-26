const ledgerController = require('../controllers/ledgerController');
const path = require('path')

function router(socket, rootPath){
    // Route to get ledger history
    socket.on(path.resolve(rootPath, 'latest'), (data) => ledgerController.getLedgerHistory(data, socket));

    // Route to get transactions for a specific ledger
    socket.on(path.resolve(rootPath, 'transactions'), (data) => ledgerController.getLedgerTransactions(data, socket));

}

module.exports = router;
