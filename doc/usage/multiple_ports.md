# Listening on multiple ports
In order to listen on several ports, all you have to do is to use a [JSON array](https://json.org) or a [YAML stream](http://yaml.org/spec/1.2/spec.html#id2801681) containing a different [configuration](configuration.md) object for each port to listen. Consequently, each port can have its own settings and [routing table](hostname_routing.md).

## Example
A front server, supporting [HTTPS](using_https.md) and listening on ports `80` and `443`, forwarding requests to the server at `http://127.0.0.1:3000` :

### JSON configuration

``` json
[
	{
		"port": 80,
		"target": 3000
	},
	{
		"port": 443,
		"target": 3000,
		"ssl": {
			"cert": "/path/to/ssl/cert.file",
			"key": "/path/to/ssl/key.file"
		}
	}
]
```

### YAML configuration

``` yaml
---
port: 80
target: 3000
---
port: 443
target: 3000
ssl:
	cert: "/path/to/ssl/cert.file"
	key: "/path/to/ssl/key.file"
```
