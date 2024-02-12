require('dotenv').config();
const axios = require("axios");
const xrpl = require("xrpl");

const getStatisticsData = async () => {
    let statisticsData = {
        ledgerIndex: 0,
        closeTime: "",
        TPS: 0,
        txCount: 0,
        quorum: 0,
        proposers: 0,
        accounts: 0,
    };
    //try to connect to Server
    const MY_SERVER = process.env.RIPPLE_SERVER_WEBSOCKET;
    const client = new xrpl.Client(MY_SERVER);
    try {
        await client.connect();
    } catch (e) {
        return statisticsData;
    }
    const server_state = await client.request({
        id: 1,
        command: "server_state",
    });

    statisticsData.ledgerIndex = server_state.result.state.validated_ledger.seq;
    if (server_state.result.state.validated_ledger.close_time)
        statisticsData.closeTime = covertRippleTimestamp(
            server_state.result.state.validated_ledger.close_time
        );
    statisticsData.quorum = server_state.result.state.validation_quorum;
    statisticsData.proposers = server_state.result.state.last_close.proposers;

    const ledger_state = await client.request({
        command: "ledger",
        ledger_index: statisticsData.ledgerIndex,
        transactions: true,
        expand: true,
        owner_funds: false,
    });
    statisticsData.txCount = Math.round(
        ledger_state.result.ledger.transactions.length
    );

    const transactionData = await axios.get(
        "https://livenet.xrpl.org/api/v1/metrics"
    );
    statisticsData.TPS = transactionData.data.txn_sec;

//    const accountsResponse = await axios('https://bithomp.com/api/cors/v2/statistics');
//    const accInfo = accountsResponse.data;
    
//    statisticsData.accounts = accInfo.accounts.created - accInfo.accounts.deleted;
    

    client.disconnect();
    return statisticsData;
};

const covertRippleTimestamp = function (rippleTimestamp) {
    const rippleEpochOffset = 946684800; // Ripple Epoch offset in seconds

    // Create a new Date object by converting the Ripple timestamp to milliseconds and adding the Ripple Epoch offset
    date = new Date((rippleTimestamp + rippleEpochOffset) * 1000);
    return date;
}

module.exports = {
    getStatisticsData,
};
