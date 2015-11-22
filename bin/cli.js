#!/usr/bin/env node

/**
 * Command line interface.
 * @module bin/cli
 */
'use strict';

// Module dependencies.
const Application=require('../lib/app');

// Public interface.
if(module===require.main) {
  process.title='reverse-proxy.js';
  new Application().run();
}
else module.exports=Application;
