import * as cluster from 'cluster';
import * as program from 'commander';
import {Console} from 'console';
import {promises} from 'fs';
import * as yaml from 'js-yaml';
import {cpus} from 'os';
import {Writable} from 'stream';

import {JsonMap} from './map';
import {Server} from './server';
import {Worker} from './worker';

/**
 * The application singleton.
 */
let _app: Application;

/**
 * Represents an application providing functionalities specific to console requests.
 */
export class Application {

  /**
   * The application singleton.
   */
  static get instance(): Application {
    return _app;
  }

  /**
   * The default number of workers.
   */
  static readonly defaultWorkerCount: number = Math.ceil(cpus().length / 2);

  /**
   * The format used for logging the requests.
   */
  static readonly logFormat: string =
    ':req[host] :remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

  /**
   * The version number of the package.
   */
  static readonly version: string = '10.0.0';

  /**
   * The message logger.
   */
  logger: Console = console;

  /**
   * Creates a new application.
   */
  constructor() {
    _app = this;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'Application';
  }

  /**
   * Value indicating whether the application runs in debug mode.
   */
  get debug(): boolean {
    return ['development', 'test'].includes(this.environment);
  }

  /**
   * The application environment.
   */
  get environment(): string {
    return 'NODE_ENV' in process.env ? process.env.NODE_ENV! : 'development';
  }

  /**
   * Terminates the application.
   * @param status The exit status.
   */
  end(status: number = 0): void {
    let timeout: NodeJS.Timer;
    const stopTimer = () => {
      if (timeout) clearTimeout(timeout);
    };

    for (const worker of Object.values(cluster.workers)) if (worker) {
      worker.send({action: 'stop'});
      worker.on('disconnect', stopTimer).disconnect();
      timeout = setTimeout(() => worker.kill(), 2000);
    }

    process.exit(status);
  }

  /**
   * Initializes the application.
   * @param args The command line arguments.
   */
  async init(args = {}) { // TODO typings
    if (typeof args.config == 'string') this.servers = await Application._parseConfiguration(await promises.readFile(args.config, 'utf8'));
    else this.servers = [new Server({
      address: args.address,
      port: args.port,
      target: args.target
    })];
  }

  /**
   * Runs the application.
   * @param args The command line arguments.
   */
  async run(args: string[] = process.argv): Promise<void> {
    if (cluster.isWorker) {
      const worker = new Worker;
      process.on('message', message => worker[message.action].apply(Array.isArray(message.params) ? message.params : []));
    }
    else {
      this._parseCommandLineArguments(args);
      if (!program.config && !program.target) program.help();

      if (program.silent) this.logger = new Console(new Writable({
        write(chunk, encoding, callback) { callback(); },
        writev(chunks, callback) { callback(); }
      }));

      await this._startWorkers();
      process.on('SIGINT', () => this.end());
    }
  }

  /**
   * Parses the command line arguments.
   * @param args The command line arguments.
   */
  private _parseCommandLineArguments(args: string[]): void {
    const format = {
      asInteger: (value: string) => Number.parseInt(value, 10),
      asIntegerIfNumeric: (value: string) => /^\d+$/.test(value) ? Number.parseInt(value, 10) : value
    };

    program.name('reverse-proxy')
      .description('Simple reverse proxy server supporting WebSockets.')
      .version(Application.version, '-v, --version')
      .option('-a, --address <address>', 'address that the reverse proxy should run on', Server.defaultAddress)
      .option('-p, --port <port>', 'port that the reverse proxy should run on', format.asInteger, Server.defaultPort)
      .option('-t, --target <target>', 'location of the server the proxy will target', format.asIntegerIfNumeric)
      .option('-c, --config <path>', 'location of the configuration file for the reverse proxy')
      .option('-w, --workers <count>', 'number of workers processing requests', format.asInteger, Application.defaultWorkerCount)
      .option('--silent', 'silence the log output from the reverse proxy')
      .parse(args);
  }

  /**
   * Parses the specified configuration data.
   * @param {string} configuration A string specifying the application configuration.
   * @return {Promise<Server[]>} The server instances corresponding to the parsed configuration.
   */
  private async _parseConfiguration(configuration: string): Promise<Server[]> {
    const data = configuration.trim();
    if (!data.length) throw new TypeError('Invalid configuration data');

    const firstChar = data[0];
    const lastChar = data[data.length - 1];
    const isJson = (firstChar == '[' && lastChar == ']') || (firstChar == '{' && lastChar == '}');

    let servers: JsonMap[];
    if (isJson) {
      servers = JSON.parse(data);
      if (!Array.isArray(servers)) servers = [servers];
    }
    else {
      servers = [];
      yaml.safeLoadAll(data, options => servers.push(options));
    }

    if (!servers.every(value => typeof value == 'object' && Boolean(value))) throw new TypeError('Invalid configuration format');

    for (const options of servers) {
      if (!('routes' in options) && !('target' in options)) throw new TypeError('You must provide at least a target or a routing table');
      if (!('address' in options)) options.address = program.address;
      if (!('port' in options)) options.port = program.port;

      if (typeof options.ssl == 'object' && options.ssl) {
        const keys = ['ca', 'cert', 'key', 'pfx'].filter(key => typeof options.ssl[key] == 'string');
        for (const key of keys) options.ssl[key] = await promises.readFile(options.ssl[key]);
      }
    }

    return servers.map(options => new Server(options));
  }

  /**
   * Starts the request workers.
   */
  private async _startWorkers(): Promise<void> {
    const servers = [];
    if (program.target) servers.push({
      address: program.address,
      port: program.port,
      target: program.target
    });
    else {
      await this.init(program);
      if (!servers.length) throw new Error('Unable to find any configuration for the reverse proxy');
    }

    const workers = Math.min(Math.max(1, program.workers), cpus().length);
    for (let i = 0; i < workers; i++) cluster.fork().send({action: 'start', params: servers});
  }
}
