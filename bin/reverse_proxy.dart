#!/usr/bin/env dart

import 'dart:io';
import 'dart:isolate';
import 'package:where/where.dart';

/// Application entry point.
Future<void> main(List<String> args) async {
  final executable = await where('node', onError: (command) => command);
  final packageUri = await Isolate.resolvePackageUri(Uri.parse('package:reverse_proxy/'));
  final script = packageUri.resolve('../bin/reverse_proxy.js').toFilePath();
  return Process.start(executable, [script]..addAll(args), mode: ProcessStartMode.inheritStdio);
}
