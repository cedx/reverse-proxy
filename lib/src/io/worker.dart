part of '../io.dart';

/// Contains all public information and methods about a request worker.
class Worker {

  /// The proxy servers managed by this worker.
  final List<Server> _servers = [];

  /// Stops the worker from accepting new connections.
  /// Completes when all the servers managed by this worker are finally closed.
  //Future<void> stop() => asFuture<void>(Promise.all(_servers.map((server) => server.close())));

  /**
   * Starts the specified [servers] and begins accepting connections.
   * @param servers The settings of the servers managed by this worker.
   * Returns Returns the ports that the servers managed by this worker are running on.
   */

  /*
  start(servers: Array<Partial<ServerOptions>> = []): Promise<number[]> {
    _servers = servers.map(options => new Server(options));

    final id = cluster.worker.id;
    final logger = _app.logger;

    return Promise.all(_servers.map(server => server
      .on('close', () => logger.log(`#${id}: ${server.address}:${server.port} closed`))
      .on('error', err => logger.error(`#${id}: ${_app.debug ? err : err.message}`))
      .on('listening', () => logger.log(`#${id}: listening on ${server.address}:${server.port}`))
      .on('request', (req, res) => logger.log(`#${id}: ` + Application.logFormat
        .replace(':date[iso]', new Date().toISOString())
        .replace(':http-version', req.httpVersion)
        .replace(':method', req.method)
        .replace(':referrer', 'referer' in req.headers ? req.headers.referer : ('referrer' in req.headers ? req.headers.referrer : '-'))
        .replace(':remote-addr', 'ip' in req ? req.ip : req.socket.remoteAddress)
        .replace(':remote-user', _extractUserFromRequest(req.headers.authorization))
        .replace(':req[host]', 'host' in req.headers ? req.headers.host : '-')
        .replace(':res[content-length]', 'content-length' in res.headers ? res.headers['content-length'] : '-')
        .replace(':status', res.statusCode)
        .replace(':user-agent', 'user-agent' in req.headers ? req.headers['user-agent'] : '-')
        .replace(':url', 'originalUrl' in req ? req.originalUrl : req.url)
      ))
      .listen()
    ));
  }*/

  /// Extracts the user name provided in the specified `Authorization` header.
  /// Returns the string `"-"` if the user name is not found.
  String _extractUserFromRequest(String authorization) {
    if (authorization == null || authorization.isEmpty) return '-';

    try {
      final credentials = Buffer.from(authorization, BufferEncoding.base64).toString().split(':');
      return credentials.isNotEmpty ? credentials.first : '-';
    }

    on Exception {
      return '-';
    }
  }
}
