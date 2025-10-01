const { urlParser } = require('../utils/url.js');

const clientWhitelist = [ // production
  process.env.SERVER_ORIGIN, // exact match
].concat( // non-production
  ((process.env.NODE_ENV !== 'production') || (process.env.ALLOW_INSECURE_CORS === '1')) ? [
    /^((127\.)|(10\.)|(172\.1[6-9]\.)|(172\.2[0-9]\.)|(172\.3[0-1]\.)|(192\.168\.))([0-9.]*)($|:[0-9]+$)/, // private ips all ports
    /^::1($|:[0-9]+$)/, // ::1:*
    /^localhost($|:[0-9]+$)/ // localhost or localhost:*
  ] : []
);

const isOriginAllowed = function (origin) {
  if (!origin) {
    // directly browsed
    return true;
  }

  const host = urlParser(origin).host;
  return !!clientWhitelist.find(item => ((item instanceof RegExp) ? item.test(host) : (item === host)));
};

module.exports = { isOriginAllowed };