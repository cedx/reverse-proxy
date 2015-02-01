/**
 * Build system.
 * @module gulpfile
 */
'use strict';

// Module dependencies.
var child=require('child_process');
var del=require('del');
var gulp=require('gulp');
var plugins=require('gulp-load-plugins')();
var pkg=require('./package.json');
var util=require('util');

/**
 * Provides tasks for [Gulp.js](http://gulpjs.com) build system.
 * @class cli.Gulpfile
 * @static
 */

/**
 * The task settings.
 * @property config
 * @type Object
 */
var config={
  output: util.format('%s-%s.zip', pkg.yuidoc.name.toLowerCase(), pkg.version)
};

/**
 * Runs the default tasks.
 * @method default
 */
gulp.task('default', [ 'dist' ]);

/**
 * Checks the package dependencies.
 * @method check
 */
gulp.task('check', function() {
  return gulp.src('package.json')
    .pipe(plugins.david())
    .pipe(plugins.david.reporter);
});

/**
 * Deletes all generated files and reset any saved state.
 * @method clean
 */
gulp.task('clean', function(callback) {
  del('var/'+config.output, callback);
});

/**
 * Creates a distribution file for this program.
 * @method dist
 */
gulp.task('dist', function() {
  var sources=[
    'index.js',
    '*.json',
    '*.md',
    '*.txt',
    'bin/*',
    'etc/*.json',
    'lib/*.js',
    'var/.gitkeep'
  ];

  return gulp.src(sources, { base: '.' })
    .pipe(plugins.zip(config.output))
    .pipe(gulp.dest('var'));
});

/**
 * Builds the documentation.
 * @method doc
 */
gulp.task('doc', [ 'doc:assets' ]);

gulp.task('doc:assets', [ 'doc:build' ], function() {
  return gulp.src([ 'www/apple-touch-icon.png', 'www/favicon.ico' ])
    .pipe(gulp.dest('doc/api/assets'));
});

gulp.task('doc:build', function(callback) {
  _exec('docgen', callback);
});

/**
 * Performs static analysis of source code.
 * @method lint
 */
gulp.task('lint', [ 'lint:doc', 'lint:js' ]);

gulp.task('lint:doc', function(callback) {
  _exec('docgen --lint', callback);
});

gulp.task('lint:js', function() {
  return gulp.src([ '*.js', 'bin/*.js', 'lib/*.js' ])
    .pipe(plugins.jshint(pkg.jshintConfig))
    .pipe(plugins.jshint.reporter('default', { verbose: true }));
});

/**
 * Starts the Web server.
 * @method serve
 */
gulp.task('serve', function(callback) {
  if('_server' in config) {
    config._server.kill();
    delete config._server;
  }

  config._server=child.fork('bin/cli.js', [ '--target', '8080' ]);
  callback();
});

/**
 * Watches for file changes.
 * @method watch
 */
gulp.task('watch', [ 'serve' ], function() {
  gulp.watch('lib/*.js', [ 'serve' ]);
});

/**
 * Runs a command and prints its output.
 * @method _exec
 * @param {String} command The command to run, with space-separated arguments.
 * @param {Function} callback The function to invoke when the task is over.
 * @async
 * @private
 */
function _exec(command, callback) {
  child.exec(command, function(err, stdout) {
    console.log(stdout.trim());
    if(err) console.error(err);
    callback();
  });
}
