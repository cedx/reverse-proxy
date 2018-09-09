import {EventEmitter} from 'events';
import * as http from 'http';
import * as httpProxy from 'http-proxy';
import * as https from 'https';
import {AddressInfo, Socket} from 'net';

import {StringMap} from './map';
import {Route, Target} from './route';

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
   * An event that is emitted when the server closes.
   * @event close
   */
  static readonly eventClose: string = 'close';

  /**
   * An event that is emitted when an error occurs.
   * @event error
   */
  static readonly eventError: string = 'error';

  /**
   * An event that is emitted when the server has been bound.
   * @event listening
   */
  static readonly eventListening: string = 'listening';

  /**
   * An event that is emitted each time there is an HTTP request.
   * @event request
   */
  static readonly eventRequest: string = 'request';

  /**
   * The routing table.
   */
  readonly routes = new Map<string, Route>();

  /**
   * The address that the server is listening on.
   */
  private readonly _address: string;

  /**
   * The underlying HTTP(S) service listening for requests.
   */
  private _httpService: http.Server | https.Server | null = null;

  /**
   * The port that the server is listening on.
   */
  private readonly _port: number;

  /**
   * The settings of the underlying proxy module.
   */
  private readonly _proxyOptions?: httpProxy.ServerOptions;

  /**
   * The underlying proxy service providing custom application logic.
   */
  private _proxyService: httpProxy | null = null;

  /**
   * The settings of the underlying SSL module.
   */
  private readonly _sslOptions?: https.ServerOptions;

  /**
   * Creates a new reverse proxy.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(options: Partial<ServerOptions> = {}) {
    super();
    const {address = '', port = -1, routes = {}, proxy, ssl, target} = options;

    this._address = address.length ? address : Server.defaultAddress;
    this._port = port >= 0 && Number.isInteger(port) ? port : Server.defaultPort;
    this._proxyOptions = proxy;
    this._sslOptions = ssl;

    for (const [host, route] of Object.entries(routes)) this.routes.set(host.toLowerCase(), Route.from(route));
    if (target != undefined) this.routes.set('*', Route.from(target));
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
    return this.listening ? (this._httpService!.address() as AddressInfo).address : this._address;
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
    return this.listening ? (this._httpService!.address() as AddressInfo).port : this._port;
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
      this._proxyService = httpProxy.createProxyServer(this._proxyOptions);
      this._proxyService.on('error', (err, req, res) => this._onRequestError(err, req, res));

      const requestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => this._onHttpRequest(req, res);
      this._httpService = this._sslOptions ? https.createServer(this._sslOptions, requestHandler) : http.createServer(requestHandler);
      this._httpService.on('upgrade', (req, socket, head) => this._onWebSocketRequest(req, socket, head));
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
    if (typeof host == 'undefined') return '*';

    const index = host.indexOf(':');
    return index < 0 ? host : host.substr(0, index);
  }

  /**
   * Merges the HTTP headers of the specified route with the headers of the given request.
   * @param req The request sent by the client.
   * @param route The route activated by the request.
   * @return The merged headers.
   */
  private _mergeHeaders(req: http.IncomingMessage, route: Route): StringMap<string> {
    const _headers: StringMap<string> = {};
    for (const [key, value] of route.headers.entries()) _headers[key] = value;
    return Object.assign(req.headers, _headers);
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
      const route = this.routes.get(pattern)!;
      this._mergeHeaders(req, route);
      this._proxyService!.web(req, res, {target: route.uri.href});
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
      const route = this.routes.get(pattern)!;
      this._mergeHeaders(req, route);
      this._proxyService!.ws(req, socket, head, {target: route.uri.href});
    }
  }

  /**
   * Sends an HTTP status code and terminates the specified server response.
   * @param res The server response.
   * @param statusCode The HTTP status code to send.
   */
  private _sendStatus(res: http.ServerResponse, statusCode: number): void {
    const message = http.STATUS_CODES[statusCode]!;
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
  proxy: httpProxy.ServerOptions;

  /**
   * The route table.
   */
  routes: StringMap<number | string | Target>;

  /**
   * The settings of the underlying SSL module.
   */
  ssl: https.ServerOptions;

  /**
   * The default target server.
   */
  target: number | string | Target;
}
