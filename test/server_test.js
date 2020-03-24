import {strict as assert} from 'assert';
import {Server} from '../lib/index.js';

/** Tests the features of the {@link Server} class. */
describe('Server', function() {
  this.timeout(15000);

  describe('.address', () => {
    it('should have an "any IPv4" address as the default address', () => {
      expect(new Server().address).to.equal(Server.defaultAddress);
    });

    it('should have the same host as the specified one', () => {
      expect(new Server({address: 'localhost'}).address).to.equal('localhost');
    });
  });

  describe('.listening', () => {
    it('should return whether the server is listening', async () => {
      const server = new Server({address: '127.0.0.1', port: 0});
      expect(server.listening).to.be.false;

      await server.listen();
      expect(server.listening).to.be.true;

      await server.close();
      expect(server.listening).to.be.false;
    });
  });

  describe('.port', () => {
    it('should have 8080 as the default port', () => {
      expect(new Server().port).to.equal(Server.defaultPort);
    });

    it('should have the same port as the specified one', () => {
      expect(new Server({port: 3000}).port).to.equal(3000);
    });
  });

  describe('.routes', () => {
    it('should be empty by default', () => {
      expect(new Server().routes.size).to.equal(0);
    });

    it('should create a default route if a target is specified', () => {
      const routes = new Server({target: 9000}).routes;
      expect(routes.size).to.equal(1);

      const route = routes.get('*');
      expect(route).to.not.be.undefined;
      expect(route.uri.href).to.equal('http://127.0.0.1:9000');
    });

    it('should normalize the specified targets', () => {
      const routes = new Server({routes: {'belin.io': 'belin.io:1234'}}).routes;
      const route = routes.get('belin.io');
      expect(route).to.not.be.undefined;
      expect(route.uri.href).to.equal('http://belin.io:1234');
    });
  });
});
