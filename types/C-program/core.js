module.exports = {
    callback: (folders, structureName) => {
        console.log(`${structureName} : ${folders.length}`);
        folders.forEach(folder => {
            console.log(`\t-> ${folder}`);
        });
    }
}