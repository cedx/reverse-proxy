import {fork, spawn, SpawnOptions} from 'child_process';
import * as del from 'del';
import {promises} from 'fs';
import * as gulp from 'gulp';
import * as replace from 'gulp-replace';
import {delimiter, normalize, resolve} from 'path';

// @ts-ignore: disable processing of the imported JSON file.
import * as pkg from './package.json';

// Initialize the build system.
const _path = 'PATH' in process.env ? process.env.PATH! : '';
const _vendor = resolve('node_modules/.bin');
if (!_path.includes(_vendor)) process.env.PATH = `${_vendor}${delimiter}${_path}`;

/**
 * The file patterns providing the list of source files.
 */
const sources: string[] = ['*.ts', 'bin/*.js', 'example/*.ts', 'src/**/*.ts', 'test/**/*.ts'];

/**
 * Builds the project.
 */
gulp.task('build', () => _exec('tsc'));

/**
 * Deletes all generated files and reset any saved state.
 */
gulp.task('clean', () => del(['.nyc_output', 'doc/api', 'lib', 'var/**/*', 'web']));

/**
 * Uploads the results of the code coverage.
 */
gulp.task('coverage', () => _exec('coveralls', ['var/lcov.info']));

/**
 * Builds the documentation.
 */
gulp.task('doc', async () => {
  await promises.copyFile('CHANGELOG.md', 'doc/about/changelog.md');
  await promises.copyFile('LICENSE.md', 'doc/about/license.md');
  await _exec('typedoc');
  return _exec('mkdocs', ['build']);
});

/**
 * Fixes the coding standards issues.
 */
gulp.task('fix', () => _exec('tslint', ['--fix', ...sources]));

/**
 * Performs the static analysis of source code.
 */
gulp.task('lint', () => _exec('tslint', sources));

/**
 * Starts the proxy server.
 */
gulp.task('serve', done => {
  if ('_server' in global) (global as any)._server.kill();
  (global as any)._server = fork('bin/reverse_proxy.js', ['--address=localhost', '--target=80'], {stdio: 'inherit'});
  done();
});

/**
 * Runs the test suites.
 */
gulp.task('test', () => _exec('nyc', [normalize('node_modules/.bin/mocha')]));

/**
 * Upgrades the project to the latest revision.
 */
gulp.task('upgrade', async () => {
  await _exec('git', ['reset', '--hard']);
  await _exec('git', ['fetch', '--all', '--prune']);
  await _exec('git', ['pull', '--rebase']);
  await _exec('npm', ['install', '--ignore-scripts']);
  return _exec('npm', ['update', '--dev']);
});

/**
 * Updates the version number contained in the sources.
 */
gulp.task('version', () => gulp.src('src/application.ts')
  .pipe(replace(/readonly version: string = '\d+(\.\d+){2}'/g, `readonly version: string = '${pkg.version}'`))
  .pipe(gulp.dest('src'))
);

/**
 * Watches for file changes.
 */
gulp.task('watch', () => {
  gulp.watch('src/**/*.ts', {ignoreInitial: false}, gulp.task('build'));
  gulp.watch('test/**/*.ts', gulp.task('test'));
});

/**
 * Runs the default tasks.
 */
gulp.task('default', gulp.series('version', 'build'));

/**
 * Spawns a new process using the specified command.
 * @param command The command to run.
 * @param args The command arguments.
 * @param options The settings to customize how the process is spawned.
 * @return Completes when the command is finally terminated.
 */
function _exec(command: string, args: string[] = [], options: SpawnOptions = {}): Promise<void> {
  return new Promise((fulfill, reject) => spawn(normalize(command), args, Object.assign({shell: true, stdio: 'inherit'}, options))
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : fulfill())
  );
}
