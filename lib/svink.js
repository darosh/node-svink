/*
 * svink
 * https://github.com/darosh/node-svink
 *
 * Copyright (c) 2014 Jan Forst
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Main sving module.
 * Usage:
 *
 *      var opt = {
 *          input: 'graphics.svg',
 *          output: 'graphics.png',
 *          'output-path': 'build',     // output directory
 *          config: 'path/to/file.json' // json or yaml
 *          id: 'asset_id_3',           // element string id
 *          filter: 'rect.*',           // regex based id filter
 *          all: false,                 // all elements in SVG input file
 *          width: 48,
 *          height: 48,
 *          size: 48,                   // size sets width and height
 *          dpi: 90,                    // 90 is Inkscape default
 *          scale: 1.0,                 // alternative to dpi
 *          background: '#ff00ff',
 *      };
 *
 *      function callback(err, log) {
 *      }
 *
 *      var svink = require('svg-inkscape-rasterizer').svink;
 *
 *      // with callback
 *      svink(options, callback);
 *
 *      // or without callback
 *      svink(options);
 *
 * @module svink
 * @class svink
 */

var path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    debug = require('debug')('svink'),
    colors = require('colors'),
    _ = require('underscore'),
    async = require('async'),
    yaml = require('js-yaml'),
    ink = require('./inkscape');

var defaultConfig = 'graphics.json',
    defaults = {
        input: 'graphics.svg',
        output: 'graphics.png',
        'output-path': 'build'
    };

colors.setTheme({
    command: 'white',
    warn: 'yellow',
    error: 'red'
});

function completed(err) {
    if (!err) {
        debug('finished');
    } else {
        debug('finished with error %s', err.error);
    }
}

function expand(opt, cb) {
    glob(opt.input, function (err, files) {
        opt.inputs = files;
        cb();
    });
}

function run(opt, log, cb) {
    function iterator(item, cb) {
        var tmp = _.clone(opt);
        tmp.input = item;
        ink.render(tmp, log, cb);
    }

    expand(opt, function () {
        if (opt.inputs.length === 0) {
            cb("missing input files");
        } else {
            async.eachSeries(opt.inputs, iterator, cb);
        }
    });
}


function batch(opt, log, finale, depth) {
    function iterator(item, cb) {
        _.defaults(item, _.omit(opt, 'batch'));

        if (!item.batch) {
            run(item, log, cb);
        } else {
            batch(item, log, finale, cb);
        }
    }

    function finish(err) {
        debug('batch end');
        if (!depth) {
            finale(err);
        } else {
            depth(err);
        }
    }

    debug('batch start');
    async.eachSeries(opt.batch, iterator, finish);
}

/**
 * @method svink Main method
 * @param opt {Object} Options
 * @param cb {Function} Optional callback
 */
exports.svink = function (opt, cb) {
    var cfg,
        basedir = process.cwd(),
        cp,
        log = [];

    function finale(err) {
        debug('log %s', JSON.stringify(log));
        completed(err);

        if (cb) {
            cb(err, log);
        }
    }

    debug('started');

    debug('options: %s', JSON.stringify(opt));

    if(opt.probe) {
        ink.probe(opt, log, function(err, stderr, stdout){
            console.log(stdout);
            finale(err);
        });
        return;
    }

    opt.config = opt.config || defaultConfig;

    try {
        cp = path.join(basedir, opt.config);

        if (fs.existsSync(cp)) {
            debug('using config: %s', cp);

            var cfgJSON = fs.readFileSync(cp, 'utf8')
                            .replace(/^\uFEFF/, '');

            if (path.extname(cp) === '.yaml' || path.extname(cp) === '.yml') {
                cfg = yaml.safeLoad(cfgJSON);
            } else {
                cfg = JSON.parse(cfgJSON);
            }
        }
    } catch (ex) {
        debug('config error: %s', ex);
        finale(ex);
        return;
    }

    _.defaults(opt, defaults);

    if (cfg) {
        _.defaults(opt, cfg);
    }

    if (opt.help || opt.version || opt.probe) {
        finale();
        return;
    }

    if (!opt.batch) {
        run(opt, log, finale);
    } else {
        batch(opt, log, finale);
    }
};
