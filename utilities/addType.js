const readline = require('readline-sync');
const fs = require('fs');

var name = readline.question("Name of the type: ");

// Check if the type already exists
if (fs.existsSync(__dirname+`/../types/${name}/`)) {
    console.log(`Type ${name} already exists.`);
    process.exit(1);
}

var verify = readline.question("Name : " + name + " ? (Y/n): ");

if (verify.toLowerCase() !== "y") {
    console.log("Aborted.");
    process.exit(1);
}

// Create the type
var folderPath = __dirname+`/../types/${name}/`;
fs.mkdirSync(folderPath);
fs.mkdirSync(`${folderPath}/structures`);
fs.mkdirSync(`${folderPath}/modules`);
fs.writeFileSync(`${folderPath}/core.js` , `const { printC, printCLn } = require("../../utilities/printer");
const config = require("./config.js");

module.exports = {
    callback: (structures) => {
        printCLn(config.name + " : ", "blue")
        Object.keys(structures).forEach(structureName => {
            printCLn("\t->" + structureName + " : " + structures[structureName].length, "blue")
        });
    }
}`);
fs.writeFileSync(`${folderPath}/config.js` , `module.exports = {
    name: "C-program",
    description: "C-program, with globally .c files.",
    mainExtensions: ["c", "h", "cpp", "hpp"],
}`);

console.log(`Type ${name} created.`);