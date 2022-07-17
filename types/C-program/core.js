const { printC, printCLn } = require("../../utilities/printer");
const config = require("./config.js");

module.exports = {
    callback: (structures) => {
        printCLn(config.name + " : ", "blue")
        Object.keys(structures).forEach(structureName => {
            printCLn("\t->" + structureName + " : " + structures[structureName].length, "blue")
        });
    }
}