const fs = require('fs').promises;

const readJsonFile = async (filename) => {
    const jsonFilePath = `./stored_data/${filename}`;
    const data = await fs.readFile(jsonFilePath, 'utf8');
    if(filename == "serverstates.json") console.log(filename);
    const parseData = JSON.parse(data);
    return parseData;
}

module.exports = {
    readJsonFile
}
