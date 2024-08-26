require("dotenv").config();
const xrpl = require("xrpl");
const { getStatisticsData } = require("./statsService");

const RIPPLE_NODE1_SERVER = new xrpl.Client(
  process.env.RIPPLE_SERVER_WEBSOCKET
);
const RIPPLE_NODE2_SERVER = new xrpl.Client(process.env.RIPPLE_NODE2_WEBSOCKET);
const RIPPLE_NODE3_SERVER = new xrpl.Client(process.env.RIPPLE_NODE3_WEBSOCKET);
const RIPPLE_NODE4_SERVER = new xrpl.Client(process.env.RIPPLE_NODE4_WEBSOCKET);
const RIPPLE_NODE5_SERVER = new xrpl.Client(process.env.RIPPLE_NODE5_WEBSOCKET);

const connect = async () => {
  const tryConnect = async (server, errorLog) => {
    try {
      await server.connect();
      console.log(`${server.name} connected`);
    } catch {
      console.log(errorLog);
    }
  };

  const reconnect = async () => {
    while (true) {
      try {
        if (!RIPPLE_NODE1_SERVER.isConnected()) {
          await tryConnect(RIPPLE_NODE1_SERVER, "ERROR1");
        }

        if (!RIPPLE_NODE2_SERVER.isConnected()) {
          await tryConnect(RIPPLE_NODE2_SERVER, "ERROR2");
        }

        if (!RIPPLE_NODE3_SERVER.isConnected()) {
          await tryConnect(RIPPLE_NODE3_SERVER, "ERROR3");
        }

        if (!RIPPLE_NODE4_SERVER.isConnected()) {
          await tryConnect(RIPPLE_NODE4_SERVER, "ERROR4");
        }
        if (!RIPPLE_NODE5_SERVER.isConnected()) {
          await tryConnect(RIPPLE_NODE5_SERVER, "ERROR5");
        }

        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds before checking again
      } catch (error) {
        console.log("Error during reconnection:", error);
      }
    }
  };

  try {
    await Promise.all([
      tryConnect(RIPPLE_NODE1_SERVER, "ERROR1"),
      tryConnect(RIPPLE_NODE2_SERVER, "ERROR2"),
      tryConnect(RIPPLE_NODE3_SERVER, "ERROR3"),
      tryConnect(RIPPLE_NODE4_SERVER, "ERROR4"),
      tryConnect(RIPPLE_NODE5_SERVER, "ERROR5"),
    ]);

    // Start the reconnect loop after the initial connection
    await reconnect();
  } catch (error) {
    console.log("Error during initial connection:", error);
  }
};

const getServerState = async () => {
  const MY_SERVER = process.env.RIPPLE_SERVER_WEBSOCKET;
  const client_hub1 = RIPPLE_NODE1_SERVER;
  const client_hub2 = RIPPLE_NODE5_SERVER;
  const nodeInfoList = [];
  // Get The peers protocol
  
  let response = await client_hub1.request({
    id: 1,
    command: "server_state",
  });

  let ret = extractServerInfo(response);
  ret.node = "XRPK HUB 01";
  nodeInfoList.push(ret);

  response = await client_hub2.request({
    id: 1,
    command: "server_state",
  });

  ret = extractServerInfo(response);
  ret.node = "XRPK HUB 02";
  nodeInfoList.push(ret);
  
  
  return nodeInfoList;
};

const getServerStates = async () => {

  const servers = [
    RIPPLE_NODE1_SERVER,
    RIPPLE_NODE1_SERVER,
    RIPPLE_NODE2_SERVER,
    RIPPLE_NODE3_SERVER,
    RIPPLE_NODE4_SERVER,
    RIPPLE_NODE5_SERVER,
  ];
  const clients = servers.map((server) => server);
  console.log("Running 1 bot function...");
    
  const serverStatePromises = clients.map((client, index) =>
    index === 0 ? getStatisticsData(client) : getServerStateData(client, index)
  );
 
  const serverStates = await Promise.all(
    serverStatePromises.map((p) => p.catch((e) => ({ error: e.message })))
  );
  
  // Extract statistics and server status into separate variables
  const [statistics, ...serverStatus] = serverStates;

  // Return the result in the desired format
  
  return {
    statistics: statistics,
    serverStatus: serverStatus,
  };
};

const getServerStateData = async (client, index) => {
  try {
    console.log(`HERE${index}`);
    const response = await client.request({
      id: `${index}0`,
      command: "server_state",
    });
    return extractServerInfo(response);
  } catch (error) {
    console.log(error);
    return {};
  } finally {
  }
};

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
};
module.exports = {
  getServerState,
  getServerStates,
  connect,
};
