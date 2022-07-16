const fs = require('fs');
const { log } = require('../utilities/logger');
const { printCLn, printC } = require('../utilities/printer');


function emptySpaceRemover(str) {
    // Remove tabs, and spaces
    return str.replace(/\s/g, '');
}



function parser(lines) {

    var paths = [];
    var requiredPaths = [];
    var nonRequirePaths = [];
    var currentPath = ".";

    lines.forEach(line => {
        var clearedLine = emptySpaceRemover(line);
        if (clearedLine.startsWith("[")) {
            var name = clearedLine.substring(1, clearedLine.length - 2);
            currentPath += "/" + name;
        } else if (clearedLine.startsWith("}")) {
            currentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
        } else {
            var name = clearedLine;
            paths.push(currentPath + "/" + name);
        }
    });

    paths.forEach(path => {
        if (path.includes("?")) {
            nonRequirePaths.push(path);
        } else {
            requiredPaths.push(path);
        }
    });

    return { requiredPaths, nonRequirePaths };

}

module.exports = {
    structureParser: (filePath) => {

        printC(`Parsing structure file: ${filePath}...`);
        log(`Parsing structure file: ${filePath}...`);
        const input = fs.readFileSync(filePath, 'utf8');

        const lines = input.split("\n");

        const data = parser(lines, false);

        printCLn(`Parsing structure file: ${filePath}... done.`);
        log(`Parsing structure file: ${filePath}... done.`);
        fs.writeFileSync(filePath.replace(new RegExp(".st$"), '-required.txt'), data.requiredPaths.join("\n"));
        fs.writeFileSync(filePath.replace(new RegExp(".st$"), '-non-required.txt'), data.nonRequirePaths.join("\n"));
        printCLn("Saved required and non-required paths to files.");
        log("Saved required and non-required paths to files.");
    }
}