import 'dart:io';
import 'package:grinder/grinder.dart';
import 'package:nodejs_interop/build.dart';
import 'package:reverse_proxy/src/version.dart';

/// The current environment.
final String _environment = Platform.environment['NODE_ENV'] ?? const String.fromEnvironment('env', defaultValue: 'development');

/// Starts the build system.
Future<void> main(List<String> args) => grind(args);

@DefaultTask('Builds the project')
Future<void> build() async {
  final debug = _environment == 'development' || _environment == 'test';
  final output = joinFile(binDir, ['reverse_proxy.js']);

  Pub.run('build_runner', arguments: ['build', '--delete-conflicting-outputs']);
  Dart2js.compile(joinFile(libDir, ['reverse_proxy.dart']), minify: !debug, outFile: output);
  await output.writeAsString('${getPreamble(minified: !debug, shebang: true)}\n${await output.readAsString()}');
  if (!Platform.isWindows) run('chmod', arguments: ['+x', output.path]);
}

@Task('Deletes all generated files and reset any saved state')
void clean() {
  defaultClean();
  ['.dart_tool/build', 'doc/api', webDir.path].map(getDir).forEach(delete);
  FileSet.fromDir(binDir, pattern: 'reverse_proxy.js*').files.forEach(delete);
  FileSet.fromDir(getDir('var'), pattern: '!.*', recurse: true).files.forEach(delete);
}

@Task('Uploads the results of the code coverage')
void coverage() => Pub.run('coveralls', arguments: ['var/lcov.info']);

@Task('Builds the documentation')
Future<void> doc() async {
  await getFile('CHANGELOG.md').copy('doc/about/changelog.md');
  await getFile('LICENSE.md').copy('doc/about/license.md');
  DartDoc.doc();
  run('mkdocs', arguments: ['build']);
}

@Task('Fixes the coding standards issues')
void fix() => DartFmt.format(existingSourceDirs, lineLength: 200);

@Task('Performs the static analysis of source code')
void lint() => Analyzer.analyze(existingSourceDirs);

@Task('Runs the test suites')
void test() => TestRunner().test(platformSelector: 'node');

@Task('Upgrades the project to the latest revision')
void upgrade() {
  run('git', arguments: ['reset', '--hard']);
  run('git', arguments: ['fetch', '--all', '--prune']);
  run('git', arguments: ['pull', '--rebase']);
  run('npm', arguments: ['install']);
  run('npm', arguments: ['update']);
  Pub.upgrade();
}

@Task('Updates the version number contained in the sources')
Future<void> version() async {
  final file = getFile('package.json');
  return file.writeAsString((await file.readAsString()).replaceAll(
    RegExp(r'"version": "10(\.\d+){2}"'),
    '"version": "10.${packageVersion.split('.').skip(1).join('.')}"'
  ));
}

@Task('Watches for file changes')
void watch() => Pub.run('build_runner', arguments: ['watch', '--delete-conflicting-outputs']);
