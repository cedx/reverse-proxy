import { EventEmitter } from 'events';
import http from 'http';
import httpProxy from 'http-proxy';
import https from 'https';
import { Route } from './route.js';
/** Acts as an intermediary for requests from clients seeking resources from other servers. */
export class Server extends EventEmitter {
    /**
     * Creates a new reverse proxy.
     * @param {object} options An object specifying values used to initialize this instance.
     */
    constructor(options = {}) {
        super();
        /** The routing table. */
        this.routes = new Map();
        /** The underlying HTTP(S) service listening for requests. */
        this._httpService = null;
        /** The underlying proxy service providing custom application logic. */
        this._proxyService = null;
        const { address = '', port = -1, routes = {}, proxy, ssl, target } = options;
        this._address = address.length ? address : Server.defaultAddress;
        this._port = Number.isInteger(port) && port >= 0 ? port : Server.defaultPort;
        this._proxyOptions = proxy;
        this._sslOptions = ssl;
        for (const [host, route] of Object.entries(routes))
            this.routes.set(host.toLowerCase(), Route.from(route));
        if (target)
            this.routes.set('*', Route.from(target));
    }
    /** The address that the server is listening on. */
    get address() {
        return this.listening ? this._httpService.address().address : this._address;
    }
    /** Value indicating whether the server is currently listening. */
    get listening() {
        return this._httpService != null && this._httpService.listening;
    }
    /** The port that the server is listening on. */
    get port() {
        return this.listening ? this._httpService.address().port : this._port;
    }
    /**
     * Stops the server from accepting new connections. It does nothing if the server is already closed.
     * @return Completes when the server is finally closed.
     */
    close() {
        return !this.listening ? Promise.resolve() : new Promise(resolve => this._httpService.close(() => {
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
    listen(port = this.port, address = this.address) {
        return this.listening ? Promise.resolve(this.port) : new Promise((resolve, reject) => {
            this._proxyService = httpProxy.createProxyServer(this._proxyOptions);
            this._proxyService.on('error', (err, req, res) => this._onRequestError(err, req, res));
            const requestHandler = (req, res) => this._onHttpRequest(req, res);
            this._httpService = this._sslOptions ? https.createServer(this._sslOptions, requestHandler) : http.createServer(requestHandler);
            this._httpService.on('upgrade', (req, socket, head) => this._onWebSocketRequest(req, socket, head));
            this._httpService.on('error', err => {
                this.emit(Server.eventError, err);
                if (err.code == 'EADDRINUSE')
                    reject(err);
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
    _getHostname(req) {
        const host = req.headers.host;
        if (!host)
            return '*';
        const index = host.indexOf(':');
        return index < 0 ? host : host.slice(0, index);
    }
    /**
     * Merges the HTTP headers of the specified route with the headers of the given request.
     * @param req The request sent by the client.
     * @param route The route activated by the request.
     * @return The merged headers.
     */
    _mergeHeaders(req, route) {
        const _headers = {};
        for (const [key, value] of route.headers.entries())
            _headers[key] = value;
        return { ...req.headers, ..._headers };
    }
    /**
     * Handles an HTTP request to a target.
     * @param req The request sent by the client.
     * @param res The response sent by the server.
     */
    _onHttpRequest(req, res) {
        this.emit(Server.eventRequest, req, res);
        const hostname = this._getHostname(req);
        const pattern = this.routes.has(hostname) ? hostname : '*';
        if (!this.routes.has(pattern))
            this._sendStatus(res, 404);
        else {
            const route = this.routes.get(pattern);
            this._mergeHeaders(req, route);
            this._proxyService.web(req, res, { target: route.uri.href });
        }
    }
    /**
     * Handles the error emitted if a request to a target fails.
     * @param err The emitted error event.
     * @param req The request sent by the client.
     * @param res The response sent by the server.
     */
    _onRequestError(err, req, res) {
        this.emit(Server.eventError, err);
        this._sendStatus(res, 502);
    }
    /**
     * Handles a WebSocket request to a target.
     * @param req The request sent by the client.
     * @param socket The network socket between the server and client.
     * @param head The first packet of the upgraded stream.
     */
    _onWebSocketRequest(req, socket, head) {
        const hostname = this._getHostname(req);
        const pattern = this.routes.has(hostname) ? hostname : '*';
        if (this.routes.has(pattern)) {
            const route = this.routes.get(pattern);
            this._mergeHeaders(req, route);
            this._proxyService.ws(req, socket, head, { target: route.uri.href });
        }
    }
    /**
     * Sends an HTTP status code and terminates the specified server response.
     * @param res The server response.
     * @param statusCode The HTTP status code to send.
     */
    _sendStatus(res, statusCode) {
        const message = http.STATUS_CODES[statusCode];
        res.writeHead(statusCode, {
            'content-length': Buffer.byteLength(message),
            'content-type': 'text/plain; charset=utf-8'
        });
        res.end(message);
    }
}
/** The default address that the server is listening on. */
Server.defaultAddress = '0.0.0.0';
/** The default port that the server is listening on. */
Server.defaultPort = 8080;
/**
 * An event that is emitted when the server closes.
 * @event close
 */
Server.eventClose = 'close';
/**
 * An event that is emitted when an error occurs.
 * @event error
 */
Server.eventError = 'error';
/**
 * An event that is emitted when the server has been bound.
 * @event listening
 */
Server.eventListening = 'listening';
/**
 * An event that is emitted each time there is an HTTP request.
 * @event request
 */
Server.eventRequest = 'request';
