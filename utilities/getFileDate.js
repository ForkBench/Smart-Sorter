const { execSync } = require("child_process");

module.exports = {

    getDateFromString: (filePath) => {
    
        if (process.platform === "linux") {
            cmd = `stat -c %Y "${filePath}"`;
        } else if (process.platform === "darwin") {
            cmd = `stat -s "${filePath}"`;
        } else {
            console.error(`getFileDate() => Error: only 'linux' and 'darwin' platforms are supported`);
            return null;
        }

        var getDateResult = execSync(`stat -s "${filePath}"`)
        if (getDateResult === null) {
            return null;
        }

        // Linux
        if (process.platform === "linux") {

            getDateResult = parseInt(getDateResult);
            return getDateResult;
        
        }else if (process.platform === "darwin") {
            // get the index where creation time starts
            let start = getDateResult.indexOf("st_birthtime");
    
            // different timestamps are delimited by spaces
            let creationDate = getDateResult.toString().substring(start, getDateResult.length);
    
            // parse the complete string to get 'st_ctime' value
            let splitResult = creationDate.split(" ");
            let timestamp = splitResult[0].replace("st_birthtime=", "");
    
            // return 'null' if it's not a number
            if (isNaN(timestamp)) {
                return null;
            } else {
                timestamp = parseInt(timestamp);
                return timestamp;
            }
        }
    }
}