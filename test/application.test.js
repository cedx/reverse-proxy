'use strict';

const {expect} = require('chai');
const {Application, Server} = require('../lib/index.js');

/**
 * @test {Application}
 */
describe('Application', () => {

  /**
   * @test {Application#debug}
   */
  describe('#debug', () => {
    it('should be `false` in production environment', () => {
      process.env.NODE_ENV = 'production';
      expect(new Application().debug).to.be.false;
    });

    it('should be `true` in development environment', () => {
      process.env.NODE_ENV = 'development';
      expect(new Application().debug).to.be.true;
    });
  });

  /**
   * @test {Application#environment}
   */
  describe('#environment', () => {
    it('should be "development" if the `NODE_ENV` environment variable is not set', () => {
      delete process.env.NODE_ENV;
      expect(new Application().environment).to.equal('development');
    });

    it('should equal the value of `NODE_ENV` environment variable when it is set', () => {
      process.env.NODE_ENV = 'production';
      expect(new Application().environment).to.equal('production');
    });
  });

  /**
   * @test {Application#init}
   */
  describe('#init()', () => {
    it('should initialize the `servers` property from the command line arguments', async () => {
      let app = new Application;
      await app.init({port: 80, target: 3000});
      expect(app.servers).to.be.an('array').and.have.lengthOf(1);
      expect(app.servers[0].port).to.equal(80);
    });

    it('should initialize the `servers` property from the JSON configuration', async () => {
      let app = new Application;
      await app.init({config: 'example/json/basic_standalone.json'});
      expect(app.servers).to.be.an('array').and.have.lengthOf(1);
      expect(app.servers[0].port).to.equal(80);
    });

    it('should initialize the `servers` property from the YAML configuration', async () => {
      let app = new Application;
      await app.init({config: 'example/yaml/basic_standalone.yaml'});
      expect(app.servers).to.be.an('array').and.have.lengthOf(1);
      expect(app.servers[0].port).to.equal(80);
    });
  });

  /**
   * @test {Application.parseConfig}
   */
  describe('.parseConfig()', () => {
    it('should throw an error if the configuration has an invalid format', async () => {
      try {
        await Application.parseConfig('"FooBar"');
        expect(true).to.not.be.ok;
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });

    it('should throw an error if the parsed JSON configuration has no `routes` and no `target` properties', async () => {
      try {
        await Application.parseConfig('{"port": 80}');
        expect(true).to.not.be.ok;
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });

    it('should throw an error if the parsed YAML configuration has no `routes` and no `target` properties', async () => {
      try {
        await Application.parseConfig('port: 80');
        expect(true).to.not.be.ok;
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });

    it('should completes with an array if the parsed JSON configuration is valid', async () => {
      let config = await Application.parseConfig('{"port": 80, "target": 3000}');
      expect(config).to.be.an('array').and.have.lengthOf(1);
      expect(config[0]).to.be.instanceof(Server);
      expect(config[0].port).to.equal(80);
    });

    it('should completes with an array if the parsed YAML configuration is valid', async () => {
      let config = await Application.parseConfig('port: 80\ntarget: 3000');
      expect(config).to.be.an('array').and.have.lengthOf(1);
      expect(config[0]).to.be.instanceof(Server);
      expect(config[0].port).to.equal(80);
    });

    it('should handle the loading of certificate files', async () => {
      let settings = `{
        "target": 3000,
        "ssl": {
          "cert": "test/fixtures/cert.pem",
          "key": "test/fixtures/key.pem"
        }
      }`;

      let config = await Application.parseConfig(settings);
      expect(config).to.be.an('array').and.have.lengthOf(1);
      expect(config[0]).to.be.instanceof(Server);

      let cert = config[0]._options.ssl.cert;
      expect(cert).to.be.instanceof(Buffer);
      expect(cert.toString()).to.contain('-----BEGIN CERTIFICATE-----');

      let key = config[0]._options.ssl.key;
      expect(key).to.be.instanceof(Buffer);
      expect(key.toString()).to.contain('-----BEGIN ENCRYPTED PRIVATE KEY-----');
    });
  });
});
