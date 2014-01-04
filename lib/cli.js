/*
 * svink
 * https://github.com/darosh/node-svink
 *
 * Copyright (c) 2014 Jan Forst
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Parsing `process.argv` arguments, returns options object for {{#crossLinkModule "svink"}}{{/crossLinkModule}} module
 * @class cli
 */

var yaml = require('js-yaml'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

var js = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'CLI.yml'), 'utf8'));

var optimist = require('optimist').options(js.options).usage(js.usage);

/**
 * @private
 * @method cli
 * @return {Object} Options compatible with {{#crossLinkModule "svink"}}{{/crossLinkModule}} module
 * @param help {Bool} Allow or disallow help print
 */
exports.cli = function (help) {
    var argv = optimist.parse(process.argv);

    argv.help = process.argv.length < 3 || argv.help;

    if (argv.help && help) {
        var pkg = require('../package.json');
        console.log('%s - version: %s', pkg.name, pkg.version);
        console.log(pkg.description);
        console.log();
        console.log('Usage:');
        optimist.showHelp(console.log);
        console.log('Placeholders (in output file name):');
        _.each(js.placeholders, function(v, k){
            console.log('  %s: %s', k, v);
        });
        console.log();
        console.log('Examples:');
        _.each(js.examples, function(v){
            console.log('  %s', v);
        });
    }

    if (argv.debug) {
        process.env.DEBUG = '*';
    }

    argv = _.omit(argv, '_', '$0');

    _.each(js.options, function(v, k){
        if(v.alias) {
            delete argv[k];
        }
    });

    return argv;
};

exports.cli(true);
