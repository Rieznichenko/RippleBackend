require('dotenv').config();
const xrpl = require("xrpl");
const { getAddressCountry, sortByServerState } = require("../../utils/ipUtils");

// Cache for storing IP address to country mappings
let ip2CountryCache = {};

//XRPK Peer Information
const getPeerInformation = async () => {
try{
    const MY_SERVER_1 = process.env.RIPPLE_SERVER_WEBSOCKET;
    const MY_SERVER_2 = process.env.RIPPLE_NODE5_WEBSOCKET;
    const client_1 = new xrpl.Client(MY_SERVER_1);
    const client_2 = new xrpl.Client(MY_SERVER_2);
    await client_1.connect();
    await client_2.connect();
    // Get The peers protocol
    const response_1 = await client_1.request({
        id: 1,
        command: "peers",
    });
    const response_2 = await client_2.request({
        id: 1,
        command: "peers",
    });
    
    // Usage
    const nodeInfoList_1 = await extractNodeInfo(response_1);
    console.log(nodeInfoList_1);
    const nodeInfoList_2 = await extractNodeInfo(response_2);
    console.log(nodeInfoList_2);
    const nodeInfoList = [...nodeInfoList_1, ...nodeInfoList_2];
    //const nodeInfoList = nodeInfoList_1;
    nodeInfoList.sort(sortByServerState);
    await client_1.disconnect();
    await client_2.disconnect();
    return nodeInfoList;
    }
    catch(err){
      console.log(err);
      return [];
    }
    
};

//Extract Each Node Information
const extractNodeInfo = async (jsonObject) => {
    
    let peers = jsonObject.result.peers;
    
    const extractedInfo = await Promise.all(peers.map(async (peer) => {
        // Check cache first
        if (peer.address.includes("127.0.0")) {
            return null;
        }
        
        let country = '';
        if (ip2CountryCache[peer.address]) {
            console.log("Already Used~!!!!!~~~!!!!");
            country = ip2CountryCache[peer.address];
        }
        else {
            country = await getAddressCountry(peer.address);
            ip2CountryCache[peer.address] = country;
        }
        
        return {
            pubkey: peer.public_key,
            address: peer.address,
            country: country,
            version: peer.version,
            serverState: peer.sanity ? peer.sanity : "full",
            direction: peer.inbound ? "inbound" : "outbound", // Assuming the presence of 'inbound' indicates direction
            latency: peer.latency,
            ledgers: peer.complete_ledgers,
        };
    }));
    
    // Filter out null values and items where pubkey is undefined
    const filteredArray = extractedInfo.filter(item => item !== null && item.pubkey !== undefined);
    
    /*
    // Create a set to store unique addresses
    const uniqueAddresses = new Set();
    
    // Filter out duplicate entries based on address
    const uniqueFilteredArray = filteredArray.filter(item => {
        if (uniqueAddresses.has(item.address)) {
            return false;
        }
        uniqueAddresses.add(item.address);
        return true;
    });
    */
    console.log("Reduced~~~~~~~~~~:", extractedInfo.length - filteredArray.length);
    
    return filteredArray;
}

module.exports = {
    getPeerInformation,
};
