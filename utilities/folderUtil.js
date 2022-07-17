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
            // If we have yet analyzed that folder, we skip it
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

    structureComparator(folder, moduleData) {
        // We have a folder directory, and a structure file that represents the folder structure.
        // We need to check if the folder directory and the structure file are the same.
        // So we have to check names, and if they are the same, we need to check if the folders are the same.
        // If they are the same, we need to check if the files are the same.
        // But we have to parse the structure, because there are globs in the structure.
        // Example:
        // name: "*.c" -> Every file with the extension c

        var globalData = [];
        var structureExtensions = [];
        var alreadyChecked = [];

        // We store the files that are valid in this array
        var matchingPath = [];

        moduleData.forEach(module => {
            var structurePaths = module.structures;
            var moduleName = module.name;
            var requiredPaths = [];
            var moduleExtensions = [];
            matchingPath[moduleName] = [];
            alreadyChecked[moduleName] = [];
            structurePaths.forEach(structurePath => {
                structureParser(structurePath);
                var paths = fs.readFileSync(structurePath.replace(new RegExp(".st$"), '-required.txt'), 'utf8');
                var pathList = paths.split("\n");
                var structureName = structurePath.split("/").pop().replace(new RegExp(".st$"), '');

                requiredPaths.push({
                    pathList: pathList,
                    deep: howDeepIsFirstExtensionFile(pathList),
                    structureName: structureName
                });

                matchingPath[moduleName][structureName] = [];
 
                pathList.forEach(path => {
                    // Get everything after the last "."
                    var extension = path.split(".").pop();
                    if (!structureExtensions.includes(extension)) {
                        structureExtensions.push(extension);
                        moduleExtensions.push(extension);
                    }
                });
            });


            globalData.push({
                name: moduleName,
                requiredPaths: requiredPaths,
                moduleExtensions: moduleExtensions,
                priority: module.priority
            });
        });

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

                            globalData.forEach(module => {

                                var moduleExtensions = module.moduleExtensions;
                                // If the file extension is in the module extensions
                                if (files.some(file => moduleExtensions.includes(file.split(".").pop()))) {

                                    const analysePath = (i) => {
                                        // Path to analyze
                                        var pathToAnalyze = getNthParent(filePath, module.requiredPaths[i].deep);
                                        var result = compareArborescence(module.requiredPaths[i].pathList, pathToAnalyze, alreadyChecked[module.name], filePath);
                                        if (result.valid === true) {
                                            alreadyChecked[module.name] = result.alreadyChecked;
                                            matchingPath[module.name][module.requiredPaths[i].structureName].push(filePath);
                                        }
                                    }

                                    module.priority.forEach(priority => {
                                        // We have to get the index of the priority in the requiredPaths array
                                        var index = module.requiredPaths.findIndex(requiredPath => requiredPath.structureName === priority);

                                        analysePath(index);
                                    });
                                    
                                    for (var i=0;i<module.requiredPaths.length;i++) {

                                        // Don't do the priority one
                                        if (module.priority.indexOf(module.requiredPaths[i].structureName) === -1) {
                                            analysePath(i);
                                        }
                                        
                                    }
                                
                                }
                            });
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