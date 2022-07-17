const chalk = require("chalk");
const config = require("../config.json");

module.exports = {

    printCLn: (text, color="green") => {

        if (config.print !== false){ // So even if the config is undefined, we can still print
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(chalk[color](`\n${text}\n`));
        }
    
    },

    printC: (text, color="green") => {
        
        if (config.print !== false){ // So even if the config is undefined, we can still print
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(chalk[color](text));
        }
        
    }

}