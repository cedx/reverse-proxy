import * as chai from 'chai';
import {Route} from '../src/index';

/** Tests the features of the [[Route]] class. */
describe('Route', () => {
  describe('.from()', () => {
    it('should handle numbers', () => {
      const route = Route.from(1234);
      expect(route.uri.href).to.equal('http://127.0.0.1:1234');
      expect(route.headers.size).to.equal(0);
    });

    it('should handle strings', () => {
      let route = Route.from('https://belin.io');
      expect(route.uri.href).to.equal('https://belin.io');
      expect(route.headers.size).to.equal(0);

      route = Route.from('belin.io:5678');
      expect(route.uri.href).to.equal('http://belin.io:5678');
      expect(route.headers.size).to.equal(0);
    });

    it('should handle `Target` instances', () => {
      let route = Route.from({
        headers: {authorization: 'Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ='},
        uri: 1234
      });

      expect(route.uri.href).to.equal('http://127.0.0.1:1234');
      expect(route.headers.size).to.equal(1);
      expect(route.headers.get('authorization')).to.equal('Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ=');

      route = Route.from({
        headers: {'authorization': 'Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ=', 'x-custom-header': 'X-Value'},
        uri: 'belin.io:5678'
      });

      expect(route.uri.href).to.equal('http://belin.io:5678');
      expect(route.headers.size).to.equal(2);
      expect(route.headers.get('x-custom-header')).to.equal('X-Value');
    });
  });
});
