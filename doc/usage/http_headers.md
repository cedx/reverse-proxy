# Custom HTTP headers
It can sometimes be useful to add some HTTP headers to the requests sent to the target servers.

Let's say that you have a remote service that needs basic authentication, but that you want to expose publicly. You could add an `Authorization` header to the proxied requests in order to let the remote service accept these requests.

## Adding HTTP headers to the proxied requests
To add an header to all the proxied requests of a target, you must use the **object notation** for this target, and a `headers` property providing a map of the HTTP headers to set.

!!! warning
	The HTTP headers defined in this way will replace **any** existing headers with the same name.

## Example
Adding the `Authorization` and `X-Custom-Header` HTTP headers to the requests received on port `8080` and forwarded to `http://127.0.0.1:3000`: 

### JSON configuration

``` json
{
	"port": 8080,
	"target": {
		"uri": 3000,
		"headers": {
			"Authorization": "Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ=",
			"X-Custom-Header": "X-Value"
		}
	}
}
```

### YAML configuration

``` yaml
port: 8080
target:
	uri: 3000
	headers:
		Authorization: "Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ="
		X-Custom-Header: "X-Value"
```
