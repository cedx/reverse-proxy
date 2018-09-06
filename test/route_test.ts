/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Route} from '../src';

/**
 * Tests the features of the `Route` class.
 */
@suite class RouteTest {

  /**
   * Tests the `Route.from()` method.
   */
  @test testFrom() {
    // It should handle numbers.
    let route = Route.from(1234);
    expect(route.uri.href).to.equal('http://127.0.0.1:1234');
    expect(route.headers.size).to.equal(0);

    // It should handle strings.
    route = Route.from('https://belin.io');
    expect(route.uri.href).to.equal('https://belin.io');
    expect(route.headers.size).to.equal(0);

    route = Route.from('belin.io:5678');
    expect(route.uri.href).to.equal('http://belin.io:5678');
    expect(route.headers.size).to.equal(0);

    // It should handle `Target` instances.
    route = Route.from({
      headers: {Authorization: 'Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ='},
      uri: 1234
    });

    expect(route.uri.href).to.equal('http://127.0.0.1:1234');
    expect(route.headers.size).to.equal(1);
    expect(route.headers.get('authorization')).to.equal('Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ=');

    route = Route.from({
      headers: {'Authorization': 'Basic Z29vZHVzZXI6c2VjcmV0cGFzc3dvcmQ=', 'X-Custom-Header': 'X-Value'},
      uri: 'belin.io:5678'
    });

    expect(route.uri.href).to.equal('http://belin.io:5678');
    expect(route.headers.size).to.equal(2);
    expect(route.headers.get('x-custom-header')).to.equal('X-Value');
  }
}
