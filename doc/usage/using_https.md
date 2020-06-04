# Using HTTPS
A common use-case for proxying in conjunction with HTTPS is that you have some front-facing HTTPS server, but all of your internal traffic is HTTP. In this way, you can reduce the number of servers to which your CA and other important security files are deployed and reduce the computational overhead from HTTPS traffic.

If you want the proxy server to use HTTPS protocol, you need to provide a `ssl` key in your [configuration file](configuration.md).

The value of this key is an object that will be used as the first argument to [`https~createServer()`](http://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) function when instanciating the proxy server.
Its structure is similar to the `options` parameter of [`tls~createServer()`](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) function.

!!! info
	The `ca`, `cert`, `key` and `pfx` fields are specified as file paths:
	the corresponding files are loaded by the [CLI script](cli.md).

## Example
Proxying HTTPS requests on port `443` to an HTTP server listening at `http://127.0.0.1:3000` :

### JSON configuration

``` json
{
	"port": 443,
	"target": 3000,
	"ssl": {
		"cert": "/path/to/ssl/cert.file",
		"key": "/path/to/ssl/key.file"
	}
}
```

### YAML configuration

``` yaml
port: 443
target: 3000
ssl:
	cert: "/path/to/ssl/cert.file"
	key: "/path/to/ssl/key.file"
```
