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

exports.testOsWin32 = function (test) {
    var os = require('os');
    var original = os.platform;
    os.platform = function () {
        return 'win32';
    };
    var svink = require('../lib/svink').svink;
    process.chdir(__dirname);
    svink({
        input: './samples/circle.svg',
        'output-path': './output/osWin32'
    }, function () {
        os.platform = original;
        test.ok(true);
        test.done();
    });
};

exports.testOsWin32InvalidPaths = function (test) {
    var os = require('os');
    var original = os.platform;
    os.platform = function () {
        return 'win32';
    };
    var svink = require('../lib/svink').svink;
    process.chdir(__dirname);
    svink({
        input: './samples/circle.svg',
        'output-path': './output/osWin32InvalidPaths',
        'paths': 'invalid'
    }, function () {
        os.platform = original;
        test.ok(true);
        test.done();
    });
};

exports.testOsWin32MockLinuxPaths = function (test) {
    var os = require('os');
    var path = require('path');
    var original = [os.platform, process.env.Path, process.env.ProgramFiles, process.env['ProgramFiles(x86)']];
    process.env.ProgramFiles = 'invalid';
    delete process.env['ProgramFiles(x86)'];
    delete process.env.Path;
    os.platform = function () {
        return 'win32';
    };
    var svink = require('../lib/svink').svink;
    process.chdir(__dirname);
    svink({
        input: './samples/circle.svg',
        'output-path': './output/osWin32MockLinuxPaths',
        'paths': path.join(__dirname, 'dummy')
    }, function () {
        os.platform = original[0];
        process.env.Path = original[1];
        process.env.ProgramFiles = original[2];
        process.env['ProgramFiles(x86)'] = original[3];
        test.ok(true);
        test.done();
    });
};