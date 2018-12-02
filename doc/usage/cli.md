# Command line interface
The **Reverse Proxy** application provides a command line interface:

```shell
reverse_proxy --help

Usage: reverse_proxy [options]

Simple reverse proxy server supporting WebSockets.


Options:

  -v, --version            output the version number
  -a, --address <address>  address that the reverse proxy should run on (default: 0.0.0.0)
  -p, --port <port>        port that the reverse proxy should run on (default: 8080)
  -t, --target <target>    location of the server the proxy will target
  -c, --config <path>      location of the configuration file for the reverse proxy
  -u, --user <user>        user to drop privileges to once server socket is bound
  --silent                 silence the log output from the reverse proxy
  -h, --help               output usage information
```
