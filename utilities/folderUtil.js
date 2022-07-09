module.exports = {
    getDirectParent: (folder) => {
        var splitted = folder.split("/");
        if (splitted.length < 3) {
            return undefined
        }
        
        return splitted[splitted.length - 3];
    }
}