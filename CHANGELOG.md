# Changelog
This file contains highlights of what changes on each version of the [Reverse-Proxy.js](https://www.npmjs.com/package/@cedx/reverse-proxy) package.

## Version 2.0.0
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: using ES2017 features, like async/await functions.
- Improved the build system.
- Updated the package dependencies.

## Version 1.2.0
- Replaced the [Codacy](https://www.codacy.com) code coverage service by the [Coveralls](https://coveralls.io) one.
- Updated the package dependencies.

## Version 1.1.0
- Added the `Server#listening` property.

## Version 1.0.0
- Breaking change: changed the HTTP status code used when an error occurred.
- Breaking change: ported the [CommonJS](https://nodejs.org/api/modules.html) modules to ES2015 format.
- Breaking change: ported the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based APIs to [Observables](http://reactivex.io/intro.html).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: replaced the test classes by plain tests.
- Breaking change: the `Server` class is not anymore an `EventEmitter`.
- Added a build task for fixing the coding standards issues.
- Added the `onClose`, `onError`, `onListen` and `onRequest` event streams to the `Server` class.
- Replaced [JSDoc](http://usejsdoc.org) documentation generator by [ESDoc](https://esdoc.org).
- Replaced [JSHint](http://jshint.com) linter by [ESLint](http://eslint.org).
- Updated the package dependencies.

## Version 0.7.0
- Breaking change: renamed the `Server.DEFAULT_HOST` property to `DEFAULT_ADDRESS`.
- Breaking change: renamed the `Server.host` property to `address`.
- Breaking change: renamed the `-H, --host` command line option to `-a, --address`.
- Upgraded the package dependencies.

## Version 0.6.0
- Breaking change: using more ES2015 features, like default parameters and destructuring assignment.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Turned the package into a [scoped one](https://docs.npmjs.com/getting-started/scoped-packages).
- Added the `DEFAULT_HOST` and `DEFAULT_PORT` constants to the `Server` class.
- Replaced [SonarQube](http://www.sonarqube.org) code analyzer by [Codacy](https://www.codacy.com) service.

## Version 0.5.4
- Fixed some bugs.
- Upgraded the package dependencies.

## Version 0.5.3
- Improved the way the server address is reported.
- The application instance is now exposed as `global.app` property.

## Version 0.5.2
- Restored support for configuration files in [JSON](http://www.json.org) format.
- Upgraded the package dependencies.

## Version 0.5.1
- The `port` parameter of the `Server#listen` method is now optional.
- Added unit tests.
- Added support for code coverage.
- Added support for [Travis CI](https://travis-ci.org) continuous integration.

## Version 0.5.0
- Breaking change: using ES2015 features, like arrow functions, block-scoped binding constructs, classes and template strings.
- Breaking change: raised the required [Node.js](http://nodejs.org) version.
- Breaking change: changed the whole API of `Application` class.
- Breaking change: changed the format of `Server.request` event.
- Breaking change: changed the format of configuration files to [YAML](http://yaml.org).
- Added support for [SonarQube](http://www.sonarqube.org) code analyzer.
- Changed the documentation system for [JSDoc](http://usejsdoc.org).
- Changed licensing for the [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Version 0.4.1
- Upgraded the package dependencies.

## Version 0.4.0
- Raised the required [Node.js](http://nodejs.org) version.
- Removed the dependency on [`promise`](https://www.npmjs.com/package/promise) module.
- Upgraded the package dependencies.

## Version 0.3.0
- Breaking change: ported the callback-based API to [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
- Using [Gulp.js](http://gulpjs.com) as build system.
- Fixed [issue #1](https://github.com/cedx/reverse-proxy.js/issues/1): using a Unix system for publishing the package on [npm](https://www.npmjs.com).
- Upgraded the package dependencies.

## Version 0.2.1
- Added `Application` class, used in CLI script.
- Added sample configuration files.
- Updated the documentation.

## Version 0.2.0
- The `Server` class and CLI now uses port 3000 as default.
- Added `Server.listening` event.
- Improved the event handling.
- Updated the package dependencies.
- Breaking change: removed `Server.upgrade` event.
- Using DocGen.js to generate the API reference.

## Version 0.1.0
- Initial release.
