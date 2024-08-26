require('dotenv').config();
const axios = require("axios");
const xrpl = require("xrpl");
const fs = require('fs')


const MY_SERVER = process.env.RIPPLE_SERVER_WEBSOCKET;
const client = new xrpl.Client(MY_SERVER);
const connect_2 = async () => {
    try {
        await client.connect();
    } catch (e) {
        return e;
    }
}


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
    //const MY_SERVER = process.env.RIPPLE_SERVER_WEBSOCKET;
    //const client = new xrpl.Client(MY_SERVER);
    //try {
    //    await client.connect();
    //} catch (e) {
    //    return statisticsData;
    //}
    
    
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
    statisticsData.TPS = statisticsData.txCount / 3.00006;
    statisticsData.TPS = statisticsData.TPS.toFixed(2);
    //console.log(`Benchmark 1 Time:  milliseconds`);
    const startTime = performance.now();
    //const transactionData = await axios.get(
    //    "https://livenet.xrpl.org/api/v1/metrics"
    //);
    //const response = await fetch('https://livenet.xrpl.org/api/v1/metrics');
    //if (!response.ok) {
    //    throw new Error(`HTTP error! status: ${response.status}`);
    //}
    //const transactionData = await response.json();
    //const endTime = performance.now();
    //console.log(`Benchmark 2 Time: ${endTime - startTime} milliseconds`);
    //statisticsData.TPS = transactionData.txn_sec;    
    // client.disconnect();
    
    
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
    connect_2
};
