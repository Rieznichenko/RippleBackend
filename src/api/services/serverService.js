require('dotenv').config();
const xrpl = require("xrpl");
const { getStatisticsData } = require("./statsService");

const getServerState = async () => {
    const MY_SERVER = process.env.RIPPLE_SERVER_WEBSOCKET;
    const client = new xrpl.Client(MY_SERVER);
    await client.connect();
    // Get The peers protocol
    const response = await client.request({
        id: 1,
        command: "server_state",
    });
    // Usage
    let nodeInfoList = [];
    nodeInfoList.push(extractServerInfo(response));

    await client.disconnect();
    return nodeInfoList;
};

const getServerStates = async () => {
    const serverUrls = [
        process.env.RIPPLE_SERVER_WEBSOCKET,
        process.env.RIPPLE_SERVER_WEBSOCKET,
        process.env.RIPPLE_NODE2_WEBSOCKET,
        process.env.RIPPLE_NODE3_WEBSOCKET,
        process.env.RIPPLE_NODE4_WEBSOCKET,
    ];

    const clients = serverUrls.map((url) => new xrpl.Client(url));

    const serverStatePromises = clients.map((client, index) =>
        index === 0 ? getStatisticsData(client) : getServerStateData(client)
    );

    const serverStates = await Promise.all(
        serverStatePromises.map((p) => p.catch((e) => ({ error: e.message })))
    );

    // Extract statistics and server status into separate variables
    const [statistics, ...serverStatus] = serverStates;

    await Promise.all(
        clients.map((client) =>
            client.disconnect().catch((e) => console.error("Failed to disconnect", e))
        )
    );

    // Return the result in the desired format
    return {
        statistics: statistics,
        serverStatus: serverStatus,
    };
};

const getServerStateData = async (client) => {
    try {
        try {
            await client.connect();
        } catch (e) {
            await client.disconnect();
            return "";
        }
        const response = await client.request({
            command: "server_state",
        });
        return extractServerInfo(response);
    } catch (error) {
        process.exit(1);
        console.error("An ZZZ error occurred:", error);
        await client.disconnect();
        throw error;
    } finally {
        await client.disconnect();
    }
}

const extractServerInfo = (jsonData) => {
    const nodeData = {
        pubkey: jsonData.result.state.pubkey_node,
        version: jsonData.result.state.build_version,
        uptime: jsonData.result.state.uptime,
        proposers: jsonData.result.state.last_close.proposers,
        quorum: jsonData.result.state.validation_quorum,
        ledger_Index: jsonData.result.state.validated_ledger.seq,
        peers: jsonData.result.state.peers,
    };
    return nodeData;
}
module.exports = {
    getServerState,
    getServerStates,
};
