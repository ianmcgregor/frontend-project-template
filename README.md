# Frontend Project Template

A small framework-agnostic project template for front end web apps or sites using Gulp and Browserify.

## Set up

### Prerequisites

* [Node](http://nodejs.org/)
* [Gulp](http://gulpjs.com/)
* [Browserify](http://browserify.org/)
* [Karma](http://karma-runner.github.io/)

### Getting started

From a terminal or command prompt at the project root run:

```shell
$ npm install
```

## Contents

### Structure

* `/dist`  The webroot
* `/src`   Unminified source files
* `/tasks` Individual Gulp tasks
* `/test`  Unit Test specifications

`.gitinclude` files are used to include some otherwise empty directories in the repository in order to define a reusable project structure.

### CSS

The default CSS structure and build is based on [SUIT CSS](https://github.com/suitcss/) conventions. [Normalize](http://necolas.github.io/normalize.css/) and [SUIT base](https://github.com/suitcss/base/) are included as a basis for the project CSS.

### Modernizr

A [simple modernizr version](http://modernizr.com/download/#-printshiv-cssclasses-addtest) is included by default in the project in `dist/js/modernizr/`. It includes the standard HTML5 shim/shiv, CSSClasses and addTest.

If the project requires more features from Modernizr, replace the included file, using <http://modernizr.com/download/#-printshiv-cssclasses-addtest> as a base.

### Additional libraries

Any additional libaries can be installed through npm or bower, or if a standalone or custom build is required, added in a new folder in `src/js/lib/`.

## Usage

### Building

Gulp is used to run the build tasks for the project.

Starts the build, connect and watch tasks:

```shell
$ gulp
```

Builds CSS and minified JS bundle, uglified and cleaned of debug logs and sourcemaps:

```shell
$ gulp build --min
```
Individual tasks:

```shell
# Builds the JS and CSS to dist then exits:
$ gulp build

# Starts a simple web server that reloads when changes are made:
$ gulp connect

# Rebuilds bundles automatically when changes are made:
$ gulp watch

# Builds CSS bundle to `dist/css/styles.css`:
$ gulp css

# Builds JS bundle to `dist/js/bundle.js`:
$ gulp js
```

### Linting

[JSHint](https://github.com/JSHint), [JSCS](http://jscs.info/) and [CSSLint](https://github.com/CSSLint) are setup to lint the working files in `src/` and to ignore bundles and libraries.

```shell
$ gulp lint
```

A detailed report highlighting any problems will be output to the console.

### Testing

A testing set up is included, utilising the [Karma](https://github.com/karma-runner/karma) test runner, [Mocha](http://visionmedia.github.io/mocha/) framework and [Chai](http://chaijs.com/) assertion library.

```shell
$ npm install -g karma-cli
$ karma start
```
A report highlighting any failed test will be output to the console. Karma will keep running until the task is terminated and will rerun the tests when files are saved.
