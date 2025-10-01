const 
  { isOriginAllowed } = require('../common/security.js'),
  middlewares = [];

middlewares.push(require('helmet')({
  hsts: false
}));

// Add CORS headers
middlewares.push(require('cors')((req, optionsCallback) => optionsCallback(null, {
  // Check if the request origin is whitelisted explicitly
  origin: async (origin, callback) => {
    const isAllowed = isOriginAllowed(origin) || (process.env.ALLOW_INSECURE_CORS === '1');

    if (!isAllowed && (process.env.NODE_ENV === 'development')) {
      console.log(`Warning: origin ${origin} rejected! ip: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}, agent: ${req.headers['user-agent']}`);
    }
    callback(!isAllowed ? new Error('Internal error 54893') : null, isAllowed);
  },
  credentials: true,
  exposedHeaders: ['X-RateLimit-Reset']
})));

middlewares.push(require('express-rate-limit')({
  windowMs: 30 * 1000, // 1 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 1000 // limit each IP to 1000 requests per windowMs
}));

module.exports = middlewares;