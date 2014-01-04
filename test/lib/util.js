'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

function loadCommands(folder, commandName, commandBin) {
    var files = fs.readdirSync(folder);

    var map = _.map(files, function (v) {
        var fp = path.join(folder, v);

        if (!fs.statSync(fp).isFile()) {
            return null;
        }

        var txt = fs.readFileSync(fp, 'utf8');
        txt = txt.trim();
        var simple = txt.replace(commandName, 'node "' + path.join(__dirname, '..', '..', commandBin) + '"');
        var parsed = simple.match(/"[^"]*"|[^ ]+/g);

        return {
            name: path.basename(v, path.extname(v)),
            args: parsed,
            text: txt,
            simple: simple,
            folder: folder
        };
    });

    return _.filter(map, function (v) {
        return v !== null;
    });
}

module.exports.loadCommands = loadCommands;