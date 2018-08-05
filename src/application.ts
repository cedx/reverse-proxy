const cluster = require('cluster');
const {Console} = require('console');
const {cpus} = require('os');
const program = require('commander');
const {promises} = require('fs');
const yaml = require('js-yaml');
const {Writable} = require('stream');
const {promisify} = require('util');
const pkg = require('../package.json');
const {Server} = require('./server.js');
const {Worker} = require('./worker.js');

/**
 * The application singleton.
 * @type {Application}
 */
let _app = null;

/**
 * Represents an application providing functionalities specific to console requests.
 */
class Application {

  /**
   * The default number of workers.
   * @type {number}
   */
  static get defaultWorkerCount() {
    return Math.ceil(cpus().length / 2);
  }

  /**
   * The application singleton.
   * @type {Application}
   */
  static get instance() {
    return _app;
  }

  /**
   * The format used for logging the requests.
   * @type {string}
   */
  static get logFormat() {
    return ':req[host] :remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
  }

  /**
   * Creates a new application.
   */
  constructor() {
    _app = this;

    /**
     * The message logger.
     * @type {Console}
     */
    this.logger = console;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Application';
  }

  /**
   * Value indicating whether the application runs in debug mode.
   * @type {boolean}
   */
  get debug() {
    return ['development', 'test'].includes(this.environment);
  }

  /**
   * The application environment.
   * @type {string}
   */
  get environment() {
    return 'NODE_ENV' in process.env ? process.env.NODE_ENV : 'development';
  }

  /**
   * Terminates the application.
   * @param {number} [status] The exit status.
   */
  end(status = 0) {
    let timeout;
    const stopTimer = () => {
      if (timeout) clearTimeout(timeout);
    };

    for (let worker of Object.values(cluster.workers)) {
      worker.send({action: 'stop'});
      worker.on('disconnect', stopTimer).disconnect();
      timeout = setTimeout(() => worker.kill(), 2000);
    }

    process.exit(status);
  }

  /**
   * Initializes the application.
   * @param {Object} [args] The command line arguments.
   */
  async init(args = {}) {
    if (typeof args.config == 'string') this.servers = await Application._parseConfiguration(await promises.readFile(args.config, 'utf8'));
    else this.servers = [new Server({
      address: args.address,
      port: args.port,
      target: args.target
    })];
  }

  /**
   * Runs the application.
   * @param {string[]} [args] The command line arguments.
   */
  async run(args = process.argv) {
    if (cluster.isWorker) {
      let worker = new Worker;
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
   * @param {string[]} args The command line arguments.
   */
  _parseCommandLineArguments(args) {
    const format = {
      asInteger: value => Number.parseInt(value, 10),
      asIntegerIfNumeric: value => /^\d+$/.test(value) ? Number.parseInt(value, 10) : value
    };

    program.name('reverse-proxy')
      .description('Simple reverse proxy server supporting WebSockets.')
      .version(pkg.version, '-v, --version')
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
  async _parseConfiguration(configuration) {
    let data = configuration.trim();
    if (!data.length) throw new TypeError('Invalid configuration data');

    let firstChar = data[0];
    let lastChar = data[data.length - 1];
    let isJson = (firstChar == '[' && lastChar == ']') || (firstChar == '{' && lastChar == '}');

    let servers;
    if (isJson) {
      servers = JSON.parse(data);
      if (!Array.isArray(servers)) servers = [servers];
    }
    else {
      servers = [];
      yaml.safeLoadAll(data, options => servers.push(options));
    }

    if (!servers.every(value => typeof value == 'object' && value)) throw new TypeError('Invalid configuration format');

    const loadCert = promisify(readFile);
    for (let options of servers) {
      if (!('routes' in options) && !('target' in options)) throw new TypeError('You must provide at least a target or a routing table');
      if (!('address' in options)) options.address = program.address;
      if (!('port' in options)) options.port = program.port;

      if (typeof options.ssl == 'object' && options.ssl) {
        let keys = ['ca', 'cert', 'key', 'pfx'].filter(key => typeof options.ssl[key] == 'string');
        for (let key of keys) options.ssl[key] = await loadCert(options.ssl[key]);
      }
    }

    return servers.map(options => new Server(options));
  }

  /**
   * Starts the request workers.
   */
  async _startWorkers() {
    let servers = [];
    if (program.target) servers.push({
      address: program.address,
      port: program.port,
      target: program.target
    });
    else {
      await this.init(program);
      if (!servers.length) throw new Error('Unable to find any configuration for the reverse proxy');
    }

    let workers = Math.min(Math.max(1, program.workers), cpus().length);
    for (let i = 0; i < workers; i++) cluster.fork().send({action: 'start', params: servers});
  }
}

// Module exports.
exports.Application = Application;
