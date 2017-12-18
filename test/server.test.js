'use strict';

const {expect} = require('chai');
const {STATUS_CODES} = require('http');
const {Server} = require('../lib/index.js');

/**
 * @test {Server}
 */
describe('Server', function() {
  this.timeout(10000);

  /**
   * @test {Server#address}
   */
  describe('#address', () => {
    it('should have an "any IPv4" address as the default address', () => {
      expect(new Server().address).to.equal(Server.defaultAddress);
    });

    it('should have the same host as the specified one', () => {
      expect(new Server({address: 'localhost'}).address).to.equal('localhost');
    });
  });

  /**
   * @test {Server#listening}
   */
  describe('#listening', () => {
    it('should return whether the server is listening', async () => {
      let server = new Server({address: '127.0.0.1', port: 0});
      expect(server.listening).to.be.false;

      await server.listen();
      expect(server.listening).to.be.true;

      await server.close();
      expect(server.listening).to.be.false;
    });
  });

  /**
   * @test {Server#port}
   */
  describe('#port', () => {
    it('should have 3000 as the default port', () => {
      expect(new Server().port).to.equal(Server.defaultPort);
    });

    it('should have the same port as the specified one', () => {
      expect(new Server({port: 8080}).port).to.equal(8080);
    });
  });

  /**
   * @test {Server#routes}
   */
  describe('#routes', () => {
    it('should be empty by default', () => {
      expect(new Server().routes.size).to.equal(0);
    });

    it('should create a default route if a target is specified', () => {
      let routes = new Server({target: 9000}).routes;
      expect(routes.size).to.equal(1);
      expect(routes.get('*')).to.be.an('object').and.have.property('uri');
    });

    it('should normalize the specified targets', () => {
      let routes = new Server({routes: {'belin.io': 9000}}).routes;
      expect(routes.get('belin.io')).to.be.an('object')
        .and.have.property('uri').that.equal('http://127.0.0.1:9000');
    });
  });

  /**
   * @test {Server#_getHostname}
   */
  describe('#_getHostname()', () => {
    it('it should return "*" if there is no "Host" header in the request', () => {
      expect(new Server()._getHostname({headers: {}})).to.equal('*');
    });

    it('it should return the "Host" header found in the request, without the port number', () => {
      expect(new Server()._getHostname({headers: {host: 'belin.io:8080'}})).to.equal('belin.io');
    });
  });

  /**
   * @test {Server#_normalizeRoute}
   */
  describe('#_normalizeRoute()', () => {
    it('it should normalize a port on the local host', () => {
      expect(new Server()._normalizeRoute(3000)).to.deep.equal({headers: {}, uri: 'http://127.0.0.1:3000'});
      expect(new Server()._normalizeRoute({uri: 3000})).to.deep.equal({headers: {}, uri: 'http://127.0.0.1:3000'});
    });

    it('it should normalize an authority', () => {
      expect(new Server()._normalizeRoute('domain.com:8080')).to.deep.equal({headers: {}, uri: 'http://domain.com:8080'});
      expect(new Server()._normalizeRoute({uri: 'domain.com:8080'})).to.deep.equal({headers: {}, uri: 'http://domain.com:8080'});
    });

    it('it should normalize an origin', () => {
      expect(new Server()._normalizeRoute('https://domain.com:8080')).to.deep.equal({headers: {}, uri: 'https://domain.com:8080'});
      expect(new Server()._normalizeRoute({uri: 'https://domain.com:8080'})).to.deep.equal({headers: {}, uri: 'https://domain.com:8080'});
    });

    it('it should normalize the HTTP headers', () => {
      let headers = {'X-Header': 'X-Value'};
      expect(new Server()._normalizeRoute({headers, uri: 'https://domain.com:8080'}))
        .to.deep.equal({headers: {'x-header': 'X-Value'}, uri: 'https://domain.com:8080'});
    });

    it('it should throw an error if the route has an invalid format', () => {
      expect(() => new Server()._normalizeRoute([3000])).to.throw();
    });
  });

  /**
   * @test {Server#_sendStatus}
   */
  describe('#_sendStatus()', () => {
    const Response = class {
      /* eslint-disable require-jsdoc */
      constructor() {
        this.body = '';
        this.status = 200;
      }
      end(message) { this.body = message; }
      writeHead(status) { this.status = status; }
      /* eslint-enable require-jsdoc */
    };

    it('it should set the response status', () => {
      let response = new Response;
      expect(response.status).to.equal(200);
      new Server()._sendStatus(response, 404);
      expect(response.status).to.equal(404);
    });

    it('it should set the response body', () => {
      let response = new Response;
      expect(response.body).to.be.empty;
      new Server()._sendStatus(response, 404);
      expect(response.body).to.equal(STATUS_CODES[404]);
    });
  });
});
