
console.time("execution");  
var config;
try {
    config = require('./config');
} catch (err) {
    throw new Error(`No config file found.`);
}

if (config.workPath === undefined) {
    throw new Error("No workPath defined in config.js");
}

const eventEmitter = require('events');
const emitter = new eventEmitter();

const { printC, printCLn } = require('./utilities/printer');
const fs = require('fs');


const { structureComparator } = require('./utilities/folderUtil');

const workPath = config.workPath;
const { log } = require('./utilities/logger');

var moduleData = [];

// Import modules
fs.readdirSync(__dirname + "/types").forEach(folder => {
    
    var module, moduleConfig, structures;

    try {
        module = require(__dirname + `/types/${folder}/core.js`);
        moduleConfig = require(__dirname + `/types/${folder}/config.js`);
        printCLn(`Importing ${folder}`);
        log(`Loaded module ${folder}`);

        structures = fs.readdirSync(__dirname + `/types/${folder}/structures`);
    } catch (err) {
        throw new Error(`types/${folder} is not a valid module.`);
    }

    

    printCLn(`Found ${structures.length} structures`);
    log(`Found ${structures.length} structures`);

    var typeName = moduleConfig.name;
    var typeData = {name: typeName, structures: [], priority: []};

    structures.forEach(structure => {
        typeData.structures.push(__dirname + `/types/${folder}/structures/${structure}/${structure}.st`);
    });

    typeData.priority = moduleConfig.priority;

    moduleData.push(typeData);
    emitter.on(`${typeName}`, (structures) => {
        module.callback(structures);
    });

});

log(`Reading ${workPath} folder`);
var matchingData = structureComparator(workPath, moduleData);

// Write data on json file with indent
log(`Writing data on json file with indent : ${workPath}/data.json`);
fs.writeFileSync(`${workPath}/data.json`, JSON.stringify(matchingData, null, 4));

log(`Emitting data to callbacks`)
Object.keys(matchingData).forEach(moduleName => {
    emitter.emit(moduleName, matchingData[moduleName]);
});

process.on("exit", () => {
    printCLn("\nDone.\n");
    log("Done.");
    log("----------", true);
    console.timeEnd("execution");
});