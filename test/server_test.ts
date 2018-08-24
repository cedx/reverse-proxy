/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {STATUS_CODES} from 'http';
import {suite, test, timeout} from 'mocha-typescript';
import {Server} from '../src';

/**
 * Tests the features of the `Server` class.
 */
@suite(timeout(15000))
class ServerTest {

  /**
   * Tests the `Server#address` property.
   */
  @test async testaddress(): Promise<void> {
    // It should have an "any IPv4" address as the default address.
      expect(new Server().address).to.equal(Server.defaultAddress);

    // It should have the same host as the specified one.
      expect(new Server({address: 'localhost'}).address).to.equal('localhost');
  }

  /**
   * Tests the `Server#listening` property.
   */
  @test async testlistening(): Promise<void> {
    // It should return whether the server is listening.
      const server = new Server({address: '127.0.0.1', port: 0});
      expect(server.listening).to.be.false;

      await server.listen();
      expect(server.listening).to.be.true;

      await server.close();
      expect(server.listening).to.be.false;
  }

  /**
   * Tests the `Server#port` property.
   */
  @test async testport(): Promise<void> {
    // It should have 8080 as the default port.
      expect(new Server().port).to.equal(Server.defaultPort);

    // It should have the same port as the specified one.
      expect(new Server({port: 8080}).port).to.equal(8080);
  }

  /**
   * Tests the `Server#routes` property.
   */
  @test async testroutes(): Promise<void> {
    // It should be empty by default.
      expect(new Server().routes.size).to.equal(0);

    // It should create a default route if a target is specified.
      const routes = new Server({target: 9000}).routes;
      expect(routes.size).to.equal(1);
      expect(routes.get('*')).to.be.an('object').and.have.property('uri');

    // It should normalize the specified targets.
      const routes = new Server({routes: {'belin.io': 9000}}).routes;
      expect(routes.get('belin.io')).to.be.an('object')
        .and.have.property('uri').that.equal('http://127.0.0.1:9000');
  }

  /**
   * Tests the `Server#_getHostname}
   */
  @test async test_getHostname(): Promise<void> {
    const IncomingMessage = class {
      constructor(headers = {}) { this.headers = headers; }
    };

    // It should return "*" if there is no "Host" header in the request.
      expect(new Server()._getHostname(new IncomingMessage)).to.equal('*');

    // It should return the "Host" header found in the request, without the port number.
      expect(new Server()._getHostname(new IncomingMessage({host: 'belin.io:8080'}))).to.equal('belin.io');
  }

  /**
   * Tests the `Server#_normalizeRoute}
   */
  @test async test_normalizeRoute(): Promise<void> {
    // It should normalize a port on the local host.
    expect(new Server()._normalizeRoute(8080)).to.deep.equal({headers: {}, uri: 'http://127.0.0.1:8080'});
    expect(new Server()._normalizeRoute({uri: 8080})).to.deep.equal({headers: {}, uri: 'http://127.0.0.1:8080'});

    // It should normalize an authority.
    expect(new Server()._normalizeRoute('domain.com:8080')).to.deep.equal({headers: {}, uri: 'http://domain.com:8080'});
    expect(new Server()._normalizeRoute({uri: 'domain.com:8080'})).to.deep.equal({headers: {}, uri: 'http://domain.com:8080'});

    // It should normalize an origin.
    expect(new Server()._normalizeRoute('https://domain.com:8080')).to.deep.equal({headers: {}, uri: 'https://domain.com:8080'});
    expect(new Server()._normalizeRoute({uri: 'https://domain.com:8080'})).to.deep.equal({headers: {}, uri: 'https://domain.com:8080'});

    // It should normalize the HTTP headers.
    const headers = {'X-Header': 'X-Value'};
    expect(new Server()._normalizeRoute({headers, uri: 'https://domain.com:8080'}))
      .to.deep.equal({headers: {'x-header': 'X-Value'}, uri: 'https://domain.com:8080'});

    // It should throw an error if the route has an invalid format.
    expect(() => new Server()._normalizeRoute([8080])).to.throw();
  }

  /**
   * Tests the `Server#_sendStatus}
   */
  @test async test_sendStatus(): Promise<void> {
    const ServerResponse = class {
      constructor() {
        this.body = '';
        this.status = 200;
      }
      end(message) { this.body = message; }
      writeHead(status) { this.status = status; }
    };

    // It should set the response status.
    const response = new ServerResponse;
    expect(response.status).to.equal(200);
    new Server()._sendStatus(response, 404);
    expect(response.status).to.equal(404);

    // It should set the response body.
    const response = new ServerResponse;
    expect(response.body).to.be.empty;
    new Server()._sendStatus(response, 404);
    expect(response.body).to.equal(STATUS_CODES[404]);
  }
}
