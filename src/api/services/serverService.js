require('dotenv').config();
const xrpl = require("xrpl");

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

module.exports = {
    getServerState,
    getServerStates,
};
