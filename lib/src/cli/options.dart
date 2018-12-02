part of '../cli.dart';

/// The parsed command line arguments.
@CliOptions()
class Options {

  /// Creates a new options object.
  Options({this.address, this.help, this.port, this.silent, this.version, this.workers});

  /// The address that the reverse proxy should run on.
  @CliOption(abbr: 'a', help: 'Address that the reverse proxy should run on.', defaultsTo: Server.defaultAddress)
  final String address;

  /// Value indicating whether to output usage information.
  @CliOption(abbr: 'h', help: 'Output usage information.', negatable: false)
  final bool help;

  /// The port that the reverse proxy should run on.
  @CliOption(abbr: 'p', help: 'Port that the reverse proxy should run on.', defaultsTo: Server.defaultPort)
  final int port;

  /// Value indicating whether to silence the log output.
  @CliOption(help: 'Silence the log output from the reverse proxy.', negatable: false)
  final bool silent;

  /// Value indicating whether to output the version number.
  @CliOption(abbr: 'v', help: 'Output the version number.', negatable: false)
  final bool version;

  /// The number of workers processing requests.
  @CliOption(abbr: 'w', help: 'Number of workers processing requests.', defaultsTo: 0)
  final int workers;
}
