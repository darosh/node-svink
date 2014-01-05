# node-svink ![](https://rawgithub.com/darosh/node-svink/master/res/svink-logo-small.svg) 

[![Build Status](https://secure.travis-ci.org/darosh/node-svink.png?branch=master)](http://travis-ci.org/darosh/node-svink) [![Coverage Status](https://coveralls.io/repos/darosh/node-svink/badge.png)](https://coveralls.io/r/darosh/node-svink) [![Dependency Status](https://gemnasium.com/darosh/node-svink.png)](https://gemnasium.com/darosh/node-svink) [![NPM version](https://badge.fury.io/js/svink.png)](http://badge.fury.io/js/svink) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

SVG Inkscape multi-rasterizer.

## Getting Started

### Prerequisites

[Inkscape](http://www.inkscape.org/) installed.

### Install

- For commandline usage: `npm install -g svink`
- For API: `npm install svink`

## Commandline Usage

```
Usage:
svink [options]

Options:
  -i, --input        input SVG file              [default: "graphics.svg"]
  -o, --output       output PNG file             [default: "graphics.png"]
  -p, --output-path  output path                 [default: "build"]
  -c, --config       config file                 [default: "graphics.json"]
  -s, --id           select id
  -f, --filter       filter regex
  -a, --all          select all
  -W, --width        render width in pixels
  -H, --height       render height in pixels
  -S, --size         render rectangle in pixels
  -D, --dpi          export dpi
  -C, --scale        export scale
  -B, --background   export background color
  -l, --log          path to log
  -n, --no-render    disable render
  -?, --help         show help
  --probe            probe Inkscape version
  -d, --debug        show debug messages

Placeholders (in output file name):
  index: number of rendered file
  file: input file name
  id: SVG element id

Examples:
  svink -i graphics.svg -o rasterized.png
  svink -d -a -S 48 -i *.svg -o {index}-{file}-{id}.png
```

## API Usage

```javascript
 var opt = {
     input: 'graphics.svg',
     output: 'graphics.png',
     'output-path': 'build',     // output directory
     config: 'path/to/file.json' // json or yaml
     id: 'asset_id_3',           // element string id
     filter: 'rect.*',           // regex based id filter
     all: false,                 // all elements in SVG input file
     width: 48,
     height: 48,
     size: 48,                   // size sets width and height
     dpi: 90,                    // 90 is Inkscape default
     scale: 1.0,                 // alternative to dpi
     background: '#ff00ff',
 };

 function callback(err, log) {
 }

 var svink = require('svg-inkscape-rasterizer').svink;

 // with callback
 svink(options, callback);

 // or without callback
 svink(options);
 ```

## Examples
More examples: [test/commands](https://github.com/darosh/node-svink/tree/master/test/commands) and [test/commands-query](https://github.com/darosh/node-svink/tree/master/test/commands-query).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Jan Forst  
Licensed under the MIT license.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/darosh/node-svink/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

