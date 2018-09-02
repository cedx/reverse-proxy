/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Application, Server} from '../src';

/**
 * Tests the features of the `Application` class.
 */
@suite class ApplicationTest {

  /**
   * Tests the `Application#debug` property.
   */
  @test testDebug(): void {
    // It should be `false` in production environment', () => {
    process.env.NODE_ENV = 'production';
    expect(new Application().debug).to.be.false;

    // It should be `true` in development environment', () => {
    process.env.NODE_ENV = 'development';
    expect(new Application().debug).to.be.true;
  }

  /**
   * Tests the `Application#environment` property.
   */
  @test testEnvironment(): void {
    // It should be "development" if the `NODE_ENV` environment variable is not set', () => {
    delete process.env.NODE_ENV;
    expect(new Application().environment).to.equal('development');

    // It should equal the value of `NODE_ENV` environment variable when it is set', () => {
    process.env.NODE_ENV = 'production';
    expect(new Application().environment).to.equal('production');
  }

  /**
   * Tests the `Application#init}
   */
  @test async testInit(): Promise<void> {
    // It should initialize the `servers` property from the command line arguments.
    let app = new Application;
    await app.init({port: 80, target: 3000});
    expect(app.servers).to.be.an('array').and.have.lengthOf(1);
    expect(app.servers[0].port).to.equal(80);

    // It should initialize the `servers` property from the JSON configuration.
    app = new Application;
    await app.init({config: `${__dirname}/fixtures/config.json`});
    expect(app.servers).to.be.an('array').and.have.lengthOf(1);
    expect(app.servers[0].port).to.equal(80);

    // It should initialize the `servers` property from the YAML configuration.
    app = new Application;
    await app.init({config: `${__dirname}/fixtures/config.yaml`});
    expect(app.servers).to.be.an('array').and.have.lengthOf(1);
    expect(app.servers[0].port).to.equal(80);
  }

  /**
   * Tests the `Application._parseConfiguration}
   */
  @test async test_parseConfiguration(): Promise<void> {
    // It should throw an error if the configuration has an invalid format.
    try {
      await Application._parseConfig('"FooBar"');
      expect.fail('Error not thrown');
    }

    catch (err) {
      expect(true).to.be.ok;
    }

    // It should throw an error if the parsed JSON configuration has no `routes` and no `target` properties.
    try {
      await Application._parseConfig('{"port": 80}');
      expect.fail('Error not thrown');
    }

    catch (err) {
      expect(true).to.be.ok;
    }

    // It should throw an error if the parsed YAML configuration has no `routes` and no `target` properties.
    try {
      await Application._parseConfig('port: 80');
      expect.fail('Error not thrown');
    }

    catch (err) {
      expect(true).to.be.ok;
    }

    // It should completes with an array if the parsed JSON configuration is valid.
    let config = await Application._parseConfig('{"port": 80, "target": 3000}');
    expect(config).to.be.an('array').and.have.lengthOf(1);
    expect(config[0]).to.be.instanceof(Server);
    expect(config[0].port).to.equal(80);

    // It should completes with an array if the parsed YAML configuration is valid.
    config = await Application._parseConfig('port: 80\ntarget: 3000');
    expect(config).to.be.an('array').and.have.lengthOf(1);
    expect(config[0]).to.be.instanceof(Server);
    expect(config[0].port).to.equal(80);

    // It should handle the loading of certificate files.
    const settings = `{
      "target": 3000,
      "ssl": {
        "cert": "test/fixtures/cert.pem",
        "key": "test/fixtures/key.pem"
      }
    }`;

    config = await Application._parseConfig(settings);
    expect(config).to.be.an('array').and.have.lengthOf(1);
    expect(config[0]).to.be.instanceof(Server);

    const cert = config[0]._options.ssl.cert;
    expect(cert).to.be.instanceof(Buffer);
    expect(cert.toString()).to.contain('-----BEGIN CERTIFICATE-----');

    const key = config[0]._options.ssl.key;
    expect(key).to.be.instanceof(Buffer);
    expect(key.toString()).to.contain('-----BEGIN ENCRYPTED PRIVATE KEY-----');
  }
}
