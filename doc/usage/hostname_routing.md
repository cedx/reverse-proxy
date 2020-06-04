# Hostname routing

## Proxying requests using a routing table
A routing table is a simple lookup table that maps incoming requests to proxy target locations. The mapping is based on the [HTTP `Host` header](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).

To use hostname routing, you need to provide a `routes` key in your [configuration file](configuration.md), instead of a `target` key. The value of this key is an object where the keys are hostnames and the values are target locations.

!!! tip
	Unhandled hostnames result in a `404` HTTP error.
	To override this behavior, use a wildcard character (`*`) as hostname
	to define the route matched by default when a hostname is not found.

## Example
Enable the hostname routing, using the following mappings:

- the requests for `domain.com` are routed to the server at `http://192.168.0.1:80`
- the requests for `sub.domain.com` are routed to the server at `http://another.host:8080`
- all other requests are routed to the server at `http://127.0.0.1:3000`

### JSON configuration

``` json
{
	"port": 8080,
	"routes": {
		"domain.com": "192.168.0.1",
		"sub.domain.com": "http://another.host:8080",
		"*": 3000
	}
}
```

### YAML configuration

``` yaml
port: 8080
routes:
	domain.com: "192.168.0.1"
	sub.domain.com: "http://another.host:8080"
	"*": 3000
```
