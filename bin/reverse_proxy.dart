#!/usr/bin/env dart

import 'package:reverse_proxy/src/cli.dart';
import 'package:reverse_proxy/src/version.dart';

/// The usage information.
final String usage = (StringBuffer()
  ..writeln('Simple reverse proxy server supporting WebSockets.')
  ..writeln()
  ..writeln('Usage: reverse-proxy [options]')
  ..writeln()
  ..writeln('Options:')
  ..write(argParser.usage))
  .toString();

/// Application entry point.
Future<void> main(List<String> args) async {
  // Parse the command line arguments.
  Options options;

  try {
    options = parseOptions(args);
    if (options.help) {
      print(usage);
      return;
    }

    if (options.version) {
      print(packageVersion);
      return;
    }
  }

  on FormatException {
    print(usage);
    // process.exitCode = 64;
    return;
  }

  // Run the program.
  print('Running the program...');

  /*
    const id = cluster.isMaster ? 'master' : `worker:${cluster.worker.id}`;
    process.title = `reverse-proxy/${id}`;
    return new Application().run();
   */
}
