const fs = require("fs");

function savingJSON (name, data) {

       
    const processName = name.replace(/\s+/g, '');

    const jsonData = JSON.stringify(data);
    let nameOfFile = 'JSON/'.concat(name.concat('.json'));
    const result  = fs.writeFileSync(nameOfFile, jsonData);
    return result;
}

module.exports = savingJSON;