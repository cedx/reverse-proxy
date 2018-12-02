// GENERATED CODE - DO NOT MODIFY BY HAND

part of reverse_proxy.cli;

// **************************************************************************
// CliGenerator
// **************************************************************************

T _$badNumberFormat<T extends num>(
        String source, String type, String argName) =>
    throw new FormatException(
        'Cannot parse "$source" into `$type` for option "$argName".');

Options _$parseOptionsResult(ArgResults result) => new Options(
    address: result['address'] as String,
    help: result['help'] as bool,
    port: int.tryParse(result['port'] as String) ??
        _$badNumberFormat(result['port'] as String, 'int', 'port'),
    silent: result['silent'] as bool,
    version: result['version'] as bool,
    workers: int.tryParse(result['workers'] as String) ??
        _$badNumberFormat(result['workers'] as String, 'int', 'workers'));

ArgParser _$populateOptionsParser(ArgParser parser) => parser
  ..addOption('address',
      abbr: 'a',
      help: 'Address that the reverse proxy should run on.',
      defaultsTo: '0.0.0.0')
  ..addFlag('help',
      abbr: 'h', help: 'Output usage information.', negatable: false)
  ..addOption('port',
      abbr: 'p',
      help: 'Port that the reverse proxy should run on.',
      defaultsTo: '8080')
  ..addFlag('silent',
      help: 'Silence the log output from the reverse proxy.', negatable: false)
  ..addFlag('version',
      abbr: 'v', help: 'Output the version number.', negatable: false)
  ..addOption('workers',
      abbr: 'w',
      help: 'Number of workers processing requests.',
      defaultsTo: '0');

final _$parserForOptions = _$populateOptionsParser(new ArgParser());

Options parseOptions(List<String> args) {
  var result = _$parserForOptions.parse(args);
  return _$parseOptionsResult(result);
}
