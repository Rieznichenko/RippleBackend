const xrpl = require('xrpl');

// Create a new XRP Ledger client
async function createClient() {
  const serverURL = process.env.RIPPLE_SERVER_WEBSOCKET;
  const client = new xrpl.Client(serverURL);
  await client.connect();
  return client;
}

// Disconnect from the XRP Ledger client
async function disconnectClient(client) {
  if (client.isConnected()) {
    await client.disconnect();
  }
}

// Make a generic request to the XRP Ledger
async function makeRequest(client, request) {
  try {
    const response = await client.request(request);
    return response;
  } catch (error) {
    console.error('Error making request to XRP Ledger:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Example function to get the server info
async function getServerInfo() {
  const client = await createClient();
  try {
    const response = await makeRequest(client, { command: 'server_info' });
    return response;
  } finally {
    await disconnectClient(client);
  }
}

// Example function to get the ledger
async function getLedger(ledgerIndex) {
  const client = await createClient();
  try {
    const response = await makeRequest(client, {
      command: 'ledger',
      ledger_index: ledgerIndex,
      transactions: true,
      expand: true,
      owner_funds: false,
    });
    return response;
  } finally {
    await disconnectClient(client);
  }
}

module.exports = {
  createClient,
  disconnectClient,
  makeRequest,
  getServerInfo,
  getLedger,
  // Add more functions as needed to interact with the XRP Ledger
};
