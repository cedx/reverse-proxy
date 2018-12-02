// GENERATED CODE - DO NOT MODIFY BY HAND

part of reverse_proxy.cli;

// **************************************************************************
// CliGenerator
// **************************************************************************

Options _$parseOptionsResult(ArgResults result) => new Options(
    help: result['help'] as bool,
    silent: result['silent'] as bool,
    version: result['version'] as bool);

ArgParser _$populateOptionsParser(ArgParser parser) => parser
  ..addFlag('help',
      abbr: 'h', help: 'Output usage information.', negatable: false)
  ..addFlag('silent',
      help: 'Silence the log output from the reverse proxy.', negatable: false)
  ..addFlag('version',
      abbr: 'v', help: 'Output the version number.', negatable: false);

final _$parserForOptions = _$populateOptionsParser(new ArgParser());

Options parseOptions(List<String> args) {
  var result = _$parserForOptions.parse(args);
  return _$parseOptionsResult(result);
}
