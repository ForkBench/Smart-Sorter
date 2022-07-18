
console.time("execution");  

const eventEmitter = require('events');
const emitter = new eventEmitter();

const { printC, printCLn } = require('./utilities/printer');
const fs = require('fs');


const { structureComparator } = require('./utilities/folderUtil');

const config = require('./config');
const workPath = config.workPath;
const { log } = require('./utilities/logger');

var moduleData = [];

// Import modules
fs.readdirSync("./types").forEach(folder => {
    const module = require(`./types/${folder}/core.js`);
    const moduleConfig = require(`./types/${folder}/config.js`);

    printCLn(`Importing ${folder}`);
    log(`Loaded module ${folder}`);

    const structures = fs.readdirSync(`./types/${folder}/structures`);

    printCLn(`Found ${structures.length} structures`);
    log(`Found ${structures.length} structures`);

    var typeName = moduleConfig.name;
    var typeData = {name: typeName, structures: [], priority: []};

    structures.forEach(structure => {
        typeData.structures.push(`./types/${folder}/structures/${structure}/${structure}.st`);
    });

    typeData.priority = moduleConfig.priority;

    moduleData.push(typeData);
    emitter.on(`${typeName}`, (structures) => {
        module.callback(structures);
    });

});

var matchingData = structureComparator(workPath, moduleData);

// Write data on json file with indent
fs.writeFileSync(`${workPath}/data.json`, JSON.stringify(matchingData, null, 4));

Object.keys(matchingData).forEach(moduleName => {
    emitter.emit(moduleName, matchingData[moduleName]);
});

process.on("exit", () => {
    printCLn("\nDone.\n");
    log("Done.");
    log("----------", true);
    console.timeEnd("execution");
});