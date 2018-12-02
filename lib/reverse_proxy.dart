/// Simple reverse proxy server supporting WebSockets.
library reverse_proxy;

import 'package:nodejs_interop/cluster.dart' as cluster;
import 'package:nodejs_interop/globals.dart';
import 'src/cli.dart';
import 'src/version.dart';

/// The usage information.
final String _usage = (StringBuffer()
  ..writeln('Simple reverse proxy server supporting WebSockets.')
  ..writeln()
  ..writeln('Usage: reverse_proxy [options]')
  ..writeln()
  ..writeln('Options:')
  ..write(argParser.usage))
  .toString();

/// Application entry point.
void main() {
  // Parse the command line arguments.
  Options options;

  try {
    options = parseOptions(process.argv.skip(2).cast<String>().toList());
    if (options.help) {
      print(_usage);
      return;
    }

    if (options.version) {
      print(packageVersion);
      return;
    }
  }

  on FormatException {
    print(_usage);
    process.exitCode = 64;
    return;
  }

  // Run the program.
  final id = cluster.isMaster ? 'master' : 'worker:${cluster.worker.id}';
  process.title = 'reverse_proxy/$id';
  print(process.title);
  // TODO(cedx): return Application().run();
}
