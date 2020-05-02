import {strict as assert} from 'assert';
import {Route} from '../lib/index.js';

/** Tests the features of the `Route` class. */
describe('Route', () => {
  describe('.from()', () => {
    it('should handle numbers', () => {
      const route = Route.from(1234);
      assert.equal(route.uri.href, 'http://127.0.0.1:1234');
      assert.equal(route.headers.size, 0);
    });

    it('should handle strings', () => {
      let route = Route.from('https://belin.io');
      assert.equal(route.uri.href, 'https://belin.io');
      assert.equal(route.headers.size, 0);

      route = Route.from('belin.io:5678');
      assert.equal(route.uri.href, 'http://belin.io:5678');
      assert.equal(route.headers.size, 0);
    });

    it('should handle `Target` instances', () => {
      let route = Route.from({
        headers: {Authorization: 'Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ='},
        uri: 1234
      });

      assert.equal(route.uri.href, 'http://127.0.0.1:1234');
      assert.equal(route.headers.size, 1);
      assert.equal(route.headers.get('Authorization'), 'Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ=');

      route = Route.from({
        headers: {Authorization: 'Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ=', 'X-Custom-Header': 'X-Value'},
        uri: 'belin.io:5678'
      });

      assert.equal(route.uri.href, 'http://belin.io:5678');
      assert.equal(route.headers.size, 2);
      assert.equal(route.headers.get('X-Custom-Header'), 'X-Value');
    });
  });
});
