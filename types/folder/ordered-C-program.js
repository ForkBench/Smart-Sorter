const { printC, printCLn } = require("../../utilities/printer");
const fs = require("fs");

module.exports = {

    // The name of the type
    name: "ordered-C-program",
    // The type extensions
    extensions: [ "c", "h", "cpp", "hpp", "cc", "hh", "cxx", "hxx", "c++", "h++" ],
    // What the name should look like
    requiredBody: [],
    // What the name should not look like
    forbiddenBody: [ 
        { name: "TP", body: [ {includes: undefined, startsWith: "tp", endsWith: undefined, equalTo: undefined} ] },
    ],
    // The files required in the folder
    requiredFiles: [],
    // The files forbidden in the folder
    forbiddenFiles: [
        { name: "Exercices file", body: [{ includes: undefined, startsWith: "exo", endsWith: ".c", equalTo: undefined }] },
    ],
    // The description of the type
    description: "C programs with main files.",
    // The callback function
    callback: (filePath, config) => {

        printCLn(`\t->${filePath}`);

    }

}