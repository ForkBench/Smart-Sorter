const chalk = require("chalk");

module.exports = {

    printCLn: (text, color="green") => {
            
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(chalk[color](`${text}\n`));
    
    },

    printC: (text, color="green") => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(chalk[color](text));
    }

}