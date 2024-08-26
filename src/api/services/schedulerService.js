const cron = require("node-cron");
const path = require('path')
const fs = require('fs').promises;
const ledgerService = require("./ledgerService");
const peerService = require("./peerService");
const serverService = require("./serverService");
const statsService = require("./statsService");
// const prisma = new PrismaClient();

let scheduledJob = {};


const storeDataIntoFile = async (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const jsonFilePath = `./stored_data/${filename}`;
    const dirPath = path.dirname(jsonFilePath);
    await fs.mkdir(dirPath, { recursive: true });
    
    await fs.writeFile(jsonFilePath, jsonContent, 'utf8');
    console.log(`Data has been written to ${jsonFilePath}`);
}


// Main Schedule Interface
const initSchedule = async () => {

    //Run Pace Report Scraper Bot Every 3 seconds
    
    cron.schedule("*/3 * * * * *", async () => {
        const startTime = performance.now();
        // console.log("Running 1 bot function...");
        const legderhistory = await ledgerService.getLedgerHistory();
        storeDataIntoFile(legderhistory, 'ledgerhistory.json');
        const endTime = performance.now();
        // console.log(`Benchmark 1 Time: ${endTime - startTime} milliseconds`);
    });

    cron.schedule("*/3 * * * * *", async () => {
        //const startTime = performance.now();
        // console.log("Running 1 bot function...");
        const peerinformation = await peerService.getPeerInformation();
        storeDataIntoFile(peerinformation, 'peerinformation.json');

        //const endTime = performance.now();
        // console.log(`Benchmark 1 Time: ${endTime - startTime} milliseconds`);
    });
    
    cron.schedule("*/2 * * * * *", async () => {
        const startTime = performance.now();
        // console.log("Running 1 bot function...");
        const serverstate = await serverService.getServerState();
        storeDataIntoFile(serverstate, 'serverstate.json');
        const endTime = performance.now();
        // console.log(`Benchmark 1 Time: ${endTime - startTime} milliseconds`);
    });
    
    cron.schedule("*/1 * * * * *", async () => {
        console.log("@@@@@@@@@@@@@@@@@@@@@@getServerStates");
        const startTime = performance.now();
        
        const serverstates = await serverService.getServerStates();
        
        storeDataIntoFile(serverstates, 'serverstates.json');

        const endTime = performance.now();
        console.log(`Benchmark 1 Time: ${endTime - startTime} milliseconds`);
    });
    
    cron.schedule("*/2 * * * * *", async () => {
        const startTime = performance.now();
        // console.log("Running 1 bot function...");
        //const statisticsdata = await statsService.getStatisticsData();
        //storeDataIntoFile(statisticsdata, 'statistics.json');

        const endTime = performance.now();
        // console.log(`Benchmark 1 Time: ${endTime - startTime} milliseconds`);
    });


    
}

module.exports = { initSchedule };
