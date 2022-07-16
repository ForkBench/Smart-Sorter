const fs = require('fs');
const path = require('path');

module.exports = {
    log: (message, dateLess=false, logFolderPath="prog-logs") => {
        // logs files are stored in the logs folder
        // take the last log file and add the new message to it
        // if the log file is too big, create a new one
        var logFiles = fs.readdirSync("./logs/" + logFolderPath);

        var date = new Date();
        // For message
        var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        // For file (year-month-day)
        var dateStringFile = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        if (logFiles.length === 0) {
            fs.writeFileSync("./logs/" + logFolderPath + "log_" + dateStringFile + ".log", "");
            logFiles = fs.readdirSync("./logs/" + logFolderPath);
        }


        var logFile = logFiles[logFiles.length - 1];

        var logFilePath = path.join(__dirname, "../logs", logFolderPath, logFile);
        var logFileContent = fs.readFileSync(logFilePath, "utf8");
        var lineNumber = logFileContent.split("\n").length;

        
        if (dateLess === false) {
            fs.appendFileSync(logFilePath, `${dateString}\t : ${message}\n`);
        } else {
            fs.appendFileSync(logFilePath, `${message}\n`);
        }
    }
}