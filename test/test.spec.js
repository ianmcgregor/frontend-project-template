const expect = require('chai').expect;
const test = require('../src').test;

describe('A test suite', () => {
    // before(() => {});
    // after(() => {});
    // beforeEach(() => {});
    // afterEach(() => {});

    it('should pass', () => {
        expect(true).to.be.true;
        expect(test()).to.eql('hello');
    });
});
