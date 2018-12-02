part of '../io.dart';

/// Represents an application providing functionalities specific to console requests.
class Application {

  /// Creates a new application.
  Application(): logger = console {
    _app = this;
  }

  /// The default number of workers.
  static int get defaultWorkerCount => (os.cpus().length / 2).ceil();

  /// The format used for logging the requests.
  static const String logFormat =
    ':req[host] :remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

  /// Value indicating whether the application runs in debug mode.
  bool get debug => ['development', 'test'].contains(environment);

  /// The application environment.
  String get environment => hasProperty(process.env, 'NODE_ENV') ? process.env['NODE_ENV'] : 'development';

  /// The message logger.
  Console logger;

  /// Terminates the application with the specified exit [status].
  void end([int status = 0]) {
    /* TODO
    var timeout: NodeJS.Timer;
    const stopTimer = () {
      if (timeout) clearTimeout(timeout);
    };

    for (final worker of Object.values(cluster.workers)) if (worker) {
      worker.send({action: 'stop'});
      worker.on('disconnect', stopTimer).disconnect();
      timeout = setTimeout(() => worker.kill(), 2000);
    }*/

    process.exit(status);
  }

  /// Initializes the application with the specified arguments.
  Future<void> init(/* args = {} */) async {
    /* TODO
    if (typeof args.config == 'string') servers = await Application._parseConfiguration(await promises.readFile(args.config, 'utf8'));
    else servers = [new Server({
      address: args.address,
      port: args.port,
      target: args.target
    })];*/
  }

  /// Runs the application with the specified command line arguments.
  Future<void> run([List<String> args]) async {
    args ??= process.argv;

    /*
    if (cluster.isWorker) {
      final worker = Worker();
      process.on('message', (message) => worker[message.action].apply(Array.isArray(message.params) ? message.params : []));
    }
    else {
      _parseCommandLineArguments(args);
      if (!program.config && !program.target) program.help();

      if (program.silent) logger = new Console(new Writable({
        write(chunk, encoding, callback) { callback(); },
        writev(chunks, callback) { callback(); }
      }));

      await _startWorkers();
      process.on('SIGINT', () => end());
    }*/
  }

  /// Parses the command line arguments.
/*
  _parseCommandLineArguments(args: string[]): void {
    final format = {
      asInteger: (value: string) => Number.parseInt(value, 10),
      asIntegerIfNumeric: (value: string) => /^\d+$/.test(value) ? Number.parseInt(value, 10) : value
    };

    program.name('reverse_proxy')
      .option('-a, --address <address>', 'address that the reverse proxy should run on', Server.defaultAddress)
      .option('-p, --port <port>', 'port that the reverse proxy should run on', format.asInteger, Server.defaultPort)
      .option('-t, --target <target>', 'location of the server the proxy will target', format.asIntegerIfNumeric)
      .option('-c, --config <path>', 'location of the configuration file for the reverse proxy')
      .option('-w, --workers <count>', 'number of workers processing requests', format.asInteger, Application.defaultWorkerCount);
  }*/

  /**
   * Parses the specified configuration data.
   * @param {string} configuration A string specifying the application configuration.
   * Returns {Promise<Server[]>} The server instances corresponding to the parsed configuration.
   */
  Future<List<Server>> _parseConfiguration(String configuration) async {
    /*
    const data = configuration.trim();
    if (!data.length) throw new TypeError('Invalid configuration data');

    const firstChar = data[0];
    const lastChar = data[data.length - 1];
    const isJson = (firstChar == '[' && lastChar == ']') || (firstChar == '{' && lastChar == '}');

    let servers: JsonMap[];
    if (!isJson) servers = yaml.safeLoadAll(data);
    else {
      servers = JSON.parse(data);
      if (!Array.isArray(servers)) servers = [servers];
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
    */
    return null;
  }

  /// Starts the request workers.
  Future<void> _startWorkers() async {
    /*
    const servers = [];
    if (program.target) servers.push({
      address: program.address,
      port: program.port,
      target: program.target
    });
    else {
      await init(program);
      if (!servers.length) throw new Error('Unable to find any configuration for the reverse proxy');
    }

    const workers = Math.min(Math.max(1, program.workers), cpus().length);
    for (let i = 0; i < workers; i++) cluster.fork().send({action: 'start', params: servers});
    */
    return null;
  }
}
