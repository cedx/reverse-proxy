import program from 'commander';
import {packageVersion} from './version.g.js';

/**
 * Application entry point.
 * @return Completes when the program is terminated.
 */
export async function main(): Promise<void> {
  // Initialize the application.
  process.title = 'Reverse-Proxy.js';

  // Parse the command line arguments.
  const format = {
    asInteger: (value: string) => Number.parseInt(value, 10),
    asIntegerIfNumeric: (value: string) => /^\d+$/.test(value) ? Number.parseInt(value, 10) : value
  };

  program.name('reverse-proxy')
    .description('Personal reverse proxy server supporting WebSockets.')
    .version(packageVersion, '-v, --version')
    .option('-a, --address <address>', `address that the reverse proxy should run on [${Server.defaultAddress}]`, Server.defaultAddress)
    .option('-p, --port <port>', `port that the reverse proxy should run on [${Server.defaultPort}]`, format.asInteger, Server.defaultPort)
    .option('-t, --target <target>', 'location of the server the proxy will target', format.asIntegerIfNumeric)
    .option('-c, --config <path>', 'location of the configuration file for the reverse proxy')
    .option('-u, --user <user>', 'user to drop privileges to once server socket is bound', format.asIntegerIfNumeric)
    .option('--silent', 'silence the log output from the reverse proxy')
    .parse(process.argv);

  if (!program.config && !program.target) {
    program.outputHelp();
    process.exitCode = 64;
    return;
  }

  // Run the program.
  // TODO
}
