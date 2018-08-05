const EventEmitter = require('events');
const http = require('http');
const https = require('https');
const {createProxyServer} = require('http-proxy');

/**
 * Acts as an intermediary for requests from clients seeking resources from other servers.
 */
class Server extends EventEmitter {

  /**
   * The default address that the server is listening on.
   * @type {string}
   */
  static get defaultAddress() {
    return '0.0.0.0';
  }

  /**
   * The default port that the server is listening on.
   * @type {number}
   */
  static get defaultPort() {
    return 8080;
  }

  /**
   * Initializes a new instance of the class.
   * @param {Object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {
    super();

    /**
     * The routing table.
     * @type {Map}
     */
    this.routes = new Map;

    if (typeof options.routes == 'object' && options.routes)
      for (let [host, route] of Object.entries(options.routes)) this.routes.set(host, this._normalizeRoute(route));

    if (typeof options.target == 'string')
      this.routes.set('*', this._normalizeRoute(options.target));

    /**
     * The underlying HTTP(S) service listening for requests.
     * @type {http~Server|https~Server}
     */
    this._httpService = null;

    /**
     * The server settings.
     * @type {Object}
     */
    this._options = {
      address: typeof options.address == 'string' ? options.address : Server.defaultAddress,
      port: Number.isInteger(options.port) ? Math.max(0, options.port) : Server.defaultPort,
      proxy: typeof options.proxy == 'object' && options.proxy ? options.proxy : null,
      ssl: typeof options.ssl == 'object' && options.ssl ? options.ssl : null
    };

    /**
     * The underlying proxy service providing custom application logic.
     * @type {ProxyServer}
     */
    this._proxyService = null;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Server';
  }

  /**
   * The address that the server is listening on.
   * @type {string}
   */
  get address() {
    return this.listening ? this._httpService.address().address : this._options.address;
  }

  /**
   * Value indicating whether the server is currently listening.
   * @type {boolean}
   */
  get listening() {
    return Boolean(this._httpService && this._httpService.listening);
  }

  /**
   * The port that the server is listening on.
   * @type {number}
   */
  get port() {
    return this.listening ? this._httpService.address().port : this._options.port;
  }

  /**
   * Stops the server from accepting new connections. It does nothing if the server is already closed.
   * @return {Promise} Completes when the server is finally closed.
   * @emits {*} The "close" event.
   */
  async close() {
    return !this.listening ? null : new Promise(resolve => this._httpService.close(() => {
      this._httpService = null;
      this._proxyService = null;
      this.emit('close');
      resolve(null);
    }));
  }

  /**
   * Begins accepting connections. It does nothing if the server is already started.
   * @param {number} [port] The port that the server should run on.
   * @param {string} [address] The address that the server should run on.
   * @return {Promise<number>} The port that the server is running on.
   * @emits {*} The "listening" event.
   */
  async listen(port = this.port, address = this.address) {
    return this.listening ? this.port : new Promise((resolve, reject) => {
      this._proxyService = createProxyServer(this._options.proxy);
      this._proxyService.on('error', this._onRequestError.bind(this));

      let requestHandler = this._onHttpRequest.bind(this);
      this._httpService = this._options.ssl ? https.createServer(this._options.ssl, requestHandler) : http.createServer(requestHandler);
      this._httpService.on('upgrade', this._onWebSocketRequest.bind(this));
      this._httpService.on('error', err => {
        this.emit('error', err);
        if (err.code == 'EADDRINUSE') reject(err);
      });

      this._httpService.listen(port, address, () => {
        this.emit('listening');
        resolve(this.port);
      });
    });
  }

  /**
   * Gets the hostname contained in the headers of the specified request.
   * @param {IncomingMessage} req The request sent by the client.
   * @return {string} The hostname provided by the specified request, or `*` if the hostname could not be determined.
   */
  _getHostname(req) {
    let headers = req.headers;
    if (!('host' in headers)) return '*';

    let index = headers.host.indexOf(':');
    return index < 0 ? headers.host : headers.host.substr(0, index);
  }

  /**
   * Normalizes the specified route.
   * @param {*} route The route to normalize.
   * @return {Object} The normalized route.
   * @throws {TypeError} The route has an invalid format.
   */
  _normalizeRoute(route) {
    if (typeof route != 'object' || !route) route = {uri: route};

    switch (typeof route.uri) {
      case 'number':
        route.uri = `http://127.0.0.1:${route.uri}`;
        break;

      case 'string':
        if (!/^https?:/i.test(route.uri)) route.uri = `http://${route.uri}`;
        break;

      default:
        throw new TypeError('The route has an invalid format.');
    }

    if (typeof route.headers != 'object' || !route.headers) route.headers = {};
    else {
      let map = {};
      for (let [key, value] of Object.entries(route.headers)) map[key.toLowerCase()] = value;
      route.headers = map;
    }

    return route;
  }

  /**
   * Handles an HTTP request to a target.
   * @param {IncomingMessage} req The request sent by the client.
   * @param {ServerResponse} res The response sent by the server.
   * @emits {IncomingMessage} The "request" event.
   */
  _onHttpRequest(req, res) {
    this.emit('request', req, res);

    let hostname = this._getHostname(req);
    let pattern = this.routes.has(hostname) ? hostname : '*';
    if (!this.routes.has(pattern)) this._sendStatus(res, 404);
    else {
      let target = this.routes.get(pattern);
      Object.assign(req.headers, target.headers);
      this._proxyService.web(req, res, {target: target.uri});
    }
  }

  /**
   * Handles the error emitted if a request to a target fails.
   * @param {Error} err The emitted error event.
   * @param {IncomingMessage} req The request sent by the client.
   * @param {ServerResponse} res The response sent by the server.
   * @emits {Error} The "error" event.
   */
  _onRequestError(err, req, res) {
    this.emit('error', err);
    this._sendStatus(res, 502);
  }

  /**
   * Handles a WebSocket request to a target.
   * @param {IncomingMessage} req The request sent by the client.
   * @param {Socket} socket The network socket between the server and client.
   * @param {Buffer} head The first packet of the upgraded stream.
   */
  _onWebSocketRequest(req, socket, head) {
    let hostname = this._getHostname(req);
    let pattern = this.routes.has(hostname) ? hostname : '*';
    if (this.routes.has(pattern)) {
      let target = this.routes.get(pattern);
      Object.assign(req.headers, target.headers);
      this._proxyService.ws(req, socket, head, {target: target.uri});
    }
  }

  /**
   * Sends an HTTP status code and terminates the specified server response.
   * @param {ServerResponse} res The server response.
   * @param {number} statusCode The HTTP status code to send.
   */
  _sendStatus(res, statusCode) {
    let message = http.STATUS_CODES[statusCode];
    res.writeHead(statusCode, {
      'content-length': Buffer.byteLength(message),
      'content-type': 'text/plain; charset=utf-8'
    });

    res.end(message);
  }
}

// Module exports.
exports.Server = Server;
