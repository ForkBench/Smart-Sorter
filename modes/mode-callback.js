module.exports = {

    fileModeCallback: {
        fileFunction: (filePath, emitter) => {
            emitter.emit("newData", filePath);
        },
        folderFunction: undefined
    },
    
    folderModeCallback: {
        fileFunction: undefined,
        folderFunction: (folderPath, emitter) => {
            emitter.emit("newData", folderPath);
        }
    }
}