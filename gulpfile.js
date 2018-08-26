'use strict';

const {fork, spawn} = require('child_process');
const del = require('del');
const gulp = require('gulp');
const {delimiter, normalize, resolve} = require('path');

/**
 * The file patterns providing the list of source files.
 * @type {string[]}
 */
const sources = ['*.js', 'bin/*.js', 'example/*.ts', 'src/**/*.ts', 'test/**/*.ts'];

// Build the project.
gulp.task('build', () => _exec('tsc'));

// Delete all generated files and reset any saved state.
gulp.task('clean', () => del(['.nyc_output', 'doc/api', 'lib', 'var/**/*', 'web']));

// Send the results of the code coverage.
gulp.task('coverage', () => _exec('coveralls', ['var/lcov.info']));

// Build the documentation.
gulp.task('doc:api', () => _exec('typedoc'));
gulp.task('doc:web', () => _exec('mkdocs', ['build']));
gulp.task('doc', gulp.series('doc:api', 'doc:web'));

// Fix the coding standards issues.
gulp.task('fix', () => _exec('tslint', ['--fix', ...sources]));

// Perform static analysis of source code.
gulp.task('lint', () => _exec('tslint', sources));

// Starts the proxy server.
gulp.task('serve', done => {
  if ('_server' in global) global._server.kill();
  global._server = fork('bin/reverse_proxy.js', ['--address=localhost', '--target=80'], {stdio: 'inherit'});
  done();
});

// Run the unit tests.
gulp.task('test', () => _exec('nyc', [normalize('node_modules/.bin/mocha')]));

// Upgrade the project to the latest revision.
gulp.task('upgrade', async () => {
  await _exec('git', ['reset', '--hard']);
  await _exec('git', ['fetch', '--all', '--prune']);
  await _exec('git', ['pull', '--rebase']);
  await _exec('npm', ['install', '--ignore-scripts']);
  return _exec('npm', ['update', '--dev']);
});

// Watch for file changes.
gulp.task('watch', () => {
  gulp.watch(['bin/*.js', 'src/**/*.ts'], {ignoreInitial: false}, gulp.task('serve'));
  gulp.watch('test/**/*.ts', gulp.task('test'));
});

// Run the default tasks.
gulp.task('default', gulp.task('build'));

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {Object} [options] The settings to customize how the process is spawned.
 * @return {Promise} Completes when the command is finally terminated.
 */
function _exec(command, args = [], options = {shell: true, stdio: 'inherit'}) {
  if (!process.env.PATH.includes(normalize('node_modules/.bin'))) process.env.PATH = `${resolve('node_modules/.bin')}${delimiter}${process.env.PATH}`;
  return new Promise((fulfill, reject) => spawn(normalize(command), args, options)
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : fulfill())
  );
}
