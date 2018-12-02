part of '../io.dart';

/// A user defined route for a server.
class Route {

  /// The HTTP headers to add to incoming requests.
  final Map<String, String> headers = {};

  /// The URL of the target server.
  final Uri uri = null;

  /// Creates a new route.
  Route(/* readonly uri: URL, readonly headers: Map<string, string> = new Map */);

  /**
   * Creates a new route from the specified definition.
   * Returns the route corresponding to the specified definition.
   */
  /*
  Route.from(definition: number | string | Target): Route {
    if (typeof definition == 'number') return new this(new URL(`http://127.0.0.1:${definition}`));
    if (typeof definition == 'string') return new this(new URL(/^https?:/i.test(definition) ? definition : `http://${definition}`));

    const headers = new Map<string, string>();
    for (const [key, value] of Object.entries(definition.headers ? definition.headers : {})) headers.set(key.toLowerCase(), value);

    const uri = typeof definition.uri == 'number' ? `http://127.0.0.1:${definition.uri}` : definition.uri;
    return new this(new URL(/^https?:/i.test(uri) ? uri : `http://${uri}`), headers);
  }*/
}
