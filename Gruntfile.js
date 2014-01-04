'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    clean: ['test/output', 'coverage', 'docs'],
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      package: {
        src: 'package.json'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js', 'bin/*.js']
      },
      test: {
        src: ['test/**/*.js', 'test/samples/*.json']
      }
    },
    nodeunit: {
      all: ['test/*_test.js'],
      quick: ['test/no_render_test.js'] // Faster version without Inkscape run.
    },
    watch: {
      package: {
        files: '<%= jshint.package.src %>',
        tasks: ['jshint:package']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: [
          'jshint:lib',
          'nodeunit:quick'
        ]
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit:quick']
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        logo: '../res/logo.svg',
        options: {
          paths: 'lib/',
          outdir: 'docs/'
        }
      }
    },
    exec: {
      cover: {
        command: '"node_modules/.bin/istanbul" cover node_modules/grunt-contrib-nodeunit/node_modules/nodeunit/bin/nodeunit -- test'
      },
      // Faster version without Inkscape run.
      'cover-quick': {
        command: '"node_modules/.bin/istanbul" cover node_modules/grunt-contrib-nodeunit/node_modules/nodeunit/bin/nodeunit -- test/no_render_test.js'
      },
      report: {
        command: '"./coverage/lcov-report/index.html"'
      },
      help: {
        command: '"./docs/index.html"'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-exec');


  // Multi tasks.
  grunt.registerTask('test', ['clean', 'jshint', 'nodeunit:all']);
  grunt.registerTask('cover', 'Generate coverage report.', ['clean', 'exec:cover']);
  grunt.registerTask('cover-quick', 'Generate coverage report.', ['clean', 'exec:cover-quick']);
  grunt.registerTask('report', 'Show coverage report.', ['exec:report']);
  grunt.registerTask('doc', 'Generate documentation.', ['clean', 'yuidoc']);
  grunt.registerTask('help', 'View generated documentation.', ['exec:help']);

  // Default task.
  grunt.registerTask('default', ['test']);
};
