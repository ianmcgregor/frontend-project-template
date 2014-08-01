'use strict';

var _ = require('lodash'),
    lib = require('lib'),
    signals = require('signals');

console.log('Hello world!');
console.log('lodash:', _.uniqueId());
console.log('lib:', lib.MathUtils);
console.log('signals:', new signals.Signal());
