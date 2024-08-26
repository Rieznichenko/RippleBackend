const { exec } = require('child_process');

const getHubData = () => {
    return new Promise((resolve, reject) => {
        // Execute the dig command  
        exec('dig hubs.xrpkuwait.com', (error, stdout, stderr) => {
            if (error) {
                console.error('Error fetching hub data:', error.message);
                return reject(new Error('Failed to retrieve hub data'));
            }
            if (stderr) {
                console.error('Error output:', stderr);
                return reject(new Error('Error occurred while fetching hub data'));
            }
            // Resolve with the output from the command  
            const structuredData = parseDigOutput(stdout);
            resolve(structuredData);
        });
    });
};

// Function to parse and structure the dig output
const parseDigOutput = (output) => {
    const lines = output.split('\n');
    const answerSectionStart = lines.findIndex(line => line.startsWith(';; ANSWER SECTION:'));
    const answerSectionEnd = lines.findIndex((line, index) => index > answerSectionStart && line.trim() === '');
    const whenLine = lines.find(line => line.startsWith(';; WHEN:'));

    const structuredData = lines.slice(answerSectionStart + 1, answerSectionEnd)
        .map(line => {
            const parts = line.split(/\s+/);
            return {
                name: parts[0],
                ttl: parts[1],
                class: parts[2],
                type: parts[3],
                address: parts[4]
            };
        });

    const when = whenLine ? whenLine.split('WHEN: ')[1] : null;

    return { data: structuredData, when };
};

module.exports = {
    getHubData,
};