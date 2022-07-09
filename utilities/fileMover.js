const fs = require("fs");
const { printC, printCLn } = require("../utilities/printer");
const path = require("path");
const { log } = require("../utilities/logger");

module.exports = {
    mover: (pathToPutImage, filePath, fileName) => {
        // Check if the folder exists
        if (!fs.existsSync(pathToPutImage)){
            fs.mkdirSync(pathToPutImage, { recursive: true });
        }


        // If file already exists, rename it
        var i = 1;
        while (fs.existsSync(path.join(pathToPutImage, fileName))){
            fileName = fileName.split(".");
            fileName = fileName[0] + "(" + i + ")." + fileName[1];
            i++;
        }

        if (i!==1){
            printCLn(`\tRenamed ${fileName}`);
        }

        // Move the file to the right folder
        fs.renameSync(filePath, pathToPutImage + fileName);


        // Log
        printCLn(`Moved ${fileName} to ${pathToPutImage}`, "yellow");
        
        log(`[${fileName} === ${pathToPutImage}]`, false, "mv-logs");
        log(`Moved ${fileName} to ${pathToPutImage}`);
    }
}