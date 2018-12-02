part of '../io.dart';

/// Acts as an intermediary for requests from clients seeking resources from other servers.
class Server extends EventEmitter {

  /// Creates a new reverse proxy.
  Server({String address, int port}): _address = address, _port = port {
    /*
    _address = address.length ? address : Server.defaultAddress;
    _port = port >= 0 && Number.isInteger(port) ? port : Server.defaultPort;
    _proxyOptions = proxy;
    _sslOptions = ssl;

    for (const [host, route] of Object.entries(routes)) routes.set(host.toLowerCase(), Route.from(route));
    if (target != undefined) routes.set('*', Route.from(target));
    */
  }

  /// The default address that the server is listening on.
  static const String defaultAddress = '0.0.0.0';

  /// The default port that the server is listening on.
  static const int defaultPort = 8080;

  /// An event that is emitted when the server closes.
  static const String eventClose = 'close';

  /// An event that is emitted when an error occurs.
  static const String eventError = 'error';

  /// An event that is emitted when the server has been bound.
  static const String eventListening = 'listening';

  /// An event that is emitted each time there is an HTTP request.
  static const String eventRequest = 'request';

  /// The routing table.
  final Map<String, Route> routes = <String, Route>{};

  /// The address that the server is listening on.
  final String _address;

  /// The underlying HTTP(S) service listening for requests.
  // _httpService: http.Server | https.Server | null = null;

  /// The port that the server is listening on.
  final int _port;

  /// The settings of the underlying proxy module.
  // readonly _proxyOptions?: httpProxy.ServerOptions;

  /// The underlying proxy service providing custom application logic.
  // _proxyService: httpProxy | null = null;

  /// The settings of the underlying SSL module.
  // readonly _sslOptions?: https.ServerOptions;

  /// The address that the server is listening on.
  //String get address => listening ? (_httpService!.address() as AddressInfo).address : _address;

  /// Value indicating whether the server is currently listening.
  //bool get listening => _httpService != null && _httpService.listening;

  /// The port that the server is listening on.
  //int get port => listening ? (_httpService!.address() as AddressInfo).port : _port;

  /// Stops the server from accepting new connections. It does nothing if the server is already closed.
  Future<void> close() async {
    /*
    return !listening ? Future.value() : new Promise(resolve => _httpService!.close(() => {
      _httpService = null;
      _proxyService = null;
      emit(Server.eventClose);
      resolve();
    }));*/
  }

  /// Begins accepting connections.
  ///
  /// It does nothing if the server is already started.
  /// Returns the port that the server is running on.
  Future<int> listen({int port, String address}) async {
    //address ??= this.address;
    //return port ??= this.port;
    return -1;

    /*
    return listening ? Promise.resolve(port) : new Promise((resolve, reject) => {
      _proxyService = httpProxy.createProxyServer(_proxyOptions);
      _proxyService.on('error', (err, req, res) => _onRequestError(err, req, res));

      const requestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => _onHttpRequest(req, res);
      _httpService = _sslOptions ? https.createServer(_sslOptions, requestHandler) : http.createServer(requestHandler);
      _httpService.on('upgrade', (req, socket, head) => _onWebSocketRequest(req, socket, head));
      _httpService.on('error', err => {
        emit(Server.eventError, err);
        if (err.code == 'EADDRINUSE') reject(err);
      });

      _httpService.listen(port, address, () => {
        emit(Server.eventListening);
        resolve(port);
      });
    });*/
  }

  /// Gets the hostname contained in the headers of the specified [request].
  /// Returns the string `"*"` if the hostname could not be determined.
  String _getHostname(dynamic request) {
    final host = request.headers.host;
    //if (typeof host == 'undefined') return '*';

    final index = host.indexOf(':');
    return index < 0 ? host : host.substr(0, index);
  }

  /**
   * Merges the HTTP headers of the specified route with the headers of the given request.
   * @param req The request sent by the client.
   * @param route The route activated by the request.
   * Returns the merged headers.
   */
  /*
  _mergeHeaders(req: http.IncomingMessage, route: Route): StringMap<string> {
    const _headers: StringMap<string> = {};
    for (const [key, value] of route.headers.entries()) _headers[key] = value;
    return Object.assign(req.headers, _headers);
  }*/

  /**
   * Handles an HTTP request to a target.
   * @param req The request sent by the client.
   * @param res The response sent by the server.
   */
  /*
  _onHttpRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    emit(Server.eventRequest, req, res);

    const hostname = _getHostname(req);
    const pattern = routes.has(hostname) ? hostname : '*';
    if (!routes.has(pattern)) _sendStatus(res, 404);
    else {
      const route = routes.get(pattern)!;
      _mergeHeaders(req, route);
      _proxyService!.web(req, res, {target: route.uri.href});
    }
  }*/

  /**
   * Handles the error emitted if a request to a target fails.
   * @param err The emitted error event.
   * @param req The request sent by the client.
   * @param res The response sent by the server.
   */
  /*
  _onRequestError(err: Error, req: http.IncomingMessage, res: http.ServerResponse): void {
    emit(Server.eventError, err);
    _sendStatus(res, 502);
  }*/

  /**
   * Handles a WebSocket request to a target.
   * @param req The request sent by the client.
   * @param socket The network socket between the server and client.
   * @param head The first packet of the upgraded stream.
   */
  /*
  _onWebSocketRequest(req: http.IncomingMessage, socket: Socket, head: Buffer): void {
    const hostname = _getHostname(req);
    const pattern = routes.has(hostname) ? hostname : '*';
    if (routes.has(pattern)) {
      const route = routes.get(pattern)!;
      _mergeHeaders(req, route);
      _proxyService!.ws(req, socket, head, {target: route.uri.href});
    }
  }*/

  /**
   * Sends an HTTP status code and terminates the specified server response.
   * @param res The server response.
   * @param statusCode The HTTP status code to send.
   */
  /*
  _sendStatus(res: http.ServerResponse, statusCode: number): void {
    const message = http.STATUS_CODES[statusCode]!;
    res.writeHead(statusCode, {
      'content-length': Buffer.byteLength(message),
      'content-type': 'text/plain; charset=utf-8'
    });

    res.end(message);
  }*/
}
