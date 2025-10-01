const log = console.log, 
  error = console.error,
  warn = console.warn,
  info = console.info,
  debug = console.debug;

console.disable = function () {
  this.log = () => {};
  this.error = () => {};
  this.warn = () => {};
  this.info = () => {};
  this.debug = () => {};
};

console.enable = function () {
  this.log = log;
  this.error = error;
  this.warn = warn;
  this.info = info;
  this.debug = debug;
  return this;
};

// Global fixtures to suppress logs. For more details, see https://mochajs.org/#global-fixtures
exports.mochaGlobalSetup = function () {
  Date.now = () => 1759229840863;
  Date.prototype.toISOString = () => '2025-09-30T10:56:29.616Z';
  Math.random = () => 0.5;
  console.disable();
};

exports.mochaGlobalTeardown = function () {
  console.enable();
};
