'use strict';

var _ = require('lodash'),
    usfl = require('usfl'),
    signals = require('signals');

console.log('Hello world!');
console.log('lodash:', _.uniqueId());
console.log('usfl:', usfl.math);
console.log('signals:', new signals.Signal());
