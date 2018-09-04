#!/usr/bin/env node
'use strict';

const cluster = require('cluster');
const {Application} = require('../lib');

/**
 * Application entry point.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
  const id = cluster.isMaster ? 'master' : `worker:${cluster.worker.id}`;
  process.title = `reverse-proxy/${id}`;
  return new Application().run();
}

// Start the application.
main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
