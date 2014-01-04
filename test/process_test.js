'use strict';

var path = require('path'),
    exec = require('child_process').exec,
    _ = require('underscore'),
    util = require('./lib/util'),
    pkg = require('../package.json');

var commandName = 'svink';
var commandBin = pkg.bin[commandName];

function createCommandTests(commands) {
    function testCommand(test, command) {
        var cp = exec(command.simple, {cwd: command.folder});

        cp.on('close', function (code) {
            test.ok(code === 0);
            test.done();
        });
    }

    _.each(commands, function (v) {
        v.name = v.name[0].toUpperCase() + v.name.substr(1);
        exports['testProcess' + v.name] = function (test) {
            testCommand(test, v);
        };
    });
}

var commands = util.loadCommands(path.join(__dirname, 'commands-process'), commandName, commandBin);
createCommandTests(commands);
