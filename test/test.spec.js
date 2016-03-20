const test = require('../src').test;

describe('A test suite', function() {
    before(function() {});
    after(function() {});
    beforeEach(function() {});
    afterEach(function() {});

    it('should pass', function() {
        expect(true).to.be.true;
        expect(test()).to.eql('hello');
    });
});
