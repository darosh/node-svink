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

exports.testNoCallback = function (test) {
    test.expect(1);
    
    var svink = require('../lib/svink').svink;
    process.chdir(__dirname);
    svink({
        input: './samples/circle.svg',
        'output-path': './output/noCallBack',
        'no-render': true
    });
    setTimeout(function(){
        test.ok(true);
        test.done();
    }, 200);
};
