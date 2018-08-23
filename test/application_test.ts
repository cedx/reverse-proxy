import {expect} from 'chai';
import {Application, Server} from '../src';

/**
 * Tests the features of the `Application` class.
 */
describe('Application', () => {

  /**
   * Tests the `Application#debug` property.
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
   * Tests the `Application#environment` property.
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
   * Tests the `Application#init}
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
      await app.init({config: `${__dirname}/fixtures/config.json`});
      expect(app.servers).to.be.an('array').and.have.lengthOf(1);
      expect(app.servers[0].port).to.equal(80);
    });

    it('should initialize the `servers` property from the YAML configuration', async () => {
      let app = new Application;
      await app.init({config: `${__dirname}/fixtures/config.yaml`});
      expect(app.servers).to.be.an('array').and.have.lengthOf(1);
      expect(app.servers[0].port).to.equal(80);
    });
  });

  /**
   * Tests the `Application._parseConfiguration}
   */
  describe('._parseConfiguration()', () => {
    it('should throw an error if the configuration has an invalid format', async () => {
      try {
        await Application._parseConfig('"FooBar"');
        expect.fail('Error not thrown');
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });

    it('should throw an error if the parsed JSON configuration has no `routes` and no `target` properties', async () => {
      try {
        await Application._parseConfig('{"port": 80}');
        expect.fail('Error not thrown');
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });

    it('should throw an error if the parsed YAML configuration has no `routes` and no `target` properties', async () => {
      try {
        await Application._parseConfig('port: 80');
        expect.fail('Error not thrown');
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });

    it('should completes with an array if the parsed JSON configuration is valid', async () => {
      let config = await Application._parseConfig('{"port": 80, "target": 3000}');
      expect(config).to.be.an('array').and.have.lengthOf(1);
      expect(config[0]).to.be.instanceof(Server);
      expect(config[0].port).to.equal(80);
    });

    it('should completes with an array if the parsed YAML configuration is valid', async () => {
      let config = await Application._parseConfig('port: 80\ntarget: 3000');
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

      let config = await Application._parseConfig(settings);
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
