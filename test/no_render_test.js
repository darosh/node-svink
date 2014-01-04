'use strict';

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()

 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

var path = require('path'),
    _ = require('underscore'),
    util = require('./lib/util'),
    pkg = require('../package.json');

var commandName = 'svink';
var commandBin = pkg.bin[commandName];

function createCommandTests(commands, ok) {
    function testCommand(test, command) {
        test.expect(1);
        process.argv = command.args;
        process.argv.push('-n');
        process.chdir(command.folder);

        var cli = require('../lib/cli').cli,
            svink = require('../lib/svink').svink;

        svink(cli(), function (err) {
            test.ok(ok ? !err : !!err);
            test.done();
        });
    }

    _.each(commands, function (v) {
        v.name = v.name[0].toUpperCase() + v.name.substr(1);
        exports['testNoRender' + v.name] = function (test) {
            testCommand(test, v);
        };
    });
}

var commands;

commands = util.loadCommands(path.join(__dirname, 'commands'), commandName, commandBin);
createCommandTests(commands, true);
