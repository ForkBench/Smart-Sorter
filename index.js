const eventEmitter = require('events');
const emitter = new eventEmitter();
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
    const moduleConfig = require(`./types/${folder}/config.js`);

    const structures = fs.readdirSync(`./types/${folder}/structures`);
    structures.forEach(structure => {
        const structurePath = `./types/${folder}/structures/${structure}/${structure}.st`;
        var matchingPath = structureComparator(workPath, structurePath);
        if (matchingPath.length > 0) {
            module.callback(matchingPath, structure);
        }
    });

    printC(`Importing ${folder}`);
    log(`Loaded module ${folder}`);
});

const read = (dir = workPath) => {
    var elements = fs.readdirSync(dir);
    elements.forEach(element => {
        if (!element.startsWith(".")) {
            var elementPath = path.join(dir, element);
            if (fs.statSync(elementPath).isDirectory()) {
                read(elementPath + "/");
            } else {
                emitter.emit('file', elementPath);
            }
        }
    });
}

read();

process.on("exit", () => {
    printCLn("\nDone.\n");
    log("Done.");
    log("----------", true);
});