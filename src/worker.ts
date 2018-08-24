import cluster from 'cluster';
import {Server} from './server';

/**
 * Contains all public information and methods about a request worker.
 */
export class Worker {

  /**
   * The proxy servers managed by this worker.
   */
  private _servers: Server[] = [];

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'Worker';
  }

  /**
   * Stops the worker from accepting new connections.
   */
  stop(): Promise<void> {
    return Promise.all(this._servers.map(server => server.close()));
  }

  /**
   * Begins accepting connections.
   * @param {Object[]} servers The settings of the servers managed by this worker.
   * @return {Promise} Completes when all the servers are listening.
   */
  start(servers): Promise<void> {
    this._servers = servers.map(options => new Server(options));

    const console = Application.instance.logger;
    const id = cluster.worker.id;

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
   * @param authorization The value of the `Authorization` header.
   * @return The user name found, otherwise the string `"-"`.
   */
  _extractUserFromRequest(authorization: string | undefined): string {
    if (typeof authorization != 'string' || !authorization.length) return '-';

    try {
      const credentials = Buffer.from(authorization, 'base64').toString().split(':');
      return credentials.length ? credentials[0] : '-';
    }

    catch {
      return '-';
    }
  }
}
