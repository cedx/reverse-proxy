/** A user defined route for a server. */
export class Route {

	/**
	 * Creates a new route.
	 * @param uri The URL of the target server.
	 * @param headers The HTTP headers to add to incoming requests.
	 */
	constructor(readonly uri: URL, readonly headers: Map<string, string> = new Map) {}

	/**
	 * Creates a new route from the specified definition.
	 * @return The route corresponding to the specified definition.
	 */
	static from(definition: number | string | Target): Route {
		if (typeof definition == "number") return new Route(new URL(`http://127.0.0.1:${definition}`));
		if (typeof definition == "string") return new Route(new URL(/^https?:/i.test(definition) ? definition : `http://${definition}`));

		const headers = new Map<string, string>();
		for (const [key, value] of Object.entries(definition.headers ?? {})) headers.set(key.toLowerCase(), value);

		const uri = typeof definition.uri == "number" ? `http://127.0.0.1:${definition.uri}` : definition.uri;
		return new Route(new URL(/^https?:/i.test(uri) ? uri : `http://${uri}`), headers);
	}
}
