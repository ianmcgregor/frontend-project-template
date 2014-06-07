# Frontend Project Template

A small framework-agnostic project template for front end web apps or sites using Gulp and Browserify.

## Set up

### Prerequisites

* [Node](http://nodejs.org/)
* [Bower](https://github.com/bower/bower)
* [Gulp](http://gulpjs.com/)
* [Browserify](http://browserify.org/)
* [Karma](http://karma-runner.github.io/)

### Getting started

From a terminal or command prompt at the project root run:

```shell
$ npm install
$ bower install
```

## What is included

### Structure

* `/dist` - The webroot
* `/dist/css` - Minified/bundled CSS
* `/dist/js` - Minified/bundled JavaScript
* `/src` - Unminified source files
* `/src/css` - CSS source files
* `/src/js` - JavaScript source files
* `/src/vendor` - Bower dependencies
* `/test` - Unit Test specifications

`.gitinclude` files are used to include some otherwise empty directories in the repository in order to define a reusable project structure. `.gitinclude` files can and should be removed if other files are put in the directory, or if the directory itself is not needed for the specific project.

### CSS

The default CSS structure and build is based on [SUIT CSS](https://github.com/suitcss/) conventions. [Normalize](http://necolas.github.io/normalize.css/) and [SUIT base](https://github.com/suitcss/base/) are included (via bower) as a basis for the project CSS.

### Modernizr

A [simple modernizr version](http://modernizr.com/download/#-printshiv-cssclasses-addtest) is included by default in the project, in `dist/js/modernizr/`. It includes the standard HTML5 shim/shiv, CSSClasses and addTest, as well as a custom test intended to detect 'modern' browsers.

If the project requires more features from Modernizr, replace the included file, using <http://modernizr.com/download/#-printshiv-cssclasses-addtest> as a base.

### Additional libraries

Any additional libaries can be installed through bower or npm.
If a standalone or custom build is required, it can be added in a new folder in `src/js/lib/`.

## Usage

### Building

Gulp is used to run the build tasks for the project.

* `gulp css` - builds CSS bundle to `dist/css/styles.css`
* `gulp js` - builds JavaScript bundle to `dist/js/bundle.js`  
* `gulp js-release` - builds minified JavaScript bundle, cleaned of debug code (such as console.log)
* `gulp connect` - runs a webserver with LiveReload
* `gulp watch` - rebuilds bundles automatically when changes are made
* `gulp` - starts both the connect and watch tasks.

### Linting

[JSHint](https://github.com/JSHint) and [CSSLint](https://github.com/CSSLint) are setup to lint the working files in `src/` and to ignore bundles and libraries.

```shell
$ gulp jshint
$ gulp csslint
```

A detailed report highlighting any problems will be output to the console.

### Testing

A testing set up is included, utilising the [Karma](https://github.com/karma-runner/karma) test runner, [Mocha](http://visionmedia.github.io/mocha/) framework and [Chai](http://chaijs.com/) assertion library.

```shell
$ npm install -g karma-cli
$ karma start
```
A report highlighting any failed test will be output to the console.
