# Reverse-Proxy.js
![Runtime](https://badgen.net/npm/node/@cedx/reverse-proxy) ![Release](https://badgen.net/npm/v/@cedx/reverse-proxy) ![Types](https://badgen.net/npm/types/@cedx/reverse-proxy) ![License](https://badgen.net/npm/license/@cedx/reverse-proxy) ![Downloads](https://badgen.net/npm/dt/@cedx/reverse-proxy) ![Dependencies](https://badgen.net/david/dep/cedx/reverse-proxy.js) ![Coverage](https://badgen.net/coveralls/c/github/cedx/reverse-proxy.js) ![Build](https://badgen.net/github/checks/cedx/reverse-proxy.js/main)

## Personal reverse proxy server
Let's suppose you were running multiple HTTP application servers, but you only wanted to expose one machine to the Internet. You could setup **Reverse-Proxy.js** on that one machine and then reverse-proxy the incoming HTTP requests to locally running services which were not exposed to the outside network.

!!! info
	Reverse-Proxy.js is based on the [`node-http-proxy` project](https://github.com/http-party/node-http-proxy).
	If you need advanced features not provided by this application, you should consider using the [`node-http-proxy` package](https://www.npmjs.com/package/http-proxy) directly.

## Features
- [Configuration](usage/configuration.md) based on simple [JSON](https://json.org) or [YAML](http://yaml.org) files.
- [Routing tables based on hostnames](usage/hostname_routing.md).
- [Multiple instances](usage/multiple_ports.md): allows to listen on several ports, with each one having its own target(s).
- Supports [HTTPS protocol](usage/using_https.md).
- Supports [WebSockets](https://en.wikipedia.org/wiki/WebSocket) requests.
- Supports [custom HTTP headers](usage/http_headers.md).

## Quick start
Install the latest version of **Reverse-Proxy.js** with [npm](https://www.npmjs.com):

``` shell
npm install --global @cedx/reverse-proxy
```

!!! info
	This application is packaged as [ECMAScript modules](https://nodejs.org/api/esm.html).

For detailed instructions, see the [installation guide](installation.md).
