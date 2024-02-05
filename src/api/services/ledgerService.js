require('dotenv').config();
const xrpl = require("xrpl");

//Latest 10 validated ledgers
const getLedgerHistory = async () => {
    const client = new xrpl.Client(process.env.RIPPLE_NODE2_WEBSOCKET); // This is Ripple's public server
    await client.connect();

    // Get the latest validated ledger index
    const latestLedger = await client.request({
        command: "ledger",
        ledger_index: "validated",
    });
    const latestIndex = latestLedger.result.ledger_index;

    // Calculate the range of ledgers we want to retrieve
    const minLedgerIndex = Math.max(latestIndex - 9, 1); // Ensure we don't go below ledger index 1

    const response = await client.request({
        command: "server_info",
    });

    // Extract the server time from the response
    const serverTime = response.result.info.time;
    // Request ledger data for the last 10 ledgers
    const ledgerDataRequests = [];
    for (let i = minLedgerIndex; i <= latestIndex; i++) {
        ledgerDataRequests.push(
            client.request({
                command: "ledger",
                transactions: true,
                ledger_index: i,
                expand: true,
            })
        );
    }

    // Wait for all ledger data to be retrieved
    const ledgers = await Promise.all(ledgerDataRequests);

    const feeResponse = await client.request({
        command: 'fee'
    })

    const baseFeeDrops = feeResponse.result.drops.base_fee
    const loadFactor = feeResponse.result.load_factor || 1
    // Disconnect from the server
    await client.disconnect();

    // Process and return the ledger data
    return ledgers.map((response) => {
        const ledger = response.result.ledger;
        let burnedFees = 0;
        if (ledger.transactions) {
            // Sum up the fees from all transactions in the ledger
            ledger.transactions.forEach((tx) => {
                burnedFees =
                    parseFloat(burnedFees) +
                    parseFloat(xrpl.dropsToXrp(tx.Fee));
            });
        }
        return {
            ledgerIndex: ledger.ledger_index,
            close_time: parseInt(
                (new Date(serverTime) - new Date(ledger.close_time_human)) / 1000
            ),
            hash: ledger.ledger_hash,
            transactionCount: ledger.transactions ? ledger.transactions.length : 0,
            burnedFees: parseFloat(burnedFees), // Convert the string to a float
        };
    });

};
//Extract Ledger Transactions By Index
const getLedgerTransactions = async (ledgerIndex) => {
    const client = new xrpl.Client(process.env.RIPPLE_NODE2_WEBSOCKET); // This is Ripple's public server
    try {
        await client.connect();
        let ledger = await client.request({
            command: "ledger",
            transactions: true,
            ledger_index: ledgerIndex,
            expand: true,
        });
        let burnedFees = 0;
        if (ledger.result.ledger.transactions) {
            // Sum up the fees from all transactions in the ledger
            ledger.result.ledger.transactions.forEach((tx) => {
                burnedFees =
                    parseFloat(burnedFees) +
                    parseFloat(
                        tx.metaData.TransactionResult === "tesSUCCESS"
                            ? xrpl.dropsToXrp(tx.Fee)
                            : xrpl.dropsToXrp(10)
                    );
            });
        }
        let transactions = ledger.result.ledger.transactions.map((transaction) => {
            return {
                index: transaction.metaData.TransactionIndex,
                hash: transaction.hash,
                from: transaction.Account,
                to: transaction.Destination,
                type: transaction.TransactionType,
                amount:
                    transaction.TransactionType == "Payment"
                        ? xrpl.dropsToXrp(
                            !isNaN(transaction.Amount)
                                ? transaction.Amount
                                : parseInt(transaction.Amount.value)
                        )
                        : transaction.TransactionType == "Offer" ||
                            transaction.TransactionType == "OfferOrCreate"
                            ? xrpl.dropsToXrp(
                                !isNaN(transaction.TakerGets)
                                    ? transaction.TakerGets
                                    : parseInt(transaction.TakerGets.value)
                            )
                            : null,
                fee: xrpl.dropsToXrp(transaction.Fee),
                result: transaction.metaData.TransactionResult,
                currency: transaction.Amount && transaction.Amount.currency && transaction.TakerGets && transaction.TakerGets.currency,
            };
        });
        await client.disconnect();
        return { burnedFees: parseFloat(burnedFees), transactions, close_time: new Date(ledger.result.ledger.close_time_human) };
    } catch (e) {
        console.log(e);
        await client.disconnect();
        return [];
    }
};

const getSiginificantTransactions = async () => {
    const client = new xrpl.Client(process.env.RIPPLE_NODE2_WEBSOCKET); // This is Ripple's public server
    try {
        await client.connect();
        let transactions = await client.request({
            command: "tx_history",
            start : 0
        });
        console.log(transactions.result.txs)
        // let transactionsOnedayAgo = transactions.result.txs.filter((transaction) => {

        // })
        await client.disconnect();
        return { burnedFees: parseFloat(burnedFees), transactions, close_time: new Date(ledger.result.ledger.close_time_human) };
    } catch (e) {
        console.log(e);
        await client.disconnect();
        return [];
    }
}


module.exports = {
    getLedgerHistory,
    getLedgerTransactions,
    getSiginificantTransactions
};
