const { printC, printCLn } = require("../utilities/printer")

module.exports = {

    // The name of the type
    name: "DSLR-Picture",
    // The type extensions
    extensions: [ "jpg", "png", "gif", "fit", "raw", "cr2", "jpeg", "bmp", "tiff", "tif", "webp", "heic", "heif" ],
    // The body on the name that is required (if any)
    requiredBody: [ "P1", "IMG_", "IMG" ],
    // The body of the name that is not allowed
    forbiddenBody: [],
    // The description of the type
    description: "Pictures.",
    // The callback function
    callback: (filePath, config) => {

        printC(`\t->${filePath}`);
        
    }

}