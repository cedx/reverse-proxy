const cluster = require('cluster');
const {Server} = require('./server.js');

/**
 * Contains all public information and methods about a request worker.
 */
class Worker {

  /**
   * Creates a new worker.
   */
  constructor() {

    /**
     * The proxy servers managed by this worker.
     * @type {Server[]}
     */
    this._servers = [];
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Worker';
  }

  /**
   * Stops the worker from accepting new connections.
   * @return {Promise} Completes when all the servers are closed.
   */
  stop() {
    return Promise.all(this._servers.map(server => server.close()));
  }

  /**
   * Begins accepting connections.
   * @param {Object[]} servers The settings of the servers managed by this worker.
   * @return {Promise} Completes when all the servers are listening.
   */
  start(servers) {
    this._servers = servers.map(options => new Server(options));

    let console = Application.instance.logger;
    let id = cluster.worker.id;

    return Promise.all(this._servers.map(server => server
      .on('close', () => console.log(`#${id}: ${server.address}:${server.port} closed`))
      .on('error', err => console.error(`#${id}: ${Application.instance.debug ? err : err.message}`))
      .on('listening', () => console.log(`#${id}: listening on ${server.address}:${server.port}`))
      .on('request', (request, response) => console.log(`#${id}: ` + Application.logFormat
        .replace(':date[iso]', new Date().toISOString())
        .replace(':http-version', request.httpVersion)
        .replace(':method', request.method)
        .replace(':referrer', 'referer' in request.headers ? request.headers.referer : ('referrer' in request.headers ? request.headers.referrer : '-'))
        .replace(':remote-addr', 'ip' in request ? request.ip : request.socket.remoteAddress)
        .replace(':remote-user', this._extractUserFromRequest(request.headers.authorization))
        .replace(':req[host]', 'host' in request.headers ? request.headers.host : '-')
        .replace(':res[content-length]', 'content-length' in response.headers ? response.headers['content-length'] : '-')
        .replace(':status', response.statusCode)
        .replace(':user-agent', 'user-agent' in request.headers ? request.headers['user-agent'] : '-')
        .replace(':url', 'originalUrl' in request ? request.originalUrl : request.url)
      ))
      .listen()
    ));
  }

  /**
   * Extracts the user name provided in the specified `Authorization` header.
   * @param {string} authorization The value of the `Authorization` header.
   * @return {string} The user name found, otherwise the string `"-"`.
   */
  _extractUserFromRequest(authorization) {
    if (typeof authorization != 'string' || !authorization.length) return '-';

    try {
      let credentials = Buffer.from(authorization, 'base64').toString().split(':');
      return credentials.length ? credentials[0] : '-';
    }

    catch (err) {
      return '-';
    }
  }
}

// Module exports.
exports.Worker = Worker;
