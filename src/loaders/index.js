async function init () {
  await require('../db/db.js').init();
  await require('./server.js').init();
}

module.exports = {
  init
};