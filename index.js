const eventEmitter = require('events');
const emitter = new eventEmitter();
const path = require('path');
const { printC, printCLn } = require('./utilities/printer');
const fs = require('fs');

const config = require('./config');

const readFolder = (dir, callbackFile, callbackFolder = undefined) => {
    // Read recursively the working folder
    fs.readdirSync(dir).forEach(element => {
        if (fs.statSync(path.join(dir, element)).isDirectory()) {

            if (dir+element+"/" !== config.path && callbackFolder !== undefined) {
                callbackFolder(dir+element+"/");
            }

            readFolder(dir+element+"/", callbackFile, callbackFolder);

        } else {

            callbackFile(dir+element);

        }
    });
}

readFolder(path.join(__dirname, "./types/"),
    (filePath) => {
        
        // We import the type
        printC(`Importing ${filePath}...`, "blue");

        const importedType = require(filePath);

        printCLn(`Loaded ${importedType.name}.`);

        emitter.on("newFile", (filePath) => {
        
            // We check if the extension is valid for this type
            const extension = filePath.split(".").pop();
            const fileName = filePath.split("/").pop();

            if (!importedType.extensions.includes(extension.toLowerCase())) {
                return;
            }

            // We check if the file name has one of the required body
            var isValid = false;
            importedType.requiredBody.forEach(element => {
                if (fileName.includes(element)) {
                    isValid = true;
                }
            });

            // We check if the file name doesn't have a forbidden body
            var containsForbidden = false;
            importedType.forbiddenBody.forEach(element => {
                if (fileName.includes(element)) {
                    isForbidden = true;
                }
            });

            if (!isValid || containsForbidden) {
                return;
            }

            // We call the callback function
            printC(`\tReading ${filePath}...`, "blue");
            importedType.callback(filePath, config);

        })

    },
    (folderPath) => {
        printCLn("-> Warning /!\\ : "+folderPath+" is a folder.", "yellow");
    }
);

readFolder(config.workPath, (filePath) => {
    emitter.emit("newFile", filePath);
});


process.on("exit", () => {
    printCLn("\nDone.\n");
});