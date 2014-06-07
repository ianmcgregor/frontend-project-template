'use strict';

var TestMe = require('../src/js/testme.js');

describe('A temporary test suite', function() {
	var testMe = new TestMe();

	it('should pass', function() {
		expect(testMe.sayHello()).to.eql('Hello');
	});
});
