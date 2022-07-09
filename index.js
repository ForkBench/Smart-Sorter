const eventEmitter = require('events');
const emitter = new eventEmitter();
const path = require('path');
const { printC, printCLn } = require('./utilities/printer');
const fs = require('fs');

const config = require('./config');
const commandVerifier = require('./modes/command-verifier');

const mode = config.mode;
const modeFunctions = require('./modes/mode-callback');
const { log } = require('./utilities/logger');
const fileFunction = modeFunctions[`${mode}ModeCallback`].fileFunction;
const folderFunction = modeFunctions[`${mode}ModeCallback`].folderFunction;


log(`Starting in ${mode} mode`);

const readFolder = (dir, callbackFile, callbackFolder = undefined) => {
    // Read recursively the working folder
    fs.readdirSync(dir).forEach(element => {

        var elementName = element.split("/").pop();
        if (!elementName.includes("#") && !elementName.includes("~") && !elementName.startsWith(".")) {
            if (fs.statSync(path.join(dir, element)).isDirectory()) {

                if (callbackFolder !== undefined) {
                    callbackFolder(dir+element+"/", emitter);
                }

                readFolder(dir+element+"/", callbackFile, callbackFolder);

            } else {

                if (callbackFile !== undefined) {
                    callbackFile(dir+element, emitter);
                }

            }
        }
    });
}

// Common to each mode
readFolder(path.join(__dirname, "./types/" + config.mode + "/"),
    (filePath) => {
        
        // We import the type
        printC(`Importing ${filePath}...`, "blue");
        log(`Importing ${filePath}...`);

        const importedType = require(filePath);

        printCLn(`Loaded ${importedType.name}.`);

        emitter.on("newData", (filePath) => {
        
            commandVerifier[`${mode}CommandVerifier`](filePath, importedType, config);

        })

    },
    (folderPath) => {
        printCLn("-> Warning /!\\ : "+folderPath+" is a folder.", "yellow");
        log("-> Warning /!\\ : "+folderPath+" is a folder.");
    }
);

// Changes depending on the mode
readFolder(config.workPath, fileFunction, folderFunction);


process.on("exit", () => {
    printCLn("\nDone.\n");
    log("Done.");
    log("----------", true);
});