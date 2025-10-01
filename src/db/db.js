const mysql = require('rx-mysql');

let instance = null;

async function init(config = {}) {
  if (instance) {
    throw new Error('Database connection already initialized');
  }
  instance = (await mysql(config));
  return instance;
}

module.exports = new Proxy({}, {
  get: function (target, prop, receiver) {
    if (prop === 'init') { return init; }
    if (!instance) { throw new Error('Database connection not initialized. Call init() first.'); }
    return Reflect.get(instance, prop, receiver);
  }
});