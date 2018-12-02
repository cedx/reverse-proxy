part of '../cli.dart';

/// The parsed command line arguments.
@CliOptions()
class Options {

  /// Creates a new options object.
  Options({this.help, this.silent, this.version});

  /// Value indicating whether to output usage information.
  @CliOption(abbr: 'h', help: 'Output usage information.', negatable: false)
  final bool help;

  /// Value indicating whether to silence the log output.
  @CliOption(help: 'Silence the log output from the reverse proxy.', negatable: false)
  final bool silent;

  /// Value indicating whether to output the version number.
  @CliOption(abbr: 'v', help: 'Output the version number.', negatable: false)
  final bool version;
}
