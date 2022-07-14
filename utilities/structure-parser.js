const fs = require('fs');

function tabulationAdder(n) {
    var str = "";
    for (var i = 0; i < n; i++) {
        str += "\t";
    }
    return str;
}

function emptySpaceRemover(str) {
    // Remove tabs, and spaces
    return str.replace(/\s/g, '');
}

function getContent(content) {


    if (content === "*") {
        return {value: "undefined", required: true};
    } else if (content.startsWith("?")) {
        return {value: getContent(content.substring(1, content.length)).value, required: false};
    }

    return {value: content, required: true}


}


function parser(lines) {
    
    var structure = ['<?xml version=”1.0" encoding=”UTF-8"?>'];
    var depth = 0;
    lines.forEach(line => {
        line = emptySpaceRemover(line);
        if (line.startsWith("[")) {
            var data = line.substring(1, line.length - 2);
            var content = getContent(data);
            var spaces = tabulationAdder(depth);
            structure.push(`${spaces}<folder name='${content.value}' required='${content.required}'>`);
            depth++;
        } else if (line.startsWith("}")) {
            depth--;
            var spaces = tabulationAdder(depth);
            structure.push(`${spaces}</folder>`);
        } else {
            var content = getContent(line);
            var spaces = tabulationAdder(depth);
            structure.push(`${spaces}<file name='${content.value}' required='${content.required}'/>`);
        }
    });
    return structure.join("\n");

}

module.exports = {
    structureParser: (filePath) => {

        const input = fs.readFileSync(filePath, 'utf8');

        const lines = input.split("\n");

        const data = parser(lines);

        fs.writeFileSync(filePath.replace(new RegExp("st$"), 'xml'), data);
        // Write lines on new xml file

        const xml2js = require('xml2js');
        xml2js.parseString(data, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                fs.writeFileSync(filePath.replace(new RegExp("st$"), 'json'), JSON.stringify(result, null, 2));
            }
        });
    }
}