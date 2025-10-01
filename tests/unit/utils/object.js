const {
  isObject,
  hasOnlyAllowedKeys
} = require('../../../src/utils/object.js');

const
  chai = require('chai'),
  expect = chai.expect;

describe('src/utils/object.js', () => {

  it('isObject() returns false for non objects', async () => {

    expect(isObject(true), 'true').to.be.false;
    expect(isObject(123), '123').to.be.false;
    expect(isObject([]), '[]').to.be.false;
    expect(isObject(''), '""').to.be.false;

  });

  it('isObject() returns true for objects', async () => {

    expect(isObject({}), '{}').to.be.true;

  });

  it('hasOnlyAllowedKeys() returns true for objects with exact allowed keys', async () => {
    expect(hasOnlyAllowedKeys({ a: 1, b: 2 }, ['a', 'b'])).to.be.true;
  });

  it('hasOnlyAllowedKeys() returns true for objects with partial allowed keys', async () => {
    expect(hasOnlyAllowedKeys({ a: 1 }, ['a', 'b'])).to.be.true;
  });

  it('hasOnlyAllowedKeys() returns false for objects with non allowed keys', async () => {
    expect(hasOnlyAllowedKeys({ c: 1 }, ['a', 'b'])).to.be.false;
    expect(hasOnlyAllowedKeys({ a: 1, b: 2, c: 3 }, ['a', 'b'])).to.be.false;
  });

});