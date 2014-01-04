/*
 * svink
 * https://github.com/darosh/node-svink
 *
 * Copyright (c) 2014 Jan Forst
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Inkscape rasterizer
 * @class inkscape
 */

var path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    cpus = require('os').cpus().length,
    wrench = require('wrench'),
    _ = require('underscore'),
    async = require('async'),
    colors = require('colors'),
    debug = require('debug')('inkscape');

colors.setTheme({
    command: 'white',
    warn: 'yellow',
    error: 'red'
});

// TODO: called too often, result should cached
/**
 * Find executable in paths
 * @private
 * @method findExecutable
 * @param name {String} File name for example "inkscape.exe"
 * @param paths {Array} Paths to be searched
 * @returns {String} Path to file or {null}
 */
function findExecutable(name, paths) {
    var i, p;

    for (i = 0; i < paths.length; i++) {
        p = path.join(paths[i], name);

        if (fs.existsSync(p)) {
            return p;
        }
    }

    return null;
}

function run(binaryPaths, args, cb) {
    var proc,
        stdout = '',
        stderr = '';

    debug('command: %s', args.map(function (arg) {
        return '"' + String(arg).trim().replace(/"/g, '\\"') + '"';
    }).join(' ').command);

    var bin = 'inkscape';

    if (require('os').platform() === 'win32') {
        var paths = process.env.Path;

        _.each([process.env.ProgramFiles, process.env['ProgramFiles(x86)']], function (v) {
            if(v) {
                paths += ';' + path.join(v, 'Inkscape');
            }
        });

        bin = findExecutable('inkscape.exe', (binaryPaths || paths).split(';')) || bin;
    }

    proc = spawn(bin, args);

    proc.stdout.on('data', function (data) {
        stdout += data;
    });

    proc.stderr.on('data', function (data) {
        stderr += data;
    });

    proc.on('close', function (code) {
        if (stdout) {
            debug('stdout: %s', stdout);
        }

        // Inkscape bug workaround
        stderr = stderr.replace(/RegistryTool: Could not set the value '[^']*inkscape.exe'/, '').trim();

        if (stderr) {
            debug('stderr: %s', stderr.trim().warn);
        }

        if (code) {
            debug('exit code: %s', code.error);
        }

        if (stderr || code) {
            cb(stderr, stderr, stdout, code);
        } else {
            cb(null, stderr, stdout, code);
        }
    });

    proc.on('error', function (err) {
        cb(err);
    });
}

function queryAll(file, opt, cb) {
    run(opt.paths, ['--query-all', file],
        function (err, stderr, stdout, code) {
            var lines,
                res = [];

            if (!err) {
                lines = stdout.split('\n');

                _.each(lines, function (v) {
                    var items = v.split(',');
                    if (items.length === 5) {
                        res.push({
                            id: items[0].trim(),
                            x: parseFloat(items[1].trim()),
                            y: parseFloat(items[2].trim()),
                            width: parseFloat(items[3].trim()),
                            height: parseFloat(items[4].trim())
                        });
                    }
                });
                cb(null, res);
            } else {
                err.code = code;
                err.stderr = stderr;
                err.stdout = stdout;
                cb(stderr, null);
            }
        }
    );
}

function renderFile(opt, log, cb) {
    var file = path.join(opt['output-path'], opt.output),
        dir = path.dirname(file),
        args = [
            opt.input
        ];

    log.push(opt);

    file = file.replace('{file}', path.basename(opt.input, path.extname(opt.input)));
    file = file.replace('{id}', opt.id || '');
    file = file.replace('{index}', log.length);

    if (opt.id) {
        args.push('--export-id=' + opt.id);
    }

    if (opt.width || opt.size) {
        args.push('--export-width=' + (opt.width || opt.size));
    }

    if (opt.height || opt.size) {
        args.push('--export-height=' + (opt.height || opt.size));
    }

    if (opt.background) {
        args.push('--export-background=' + opt.background);
    }

    if (opt.dpi || opt.scale) {
        args.push('--export-dpi=' + (opt.scale ? (90 * opt.scale) : opt.dpi));
    }

    args.push('--export-png=' + file);

    if (!opt['no-render']) {
        fs.exists(dir, function (exists) {
            if (!exists) {
                wrench.mkdirSyncRecursive(dir);
            }

            run(opt.paths, args, cb);
        });
    } else {
        cb(null);
    }
}

function renderIds(opt, arr, log, cb) {
    function iterator(item, cb) {
        var tmp = _.defaults({id: item.id}, opt);
        renderFile(tmp, log, cb);
    }

    async.eachLimit(arr, cpus, iterator, cb);
}

/**
 * @private
 * @method probe
 * @param opt {Object} Options
 * @param log {Array} Output array of rendered image options
 * @param cb {Function} Callback
 */
exports.probe = function (opt, log, cb) {
    var args = [
        '--version'
    ];

    log.push(opt);

    run(opt.paths, args, cb);
};

/**
 * @private
 * @method render
 * @param opt {Object} Options
 * @param log {Array} Output array of rendered image options
 * @param cb {Function} Callback
 */
exports.render = function (opt, log, cb) {
    debug('using %s threads', cpus);

    if (opt.all || opt.filter) {
        queryAll(opt.input, opt, function (err, res) {
            if (!err) {
                debug('ids detected: %s', res.length);
                if (opt.filter) {
                    var rex = new RegExp(opt.filter);

                    res = _.filter(res, function (v) {
                        return rex.test(v.id);
                    });

                    debug('ids filtered: %s', res.length);
                }

                renderIds(opt, res, log, cb);
            } else {
                cb(err, log);
            }
        });
    } else {
        renderFile(opt, log, cb);
    }
};
