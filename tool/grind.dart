import 'dart:io';
import 'package:grinder/grinder.dart';
import 'package:nodejs_interop/build.dart';
import 'package:reverse_proxy/src/version.dart';

/// The current environment.
final String _environment = Platform.environment['DART_ENV'] ?? const String.fromEnvironment('env', defaultValue: 'development');

/// Starts the build system.
Future<void> main(List<String> args) => grind(args);

@DefaultTask('Builds the project')
@Depends(js)
Future<void> build() async {
  final file = getFile('package.json');
  return file.writeAsString((await file.readAsString()).replaceAll(
    RegExp(r'"version": "10(\.\d+){2}"'),
    '"version": "10.${packageVersion.split('.').take(2).join('.')}"'
  ));
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

@Task('Builds the JavaScript sources')
Future<void> js() async {
  final debug = _environment == 'development' || _environment == 'test';
  final outFile = joinFile(binDir, ['reverse_proxy.js']);

  Pub.run('build_runner', arguments: ['build', '--delete-conflicting-outputs']);
  Dart2js.compile(joinFile(libDir, ['reverse_proxy.dart']), extraArgs: debug ? ['-O1'] : ['-O4'], outFile: outFile);
  return addPreamble(outFile, executable: true, minified: !debug, shebang: true);
}

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

@Task('Watches for file changes')
void watch() => Pub.run('build_runner', arguments: ['watch', '--delete-conflicting-outputs']);
