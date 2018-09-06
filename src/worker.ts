import * as cluster from 'cluster';
import {Application} from './application';
import {Server, ServerOptions} from './server';

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
   * @return Completes when all the servers managed by this worker are finally closed.
   */
  stop(): Promise<void[]> {
    return Promise.all(this._servers.map(server => server.close()));
  }

  /**
   * Begins accepting connections.
   * @param servers The settings of the servers managed by this worker.
   * @return The ports that the servers managed by this worker are running on.
   */
  start(servers: Array<Partial<ServerOptions>> = []): Promise<number[]> {
    this._servers = servers.map(options => new Server(options));

    const id = cluster.worker.id;
    const logger = Application.instance.logger;

    return Promise.all(this._servers.map(server => server
      .on('close', () => logger.log(`#${id}: ${server.address}:${server.port} closed`))
      .on('error', err => logger.error(`#${id}: ${Application.instance.debug ? err : err.message}`))
      .on('listening', () => logger.log(`#${id}: listening on ${server.address}:${server.port}`))
      .on('request', (req, res) => logger.log(`#${id}: ` + Application.logFormat
        .replace(':date[iso]', new Date().toISOString())
        .replace(':http-version', req.httpVersion)
        .replace(':method', req.method)
        .replace(':referrer', 'referer' in req.headers ? req.headers.referer : ('referrer' in req.headers ? req.headers.referrer : '-'))
        .replace(':remote-addr', 'ip' in req ? req.ip : req.socket.remoteAddress)
        .replace(':remote-user', this._extractUserFromRequest(req.headers.authorization))
        .replace(':req[host]', 'host' in req.headers ? req.headers.host : '-')
        .replace(':res[content-length]', 'content-length' in res.headers ? res.headers['content-length'] : '-')
        .replace(':status', res.statusCode)
        .replace(':user-agent', 'user-agent' in req.headers ? req.headers['user-agent'] : '-')
        .replace(':url', 'originalUrl' in req ? req.originalUrl : req.url)
      ))
      .listen()
    ));
  }

  /**
   * Extracts the user name provided in the specified `Authorization` header.
   * @param authorization The value of the `Authorization` header.
   * @return The user name found, otherwise the string `"-"`.
   */
  private _extractUserFromRequest(authorization?: string): string {
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
