const fs = require('fs');
const { printC } = require('../utilities/printer');
const { log } = require('../utilities/logger');

function configNameContains(name, config, forbidden=false) {

    if (name.includes("#") || name.includes("~") || name.startsWith(".")) {
        return false;
    }

    var validNumber = 0;
    if (config.length == 0) {
        return !forbidden;
    }

    name = name.toLowerCase();

    var isCurrentObjectValid;

    for (var i = 0; i < config.length; i++) {

        for (var j = 0; j < config[i].body.length; j++) {
            isCurrentObjectValid = true;
            if (config[i].body[j].includes) {
                if (!name.includes(config[i].body[j].includes)) {
                    isCurrentObjectValid = false;
                }
            }
            if (config[i].body[j].startsWith) {
                if (!name.startsWith(config[i].body[j].startsWith)) {
                    isCurrentObjectValid = false;
                }
            }
            if (config[i].body[j].endsWith) {
                if (!name.endsWith(config[i].body[j].endsWith)) {
                    isCurrentObjectValid = false;
                }
            }
            if (config[i].body[j].equalTo) {
                if (name != config[i].body[j].equalTo) {
                    isCurrentObjectValid = false;
                }
            }

            if (isCurrentObjectValid) {
                validNumber++;
            }
        }
    }

    return validNumber > 0;
}

function verifyName(name, importedType){

    name = name.toLowerCase();

    if (name.includes("#") || name.includes("~") || name.startsWith(".")) {
        return false;
    }

    // Contains forbidden parts like for screenshots
    var containsForbidden = configNameContains(name, importedType.forbiddenBody, true);
    if (containsForbidden) {
        return false;
    }

    // Has to contains required parts like for screenshots
    var containsValid = configNameContains(name, importedType.requiredBody);

    return containsValid;
    
}

module.exports = {
    fileCommandVerifier: (filePath, importedType, config) => {
        // We check if the extension is valid for this type
        const extension = filePath.split(".").pop();
        const fileName = filePath.split("/").pop();

        if (!importedType.extensions.includes(extension.toLowerCase())) {
            return;
        }

        if (!verifyName(fileName, importedType)) {
            return;
        }

        // We call the callback function
        printC(`\tReading ${filePath}...`, "blue");
        log(`\tReading ${filePath}...`);
        importedType.callback(filePath, config);
    },

    folderCommandVerifier: (folderPath, importedType, config) => {
        // We check if the extension is valid for this type
        const files = fs.readdirSync(folderPath);

        if (files.length == 0) {
            return;
        }

        const extensions = [];

        files.forEach(element => {
            // verify that it's a file
            var elementName = element.split("/").pop();
            if (!elementName.includes("#") && !elementName.includes("~") && !elementName.startsWith(".")) {
                if (fs.statSync(folderPath + element).isFile()) {
                    var extension = element.split(".").pop();
                    extensions.push(extension.toLowerCase());
                }
            }
            
        });

        var containExtensions = (importedType.extensions.length == 0) ? true : false;
        importedType.extensions.forEach(element => {
            if (extensions.includes(element)) {
                containExtensions = true;
            }
        });

        if (!containExtensions) {
            return;
        }

        const splittedName = folderPath.split("/");
        const folderName = splittedName[splittedName.length - 2]; // -2 because it's like this : "X/folderName/"

        if (!verifyName(folderName, importedType)) {
            return;
        }

        // We check if the folder includes one of the required body
        // (required body here can be like "main.c", then other files)
        // We check if the file name doesn't have a forbidden body
        var isAborescenceValid = (importedType.requiredFiles.length == 0) ? true : false;
        for (var i = 0; i < files.length; i++) {
            var element = files[i];
            var elementName = element.split("/").pop();
            if (configNameContains(elementName, importedType.forbiddenFiles, true)) {
                return;
            }
            if (configNameContains(elementName, importedType.requiredFiles)) {
                isAborescenceValid = true;
            }
        }

        if (!isAborescenceValid) {
            return;
        }

        // We call the callback function
        printC(`\tReading ${folderPath}...`, "blue");
        log(`\tReading ${folderPath}...`);
        importedType.callback(folderPath, config);
    }
}