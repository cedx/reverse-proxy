# Setup a basic stand-alone proxy server
From a command prompt:

```shell
reverse_proxy --port=8080 --target=3000
# Reverse proxy instance listening on 0.0.0.0:8080
```

This will proxy all HTTP requests on port 80 on all network interfaces (i.e. `0.0.0.0`) to port 3000 on the same host (i.e. `127.0.0.1`). For a different target host:

```shell
reverse_proxy --port=80 --target=192.168.0.1:3000
reverse_proxy --port=8080 --target=http://another.host:8080 --user=www-data
```

You can also use a [configuration file](configuration.md) for the same task:

```shell
reverse_proxy --config=path/to/config.yaml
```

For more advanced usages, you **always** need to use [configuration files](configuration.md).

> A target server can be expressed in two possible ways in the configuration file:
> - a string or a number representing an URI: `3000` (a port of the local host), `"domain.com:8080"` (an authority) or `"http://domain.com:8080"` (an origin).
> - an object with a `uri` property having the same format: `{"uri": 3000}`, `{"uri": "domain.com:8080"}` or `{"uri": "http://domain.com:8080"}`.

## Example

### JSON configuration

```json
{
  "port": 80,
  "target": 3000
}
```

### YAML configuration

```yaml
# Basic stand-alone.
port: 80
target: 3000
```
