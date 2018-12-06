/// Provides the I/O support.
library reverse_proxy.io;

import 'dart:async';
import 'dart:js_util';
import 'package:nodejs_interop/cluster.dart' as cluster;
import 'package:nodejs_interop/console.dart';
import 'package:nodejs_interop/events.dart';
import 'package:nodejs_interop/nodejs.dart';
import 'package:nodejs_interop/os.dart' as os;

part 'io/application.dart';
part 'io/route.dart';
part 'io/server.dart';
part 'io/worker.dart';

/// The application singleton.
Application _app;
