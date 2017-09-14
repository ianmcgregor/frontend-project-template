# Frontend Project Template

A small framework-agnostic project template for front-end web apps and sites.


## Contents

### Main folders

* `/dist`  The build folder
* `/docs`  Documentation
* `/scripts` Build scripts
* `/src`   Source files
* `/test`  Unit tests

### Directory Structure

```
├── dist
├── docs
├── scripts
│   ├── audio.js
│   ├── copy.js
│   ├── html.js
│   ├── img-convert.js
│   ├── tinify.js
│   └── utils.js
├── src
│   ├── components
│   ├── styles
│   │   ├── fonts
│   │   ├── elements.css
│   │   ├── fonts.css
│   │   ├── media.css
│   │   ├── props.css
│   │   ├── sections.css
│   │   └── utils.css
│   ├── utils
│   │   └── polyfills
│   │       └── index.js
│   ├── views
│   ├── favicon-32.png
│   ├── favicon-152.png
│   ├── index.css
│   ├── index.html
│   ├── index.js
│   └── robots.txt
├── test
│   └── test.spec.js
├── .babelrc
├── .editorconfig
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .stylelintrc
├── bs-config.js
├── karma.conf.js
├── LICENSE
├── modernizr-config.json
├── package.json
├── postcss.config.js
└── README.md
```

`.gitignore` files are used to include some otherwise empty directories in the repository in order to define a reusable project structure.

## Set up

### Prerequisites

* [Node](http://nodejs.org/)
* [Browserify](http://browserify.org/)
* [Karma](http://karma-runner.github.io/)

### Getting started

From a terminal or command prompt at the project root run:

```shell
npm install
```

### HTML

Only an index page is included in the default HTML structure, in `src/index.html`. By default, `lodash` template variables are used to configure a static index page which is written to `dist/index.html`.

### CSS

The default CSS structure and build is based on [SUIT CSS](https://github.com/suitcss/) conventions. [Normalize](http://necolas.github.io/normalize.css/) and [SUIT base](https://github.com/suitcss/base/) are included as a basis for the project CSS.

Base styles and utilities are included in `src/styles/`. All other CSS files are in their respective component folders.

[PostCSS](https://github.com/postcss/postcss) transpiles the CSS to support future syntax and vendor prefixes.

### JS

Polyfills and utilities are included in `src/utils/`. All other JS files are in their respective component folders.

#### Babel

[Babel](https://babeljs.io/) is included to transpile es6/7. The default presets are es2015 and stage-0.

#### Vendors

A separate `vendor.js` file can be built by configuring the vendor section in `package.json`.

#### Modernizr

A [simple modernizr version](http://modernizr.com/download?-touchevents-addtest-setclasses-testprop-dontmin-cssclassprefix:Modernizr-) is included in the project in `modernizr-config.json`. It includes the standard HTML5 shim/shiv, CSSClasses, testProp and addTest. It also includes `touchevents` to exclude hover states from mobile devices. Modernizr CSS classNames are prefixed with `Modernizr-` to make them easy to recognise.

#### Utilities

Utility package [usfl](https://github.com/ianmcgregor/usfl) is included by default.

### Assets

Static assets such as icons are included in their respective component folder in `src/components`. They are optimised and copied into folders in `dist/img` as part of the build process.

## Usage

### Building

Npm is used to run the build tasks for the project. The tasks are all defined in `package.json`, with scripts for more complicated tasks are contained in the `scripts` directory.

Runs the build task, starts the watch tasks and dev server:

```shell
npm start
```

Processes assets and builds CSS and JS bundles to the `dist` folder:

```shell
npm run build
```

Deletes `dist` and recreates folder structure:

```shell
npm run clean
```

Starts a simple web server that reloads when changes are made:

```shell
npm run browsersync
```

Builds CSS bundle to `dist/css/styles.css`:

```shell
npm run css
```

Builds JS bundle to `dist/js/bundle.js`:

```shell
npm run js
```

Generates modernizr.js and outputs to `dist/js`:

```shell
npm run modernizr
```

Renders HTML templates and copies to `dist`:

```shell
npm run html
```

Copies files to `dist`:

```shell
npm run copy
```

Reformats and (optionally) resizes images and copies to `dist/img`:

```shell
npm run img:convert
```

Tinifies images and copies to `dist/img`:

```shell
npm run img:tinify
```

Converts audio files to ogg and mp3 and outputs to `dist/audio`:

```shell
npm run audio
```

### Linting

[ESLint](http://eslint.org/) and [stylelint](http://stylelint.io/) are setup to lint the working files in `src/`. Rules can be configured by editing the `.eslintrc` and `.stylelintrc` files in the project root.

```shell
npm run lint
npm run lint:js
npm run lint:css
```

A detailed report highlighting any problems will be output to the console.

### Testing

A testing set up is included, utilising the [Karma](https://github.com/karma-runner/karma) test runner, [Mocha](http://mochajs.org/) framework and [Chai](http://chaijs.com/) assertion library. A report highlighting any failed test will be output to the console.

Single run, with linting:

```shell
npm test
```

Keep running until the task is terminated and rerun tests when files are changed:

```shell
npm test:debug
```
