require('dotenv').config();
const xrpl = require("xrpl");
const { getAddressCountry, sortByServerState } = require("../../utils/ipUtils");

//XRPK Peer Information
const getPeerInformation = async () => {
    const MY_SERVER = process.env.RIPPLE_SERVER_WEBSOCKET;
    const client = new xrpl.Client(MY_SERVER);
    await client.connect();
    // Get The peers protocol
    const response = await client.request({
        id: 1,
        command: "peers",
    });
    // Usage
    const nodeInfoList = await extractNodeInfo(response);
    nodeInfoList.sort(sortByServerState);
    await client.disconnect();
    return nodeInfoList;
};
//Extract Each Node Information
const extractNodeInfo = async () => {
    const peers = jsonObject.result.peers;
    const extractedInfo = peers.map(async (peer) => {
        return {
            pubkey: peer.public_key,
            country: await getAddressCountry(peer.address),
            version: peer.version,
            serverState: peer.sanity ? peer.sanity : "full",
            direction: peer.inbound ? "inbound" : "outbound", // Assuming the presence of 'inbound' indicates direction
            latency: peer.latency,
            ledgers: peer.complete_ledgers,
        };
    });
    return Promise.all(extractedInfo);
}

module.exports = {
    getPeerInformation,
};
