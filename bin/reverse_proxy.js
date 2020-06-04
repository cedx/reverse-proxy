#!/usr/bin/env node
import cluster from "cluster";
import {main} from "../lib/cli/main.js";

/**
 * Application entry point.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
	const id = cluster.isMaster ? "master" : `worker:${cluster.worker.id}`;
	process.title = `reverse_proxy/${id}`;
	return new Application().run();
}

// Start the application.
main().catch(err => {
	console.error(err.message);
	process.exitCode = 1;
});
