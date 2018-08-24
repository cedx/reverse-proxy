# Changelog

## Version [10.0.0](https://github.com/cedx/reverse-proxy.js/compare/v9.0.0...v10.0.0)
- Breaking change: ported the source code to [TypeScript](https://www.typescriptlang.org).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: dropped the TODO `--user` CLI argument.
- Breaking change: the `Server` class and CLI now uses port `8080` as default.
- Added the `Application.instance` property.
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Added support for multithreading: implements the [feature request #7](https://github.com/cedx/reverse-proxy.js/issues/7).
- Fixed the [issue #6](https://github.com/cedx/reverse-proxy.js/issues/6): wrong executable name in the documentation.
- Ported the unit tests to classes with experimental decorators.
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the package dependencies.
- Using the `fs` promises API.

## Version [9.0.0](https://github.com/cedx/reverse-proxy.js/compare/v8.0.0...v9.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: renamed the `Application#env` property to `environment`.
- Updated the package dependencies.

## Version [8.0.0](https://github.com/cedx/reverse-proxy.js/compare/v7.0.0...v8.0.0)
- Breaking change: using camel case instead of studly caps for static properties.
- Updated the package dependencies.

## Version [7.1.0](https://github.com/cedx/reverse-proxy.js/compare/v7.0.0...v7.1.0)
- Improved the error handling in `Server#listen()` method.
- Updated the package dependencies.

## Version [7.0.0](https://github.com/cedx/reverse-proxy.js/compare/v6.1.0...v7.0.0)
- Breaking change: converted the [`Observable`](http://reactivex.io/intro.html)-based API to an `async/await`-based one.
- Breaking change: converted the `Subject` event API to the [`EventEmitter`](https://nodejs.org/api/events.html) one.
- Added the [`#[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property to all classes.
- Changed licensing for the [MIT License](https://opensource.org/licenses/MIT).

## Version [6.1.0](https://github.com/cedx/reverse-proxy.js/compare/v6.0.1...v6.1.0)
- Removed the dependency on [Babel](https://babeljs.io) compiler.
- Updated the package dependencies.

## Version [6.0.1](https://github.com/cedx/reverse-proxy.js/compare/v6.0.0...v6.0.1)
- Fixed a packaging issue.

## Version [6.0.0](https://github.com/cedx/reverse-proxy.js/compare/v5.0.1...v6.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: restored the [Observable](http://reactivex.io/intro.html) APIs.
- Added new unit tests.
- Updated the package dependencies.

## Version [5.0.1](https://github.com/cedx/reverse-proxy.js/compare/v5.0.0...v5.0.1)
- Fixed a code generation bug.
- Updated the package dependencies.

## Version [5.0.0](https://github.com/cedx/reverse-proxy.js/compare/v4.0.1...v5.0.0)
- Breaking change: renamed the `Application#loadConfig` method to `init`.
- Breaking change: renamed the `Application#setUser` method to `_setUser`.
- Breaking change: renamed the `Application#startServers` method to `_startServers`.
- Added the `Application#servers` property.
- Added new unit tests.

## Version [4.0.1](https://github.com/cedx/reverse-proxy.js/compare/v4.0.0...v4.0.1)
- Fixed the [issue #5](https://github.com/cedx/reverse-proxy.js/issues/5): regression in the `Application#setUser` method.

## Version [4.0.0](https://github.com/cedx/reverse-proxy.js/compare/v3.1.0...v4.0.0)
- Breaking change: removed the `Application#log` method.
- The response object is also provided in `request` events.
- The routing table of a `Server` is now exposed as the `routes` property.
- Using the [Morgan](https://www.npmjs.com/package/morgan) module to handle the logging.

## Version [3.1.0](https://github.com/cedx/reverse-proxy.js/compare/v3.0.0...v3.1.0)
- Added support for the [Node Security Platform](https://nodesecurity.io) reports.
- Updated the package dependencies.

## Version [3.0.0](https://github.com/cedx/reverse-proxy.js/compare/v2.2.0...v3.0.0)
- Breaking change: dropped the dependency on [Observables](http://reactivex.io/intro.html).
- Breaking change: renamed the `listen` event to `listening`.
- Breaking change: the `Server` class is now an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

## Version [2.2.0](https://github.com/cedx/reverse-proxy.js/compare/v2.1.0...v2.2.0)
- Added support of HTTP headers: feature request from [issue #4](https://github.com/cedx/reverse-proxy.js/issues/4).
- Fixed a bug in the reading of the SSL certificates.

## Version [2.1.0](https://github.com/cedx/reverse-proxy.js/compare/v2.0.0...v2.1.0)
- Using asynchronous file access in `Application#_parseConfig` method.
- Updated the package dependencies.

## Version [2.0.0](https://github.com/cedx/reverse-proxy.js/compare/v1.2.0...v2.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: removed the `global.app` property.
- Breaking change: using ES2017 features, like async/await functions.
- Improved the build system.
- Ported the unit test assertions from [TDD](https://en.wikipedia.org/wiki/Test-driven_development) to [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development).
- Removed the dependency on the `forever` module.
- Removed the dependency on the `gulp-load-plugins` module.
- Updated the package dependencies.

## Version [1.2.0](https://github.com/cedx/reverse-proxy.js/compare/v1.1.0...v1.2.0)
- Replaced the [Codacy](https://www.codacy.com) code coverage service by the [Coveralls](https://coveralls.io) one.
- Updated the package dependencies.

## Version [1.1.0](https://github.com/cedx/reverse-proxy.js/compare/v1.0.0...v1.1.0)
- Added the `Server#listening` property.

## Version [1.0.0](https://github.com/cedx/reverse-proxy.js/compare/v0.7.0...v1.0.0)
- Breaking change: changed the HTTP status code used when an error occurred.
- Breaking change: ported the [CommonJS](https://nodejs.org/api/modules.html) modules to ES2015 format.
- Breaking change: ported the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based APIs to [Observables](http://reactivex.io/intro.html).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: replaced the test classes by plain tests.
- Breaking change: the `Server` class is not anymore an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).
- Added a build task for fixing the coding standards issues.
- Added the `onClose`, `onError`, `onListen` and `onRequest` event streams to the `Server` class.
- Replaced [JSDoc](http://usejsdoc.org) documentation generator by [ESDoc](https://esdoc.org).
- Replaced [JSHint](http://jshint.com) linter by [ESLint](http://eslint.org).
- Updated the package dependencies.

## Version [0.7.0](https://github.com/cedx/reverse-proxy.js/compare/v0.6.0...v0.7.0)
- Breaking change: renamed the `Server.DEFAULT_HOST` property to `DEFAULT_ADDRESS`.
- Breaking change: renamed the `Server#host` property to `address`.
- Breaking change: renamed the `-H, --host` command line option to `-a, --address`.
- Upgraded the package dependencies.

## Version [0.6.0](https://github.com/cedx/reverse-proxy.js/compare/v0.5.4...v0.6.0)
- Breaking change: using more ES2015 features, like default parameters and destructuring assignment.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Turned the package into a [scoped one](https://docs.npmjs.com/getting-started/scoped-packages).
- Added the `DEFAULT_HOST` and `DEFAULT_PORT` constants to the `Server` class.
- Replaced [SonarQube](http://www.sonarqube.org) code analyzer by [Codacy](https://www.codacy.com) service.

## Version [0.5.4](https://github.com/cedx/reverse-proxy.js/compare/v0.5.3...v0.5.4)
- Fixed some bugs.
- Upgraded the package dependencies.

## Version [0.5.3](https://github.com/cedx/reverse-proxy.js/compare/v0.5.2...v0.5.3)
- Improved the way the server address is reported.
- The application instance is now exposed as `global.app` property.

## Version [0.5.2](https://github.com/cedx/reverse-proxy.js/compare/v0.5.1...v0.5.2)
- Restored support for configuration files in [JSON](https://json.org) format.
- Upgraded the package dependencies.

## Version [0.5.1](https://github.com/cedx/reverse-proxy.js/compare/v0.5.0...v0.5.1)
- The `port` parameter of the `Server#listen` method is now optional.
- Added unit tests.
- Added support for code coverage.
- Added support for [Travis CI](https://travis-ci.com) continuous integration.

## Version [0.5.0](https://github.com/cedx/reverse-proxy.js/compare/v0.4.1...v0.5.0)
- Breaking change: using ES2015 features, like arrow functions, block-scoped binding constructs, classes and template strings.
- Breaking change: raised the required [Node.js](http://nodejs.org) version.
- Breaking change: changed the whole API of `Application` class.
- Breaking change: changed the format of `Server#request` event.
- Breaking change: changed the format of configuration files to [YAML](http://yaml.org).
- Added support for [SonarQube](http://www.sonarqube.org) code analyzer.
- Changed the documentation system for [JSDoc](http://usejsdoc.org).
- Changed licensing for the [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Version [0.4.1](https://github.com/cedx/reverse-proxy.js/compare/v0.4.0...v0.4.1)
- Upgraded the package dependencies.

## Version [0.4.0](https://github.com/cedx/reverse-proxy.js/compare/v0.3.0...v0.4.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Removed the dependency on [`promise`](https://www.npmjs.com/package/promise) module.
- Upgraded the package dependencies.

## Version [0.3.0](https://github.com/cedx/reverse-proxy.js/compare/v0.2.0...v0.3.0)
- Breaking change: ported the callback-based API to [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
- Using [Gulp](https://gulpjs.com) as build system.
- Fixed the [issue #1](https://github.com/cedx/reverse-proxy.js/issues/1): using a Unix system for publishing the package on [npm](https://www.npmjs.com).
- Upgraded the package dependencies.

## Version [0.2.1](https://github.com/cedx/reverse-proxy.js/compare/v0.2.0...v0.2.1)
- Added `Application` class, used in CLI script.
- Added sample configuration files.
- Updated the documentation.

## Version [0.2.0](https://github.com/cedx/reverse-proxy.js/compare/v0.1.0...v0.2.0)
- The `Server` class and CLI now uses port 3000 as default.
- Added `Server#listening` event.
- Improved the event handling.
- Updated the package dependencies.
- Breaking change: removed `Server#upgrade` event.
- Using DocGen.js to generate the API reference.

## Version 0.1.0
- Initial release.
