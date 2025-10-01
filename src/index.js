require('dotenv').config();
const loaders = require('./loaders/index.js');

async function init() {
  await loaders.init();
}

init();