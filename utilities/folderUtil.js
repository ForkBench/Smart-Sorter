const glob = require('glob');
const { structureParser } = require('./structure-parser');
const fs = require('fs');

function fileExists(filePath, folderName) {
    try {
        // We keep only the files that match the pattern
        // AND only between them that have the same name as the folder
        return glob.sync(filePath).filter(file => file.indexOf(folderName) !== -1);
    } catch (err) {
        return undefined;
    }
}

function howDeepIsFirstExtensionFile(requiredPaths) {
    // We have a list of paths, we need to find the less deep one
    var minDepth = Infinity;
    var minDepth = requiredPaths.reduce((min, path) => {
        var depth = path.split('/').length;
        return depth < min ? depth : min;
    }, Infinity);

    return minDepth - 2; // We need to remove the "./" and to have a depth of 1 to the folder name
}

function getNthParent(path, n) {
    var pathArray = path.split('/');
    if (n >= pathArray.length) {
        return '';
    }
    return pathArray.slice(0, pathArray.length - n).join('/');
}


function compareArborescence(requiredPaths, folderPath, alreadyChecked, folderName) {
    // Sometimes, another slash appears, remove it
    folderName = folderName.replace("//", "/");

    for (var i = 0; i < requiredPaths.length; i++) {
        // We get the path of the file in the structure
        var path = requiredPaths[i];
        // We check if the file exists in the folder
        var matches = fileExists(folderPath + "/" + path, folderName);
        if (matches === undefined || matches.length === 0) {
            return {valid: false};
        }
        // Check if every matches are already checked
        if (alreadyChecked.length > 0) {
            var everythingAlreadyChecked = true;
            for (var j = 0; j < matches.length; j++) {
                if (alreadyChecked.indexOf(matches[j]) === -1) {
                    everythingAlreadyChecked = false;
                    alreadyChecked.push(matches[j]);
                }
            }
            // If we have yet analysed that folder, we skip it
            if (everythingAlreadyChecked === true) {
                return {valid: false};
            }
        } else {
            // If it's the first time checking this file, we add it
            alreadyChecked = matches;
        }

    }

    return {valid: true, alreadyChecked: alreadyChecked};
}


module.exports = {
    getDirectParent: (folder) => {
        var splitted = folder.split("/");
        if (splitted.length < 3) {
            return undefined
        }
        
        return splitted[splitted.length - 3];
    },

    structureComparator(folder, structurePath, alreadyChecked = []) {
        // We have a folder directory, and a structure file that represents the folder structure.
        // We need to check if the folder directory and the structure file are the same.
        // So we have to check names, and if they are the same, we need to check if the folders are the same.
        // If they are the same, we need to check if the files are the same.
        // But we have to parse the structure, because there are globs in the structure.
        // Example:
        // name: "*.c" -> Every file with the extension c

        structureParser(structurePath);

        const requiredStructure = fs.readFileSync(structurePath.replace(new RegExp(".st$"), '-required.txt'), 'utf8');
        const requiredPaths = requiredStructure.split("\n"); // Split the structure into lines.
        const deep = howDeepIsFirstExtensionFile(requiredPaths);


        var structureExtensions = [];    
        requiredPaths.forEach(path => {
            // Get everything after the last "."
            var extension = path.split(".").pop();
            if (!structureExtensions.includes(extension)) {
                structureExtensions.push(extension);
            }
        });

        // We store the files that are valid in this array
        var matchingPath = [];

        const readFolder = (dir) => {
            var files = fs.readdirSync(dir);
            files.forEach(file => {
                var fileName = file.split("/").pop();

                // Ignore hidden files
                if (!fileName.startsWith(".")) {
                    // Make the new path
                    var filePath = dir + "/" + file;
                    if (fs.statSync(filePath).isDirectory()) {

                        // We get the files
                        var files = fs.readdirSync(filePath);

                        // If one of the file extensions of files is in extensions array
                        if (files.some(file => structureExtensions.includes(file.split(".").pop()))) {
                            var pathToAnalyse = getNthParent(filePath, deep);

                            // We check if the folder is following the structure
                            var data = compareArborescence(requiredPaths, pathToAnalyse, alreadyChecked, filePath);

                            if (data.valid === true) {
                                alreadyChecked = data.alreadyChecked;
                                matchingPath.push(filePath);
                            }
                        }

                        // Recursion
                        readFolder(filePath);
                    }
                }

                
            });
        }

        readFolder(folder);

        return matchingPath;
    }


}