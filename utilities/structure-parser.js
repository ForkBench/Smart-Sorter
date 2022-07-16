const fs = require('fs');
const { log } = require('../utilities/logger');
const { printCLn, printC } = require('../utilities/printer');

function tabulationAdder(n) {
    var str = "";
    for (var i = 0; i < n; i++) {
        str += "\t";
    }
    return str;
}

function emptySpaceRemover(str) {
    // Remove tabs, and spaces
    return str.replace(/\s/g, '');
}

function getContent(content) {


    if (content === "*") {
        return {value: "*", required: true};
    } else if (content.startsWith("?")) {
        return {value: getContent(content.substring(1, content.length)).value, required: false};
    }

    return {value: content, required: true}


}


function parser(lines) {

    var paths = [];
    var currentPath = ".";
    var requiredFolder = true;
    
    lines.forEach(line => {
        var clearedLine = emptySpaceRemover(line);
        if (clearedLine.startsWith("[")) {
            var name = getContent(clearedLine.substring(1, clearedLine.length - 2));
            if (name.required) {
                requiredFolder = true;
                currentPath += "/" + name.value;
            } else {
                requiredFolder = false;
            }
        } else if (clearedLine.startsWith("}")) {
            // We have to remove everything after the last "/"
            if (requiredFolder === true) {
                currentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
            }
            requiredFolder = true;
        } else {
            var content = getContent(clearedLine);
            if (content.required) {
                paths.push(currentPath + "/" + content.value);
            }
        }
    });

    return paths;

}

module.exports = {
    structureParser: (filePath) => {

        printC(`Parsing structure file: ${filePath}...`);
        log(`Parsing structure file: ${filePath}...`);
        const input = fs.readFileSync(filePath, 'utf8');

        const lines = input.split("\n");

        const data = parser(lines);

        printCLn(`Parsing structure file: ${filePath}... done.`);
        log(`Parsing structure file: ${filePath}... done.`);
        fs.writeFileSync(filePath.replace(new RegExp("st$"), 'txt'), data.join("\n"));

    }
}