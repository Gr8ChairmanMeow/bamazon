var fs = require('fs');
var self = module.exports = {
    writeStream: function(array) {
        var stream = fs.createWriteStream("../txt/log.txt", {
            flags: 'a',
            encoding: null,
            mode: 0666
        });
        stream.on('error', console.error);
        array.forEach((str) => {
            stream.write(str + '\n');
        }); //end forEach loop
        stream.end();
    }, //end writeStream();
    writeFile: function(text) {
        fs.writeFile('../txt/log.txt', text, function(err) {
            if (err) throw err;
        });
    }, //end writeFile()
    appendFile(text) {
        fs.appendFile('../txt/log.txt', text + '\n', function(err) {
            if (err) throw err;
        });
    } //end appendFile()
};