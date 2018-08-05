'use strict';

const {fork, spawn} = require('child_process');
const del = require('del');
const gulp = require('gulp');
const {normalize} = require('path');

/**
 * Builds the project.
 */
gulp.task('build', () => _exec('node_modules/.bin/tsc'));

/**
 * Deletes all generated files and reset any saved state.
 */
gulp.task('clean', () => del(['.nyc_output', 'doc/api', 'var/**/*', 'web']));

/**
 * Sends the results of the code coverage.
 */
gulp.task('coverage', () => _exec('node_modules/.bin/coveralls', ['var/lcov.info']));

/**
 * Builds the documentation.
 */
gulp.task('doc:api', () => _exec('node_modules/.bin/esdoc'));
gulp.task('doc:web', () => _exec('mkdocs', ['build']));
gulp.task('doc', gulp.series('doc:api', 'doc:web'));

/**
 * Fixes the coding standards issues.
 */
gulp.task('fix', () => _exec('node_modules/.bin/tslint', ['--fix', ...sources]));

/**
 * Performs static analysis of source code.
 */
gulp.task('lint', () => gulp.src(['*.js', 'bin/*.js', 'lib/**/*.js', 'test/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format())
);

/**
 * Starts the proxy server.
 */
gulp.task('serve', done => {
  if ('_server' in global) global._server.kill();
  global._server = fork('bin/reverse_proxy.js', ['--address=localhost', '--target=80'], {stdio: 'inherit'});
  done();
});

/**
 * Runs the unit tests.
 */
gulp.task('test', () => _exec('node_modules/.bin/nyc', [normalize('node_modules/.bin/mocha'), 'test/**/*.ts']));

/**
 * Watches for file changes.
 */
gulp.task('watch', () => {
  gulp.watch(['bin/*.js', 'lib/**/*.js'], {ignoreInitial: false}, gulp.task('serve'));
  gulp.watch('test/**/*.js', gulp.task('test'));
});

/**
 * Runs the default tasks.
 */
gulp.task('default', gulp.task('build'));

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {Object} [options] The settings to customize how the process is spawned.
 * @return {Promise} Completes when the command is finally terminated.
 */
function _exec(command, args = [], options = {shell: true, stdio: 'inherit'}) {
  return new Promise((resolve, reject) => spawn(normalize(command), args, options)
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : resolve())
  );
}
