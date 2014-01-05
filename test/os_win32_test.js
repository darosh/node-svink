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
    svink({
        input: '../samples/circle.svg',
        'output-path': '../output/osWin32'
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
    svink({
        input: '../samples/circle.svg',
        'output-path': '../output/osWin32InvalidPaths',
        'paths': 'invalid'
    }, function () {
        os.platform = original;
        test.ok(true);
        test.done();
    });
};

exports.testOsWin32MockLinuxPaths = function (test) {
    var os = require('os');
    var original = os.platform;
    var tmp = process.env.Path;
    process.env.Path = '../dummy';
    os.platform = function () {
        return 'win32';
    };
    var svink = require('../lib/svink').svink;
    svink({
        input: '../samples/circle.svg',
        'output-path': '../output/osWin32InvalidPaths',
        'paths': 'invalid'
    }, function () {
        os.platform = original;
        process.env.Path = tmp;
        test.ok(true);
        test.done();
    });
};