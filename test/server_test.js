import {strict as assert} from "assert";
import {Server} from "../lib/index.js";

/** Tests the features of the `Server` class. */
describe("Server", function() {
	this.timeout(15000);

	describe(".address", function() {
		it("should have an "any IPv4" address as the default address", function() {
			assert.equal(new Server().address, Server.defaultAddress);
		});

		it("should have the same host as the specified one", function() {
			assert.equal(new Server({address: "localhost"}).address, "localhost");
		});
	});

	describe(".listening", function() {
		it("should return whether the server is listening", async function() {
			const server = new Server({address: "127.0.0.1", port: 0});
			assert.equal(server.listening, false);

			await server.listen();
			assert(server.listening);

			await server.close();
			assert.equal(server.listening, false);
		});
	});

	describe(".port", function() {
		it("should have 8080 as the default port", function() {
			assert.equal(new Server().port, Server.defaultPort);
		});

		it("should have the same port as the specified one", function() {
			assert.equal(new Server({port: 3000}).port, 3000);
		});
	});

	describe(".routes", function() {
		it("should be empty by default", function() {
			assert.equal(new Server().routes.size, 0);
		});

		it("should create a default route if a target is specified", function() {
			const routes = new Server({target: 9000}).routes;
			assert.equal(routes.size, 1);

			const route = routes.get("*");
			assert.notEqual(route, undefined);
			assert.equal(route.uri.href, "http://127.0.0.1:9000");
		});

		it("should normalize the specified targets", function() {
			const routes = new Server({routes: {"belin.io": "belin.io:1234"}}).routes;
			const route = routes.get("belin.io");
			assert.notEqual(route, undefined);
			assert.equal(route.uri.href, "http://belin.io:1234");
		});
	});
});
