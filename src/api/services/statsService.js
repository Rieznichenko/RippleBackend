require('dotenv').config();
const xrpl = require("xrpl");

const getStatisticsData = async () => {
    let statisticsData = {
        ledgerIndex: 0,
        closeTime: "",
        TPS: 0,
        txCount: 0,
        quorum: 0,
        proposers: 0,
    };
    //try to connect to Server
    try {
        await client.connect();
    } catch (e) {
        return statisticsData;
    }
    const server_state = await client.request({
        id: 1,
        command: "server_state",
    });
    console.log(server_state.result.state.validated_ledger.seq);
    console.log(server_state.result.state.validated_ledger.close_time);
    console.log(server_state.result.state.validation_quorum);
    console.log(server_state.result.state.last_close.proposers);

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
    console.log(ledger_state.result.ledger.transactions.length);
    statisticsData.txCount = Math.round(
        ledger_state.result.ledger.transactions.length
    );

    const transactionData = await axios.get(
        "https://livenet.xrpl.org/api/v1/metrics"
    );
    console.log(transactionData.data.txn_sec);
    statisticsData.TPS = transactionData.data.txn_sec;

    console.log(statisticsData);
    client.disconnect();
    return statisticsData;
};

module.exports = {
    getStatisticsData,
};
