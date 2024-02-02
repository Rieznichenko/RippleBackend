const xrpl = require("xrpl");

// Converts Ripple timestamps to JavaScript Date objects
function convertRippleTimestamp(rippleTimestamp) {
    const rippleEpochOffset = 946684800; // Ripple Epoch offset in seconds (UNIX epoch - Ripple epoch)
    return new Date((rippleTimestamp + rippleEpochOffset) * 1000);
}

// Extract server information from a server_info or server_state command response
function extractServerInfo(jsonData) {
    return {
        node: `XRPK HUB`,
        pubkey: jsonData.result.state.pubkey_node,
        version: jsonData.result.state.build_version,
        uptime: jsonData.result.state.uptime,
        proposers: jsonData.result.state.last_close.proposers,
        quorum: jsonData.result.state.validation_quorum,
        ledgerIndex: jsonData.result.state.validated_ledger.seq,
        peers: jsonData.result.state.peers,
    };
}

// Converts currency amounts from drops to XRP
function dropsToXrp(drops) {
    return xrpl.dropsToXrp(drops);
}

// Generates a random integer between two values, inclusive
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Adds a function here for any other miscellaneous tasks that you find are repeated throughout the code

module.exports = {
    convertRippleTimestamp,
    extractServerInfo,
    dropsToXrp,
    getRandomInteger,
    // Export other miscellaneous utilities as needed
};
