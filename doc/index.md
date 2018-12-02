# Reverse Proxy

## Personal reverse proxy server
Let's suppose you were running multiple HTTP application servers, but you only wanted to expose one machine to the Internet. You could setup **Reverse Proxy** on that one machine and then reverse-proxy the incoming HTTP requests to locally running services which were not exposed to the outside network.

!!! info
    Reverse Proxy is based on the [Nodejitsu HTTP Proxy](https://github.com/nodejitsu/node-http-proxy) project.
    If you need advanced features not provided by this application, you should consider using the [`http-proxy`](https://www.npmjs.com/package/http-proxy) package directly.

## Features
- [Configuration](usage/configuration.md) based on simple [JSON](https://json.org) or [YAML](http://yaml.org) files.
- [Routing tables based on hostnames](usage/hostname_routing.md).
- [Multiple instances](usage/multiple_ports.md): allows to listen on several ports, with each one having its own target(s).
- Supports [HTTPS protocol](usage/using_https.md).
- Supports [WebSockets](https://en.wikipedia.org/wiki/WebSocket) requests.
- Supports [custom HTTP headers](usage/http_headers.md).

## Quick start
Install the latest version of **Reverse Proxy** with [npm](https://www.npmjs.com):

```shell
npm install --global @cedx/reverse-proxy
```

For detailed instructions, see the [installation guide](installation.md).
