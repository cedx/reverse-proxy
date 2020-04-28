# Configuration schema
The [`defaults.json`](https://git.belin.io/cedx/reverse-proxy.js/src/branch/master/example/json/defaults.json) or [`defaults.yaml`](https://git.belin.io/cedx/reverse-proxy.js/src/branch/master/example/yaml/defaults.yaml) file, in the `example` folder of this package, lists all available settings and their default values.

> A target server can be expressed in two possible ways in the configuration file:
> - a string or a number representing an URI: `3000` (a port of the local host), `"domain.com:8080"` (an authority) or `"http://domain.com:8080"` (an origin).
> - an object with a `uri` property having the same format: `{"uri": 3000}`, `{"uri": "domain.com:8080"}` or `{"uri": "http://domain.com:8080"}`.

## Defaults

### JSON configuration

```json
{
  "address": "0.0.0.0",
  "port": 8080,
  "routes": {},
  "target": null,

  "proxy": {
    "agent": null,
    "autoRewrite": false,
    "changeOrigin": false,
    "forward": null,
    "hostRewrite": false,
    "ignorePath": false,
    "prependPath": true,
    "protocolRewrite": null,
    "secure": true,
    "ws": false,
    "xfwd": false
  },

  "ssl": {
    "ca": null,
    "cert": null,
    "ciphers": null,
    "handshakeTimeout": 120000,
    "honorCipherOrder": false,
    "key": null,
    "passphrase": null,
    "pfx": null,
    "rejectUnauthorized": false,
    "requestCert": false
  }
}
```

### YAML configuration

```yaml
address: 0.0.0.0
port: 8080
routes: {}
target: null

proxy:
  agent: null
  autoRewrite: false
  changeOrigin: false
  forward: null
  hostRewrite: false
  ignorePath: false
  prependPath: true
  protocolRewrite: null
  secure: true
  ws: false
  xfwd: false

ssl:
  ca: null
  cert: null
  ciphers: null
  handshakeTimeout: 120000
  honorCipherOrder: false
  key: null
  passphrase: null
  pfx: null
  rejectUnauthorized: false
  requestCert: false
```
