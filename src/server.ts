import {EventEmitter} from 'events';
import * as http from 'http';
import * as httpProxy from 'http-proxy';
import * as https from 'https';

import {AddressInfo, Socket} from 'net';
import {JsonMap, StringMap} from './map';
import {Route} from './route';

/**
 * Acts as an intermediary for requests from clients seeking resources from other servers.
 */
export class Server extends EventEmitter {

  /**
   * The default address that the server is listening on.
   */
  static readonly defaultAddress: string = '0.0.0.0';

  /**
   * The default port that the server is listening on.
   */
  static readonly defaultPort: number = 8080;

  /**
   * TODO Emitted...
   * An event that is triggered when
   * @event close
   */
  static readonly eventClose: string = 'close';

  /**
   * TODO Emitted...
   * An event that is triggered when
   * @event error
   */
  static readonly eventError: string = 'error';

  /**
   * TODO Emitted...
   * An event that is triggered when
   * @event listening
   */
  static readonly eventListening: string = 'listening';

  /**
   * TODO Emitted...
   * An event that is triggered when
   * @event request
   */
  static readonly eventRequest: string = 'request';

  /**
   * The routing table.
   */
  routes = new Map<string, Route>();

  /**
   * The underlying HTTP(S) service listening for requests.
   */
  private _httpService: http.Server | https.Server | null = null;

  /**
   * The server settings.
   */
  private _options: ServerOptions;

  /**
   * The underlying proxy service providing custom application logic.
   */
  private _proxyService: httpProxy | null = null;

  /**
   * Initializes a new instance of the class.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(options: Partial<ServerOptions> = {}) {
    super();

    if (typeof options.routes == 'object' && options.routes)
      for (const [host, route] of Object.entries(options.routes)) this.routes.set(host, this._normalizeRoute(route));

    if (typeof options.target == 'string')
      this.routes.set('*', this._normalizeRoute(options.target));

    this._options = {
      address: typeof options.address == 'string' ? options.address : Server.defaultAddress,
      port: Number.isInteger(options.port) ? Math.max(0, options.port) : Server.defaultPort,
      proxy: typeof options.proxy == 'object' && options.proxy ? options.proxy : null,
      ssl: typeof options.ssl == 'object' && options.ssl ? options.ssl : null
    };
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'Server';
  }

  /**
   * The address that the server is listening on.
   */
  get address(): string {
    return this.listening ? (this._httpService!.address() as AddressInfo).address : this._options.address;
  }

  /**
   * Value indicating whether the server is currently listening.
   */
  get listening(): boolean {
    return this._httpService != null && this._httpService.listening;
  }

  /**
   * The port that the server is listening on.
   */
  get port(): number {
    return this.listening ? (this._httpService!.address() as AddressInfo).port : this._options.port;
  }

  /**
   * Stops the server from accepting new connections. It does nothing if the server is already closed.
   * @return Completes when the server is finally closed.
   */
  close(): Promise<void> {
    return !this.listening ? Promise.resolve() : new Promise(resolve => this._httpService!.close(() => {
      this._httpService = null;
      this._proxyService = null;
      this.emit(Server.eventClose);
      resolve();
    }));
  }

  /**
   * Begins accepting connections. It does nothing if the server is already started.
   * @param port The port that the server should run on.
   * @param address The address that the server should run on.
   * @return The port that the server is running on.
   */
  listen(port: number = this.port, address: string = this.address): Promise<number> {
    return this.listening ? Promise.resolve(this.port) : new Promise((resolve, reject) => {
      this._proxyService = httpProxy.createProxyServer(this._options.proxy);
      this._proxyService.on('error', this._onRequestError.bind(this));

      const requestHandler = this._onHttpRequest.bind(this);
      this._httpService = this._options.ssl ? https.createServer(this._options.ssl, requestHandler) : http.createServer(requestHandler);
      this._httpService.on('upgrade', this._onWebSocketRequest.bind(this));
      this._httpService.on('error', err => {
        this.emit(Server.eventError, err);
        if (err.code == 'EADDRINUSE') reject(err);
      });

      this._httpService.listen(port, address, () => {
        this.emit(Server.eventListening);
        resolve(this.port);
      });
    });
  }

  /**
   * Gets the hostname contained in the headers of the specified request.
   * @param req The request sent by the client.
   * @return The hostname provided by the specified request, or `*` if the hostname could not be determined.
   */
  private _getHostname(req: http.IncomingMessage): string {
    const host = req.headers.host;
    if (host == undefined) return '*';

    const index = host.indexOf(':');
    return index < 0 ? host : host.substr(0, index);
  }

  /**
   * Normalizes the specified route.
   * @param route The route to normalize.
   * @return The normalized route.
   * @throws The route has an invalid format.
   */
  private _normalizeRoute(route: number | string | JsonMap): JsonMap /* TODO: Route interface */ {
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
      const map: StringMap = {};
      for (const [key, value] of Object.entries(route.headers)) map[key.toLowerCase()] = value;
      route.headers = map;
    }

    return route;
  }

  /**
   * Handles an HTTP request to a target.
   * @param req The request sent by the client.
   * @param res The response sent by the server.
   */
  private _onHttpRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    this.emit(Server.eventRequest, req, res);

    const hostname = this._getHostname(req);
    const pattern = this.routes.has(hostname) ? hostname : '*';
    if (!this.routes.has(pattern)) this._sendStatus(res, 404);
    else {
      const target = this.routes.get(pattern);
      Object.assign(req.headers, target.headers);
      this._proxyService!.web(req, res, {target: target.uri});
    }
  }

  /**
   * Handles the error emitted if a request to a target fails.
   * @param err The emitted error event.
   * @param req The request sent by the client.
   * @param res The response sent by the server.
   */
  private _onRequestError(err: Error, req: http.IncomingMessage, res: http.ServerResponse): void {
    this.emit(Server.eventError, err);
    this._sendStatus(res, 502);
  }

  /**
   * Handles a WebSocket request to a target.
   * @param req The request sent by the client.
   * @param socket The network socket between the server and client.
   * @param head The first packet of the upgraded stream.
   */
  private _onWebSocketRequest(req: http.IncomingMessage, socket: Socket, head: Buffer): void {
    const hostname = this._getHostname(req);
    const pattern = this.routes.has(hostname) ? hostname : '*';
    if (this.routes.has(pattern)) {
      const target = this.routes.get(pattern);
      Object.assign(req.headers, target.headers);
      this._proxyService!.ws(req, socket, head, {target: target.uri});
    }
  }

  /**
   * Sends an HTTP status code and terminates the specified server response.
   * @param res The server response.
   * @param statusCode The HTTP status code to send.
   */
  private _sendStatus(res: http.ServerResponse, statusCode: number): void {
    const message = http.STATUS_CODES[statusCode] as string;
    res.writeHead(statusCode, {
      'content-length': Buffer.byteLength(message),
      'content-type': 'text/plain; charset=utf-8'
    });

    res.end(message);
  }
}

/**
 * Defines the options of a `Server` instance.
 */
export interface ServerOptions {

  /**
   * The address that the server is listening on.
   */
  address: string;

  /**
   * The port that the server is listening on.
   */
  port: number;

  /**
   * The settings of the underlying proxy module.
   */
  proxy: httpProxy.ServerOptions | undefined;

  /**
   * The settings of the underlying SSL module.
   */
  ssl: JsonMap | undefined;
}
