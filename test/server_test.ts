/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {IncomingMessage, STATUS_CODES} from 'http';
import {suite, test, timeout} from 'mocha-typescript';
import {Route, Server} from '../src';

/**
 * Tests the features of the `Server` class.
 */
@suite(timeout(15000))
class ServerTest {

  /**
   * Tests the `Server#address` property.
   */
  @test testAddress(): void {
    // It should have an "any IPv4" address as the default address.
    expect(new Server().address).to.equal(Server.defaultAddress);

    // It should have the same host as the specified one.
    expect(new Server({address: 'localhost'}).address).to.equal('localhost');
  }

  /**
   * Tests the `Server#listening` property.
   */
  @test async testListening(): Promise<void> {
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
  @test testPort(): void {
    // It should have 8080 as the default port.
    expect(new Server().port).to.equal(Server.defaultPort);

    // It should have the same port as the specified one.
    expect(new Server({port: 3000}).port).to.equal(3000);
  }

  /**
   * Tests the `Server#routes` property.
   */
  @test async testRoutes(): Promise<void> {
    // It should be empty by default.
    expect(new Server().routes.size).to.equal(0);

    // It should create a default route if a target is specified.
    let routes = new Server({target: 9000}).routes;
    expect(routes.size).to.equal(1);

    let route = routes.get('*');
    expect(route).to.not.be.undefined;
    expect(route!.uri.href).to.equal('http://127.0.0.1:9000');

    // It should normalize the specified targets.
    routes = new Server({routes: {'belin.io': 'belin.io:1234'}}).routes;
    route = routes.get('belin.io');
    expect(route).to.not.be.undefined;
    expect(route!.uri.href).to.equal('http://belin.io:1234');
  }
}
