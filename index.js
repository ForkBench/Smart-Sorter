
console.time("execution");  

const path = require('path');
const { printC, printCLn } = require('./utilities/printer');
const fs = require('fs');


const { structureComparator } = require('./utilities/folderUtil');

const config = require('./config');
const workPath = config.workPath;
const { log } = require('./utilities/logger');



// Import modules
fs.readdirSync("./types").forEach(folder => {
    const module = require(`./types/${folder}/core.js`);

    printCLn(`Importing ${folder}`);
    log(`Loaded module ${folder}`);

    const structures = fs.readdirSync(`./types/${folder}/structures`);

    printCLn(`Found ${structures.length} structures`);
    log(`Found ${structures.length} structures`);

    structures.forEach(structure => {
        var structurePath = `./types/${folder}/structures/${structure}/${structure}.st`;
        
        var matchingPath = structureComparator(workPath, structurePath);
        if (matchingPath.length > 0) {
            module.callback(matchingPath, structure);
        }
    });

});

console.log("Everything is loaded");

process.on("exit", () => {
    printCLn("\nDone.\n");
    log("Done.");
    log("----------", true);
    console.timeEnd("execution");
});