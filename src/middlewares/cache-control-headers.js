module.exports = function cacheControl(req, res, next) {
  res.hooks.on('statusCode', ([ statusCode ]) => {
    if (req.headers['x-auth'] && (process.env.NODE_ENV === 'development')) {
      return next('trying to cache response with private data (X-AUTH header exist)');
    }
    if (
      (['GET', 'OPTIONS'].includes(req.method.toUpperCase())) &&
      (statusCode < 400)
      // DO NOT test auth header (!req.headers['x-auth']) because CF doesn't consider custom headers
      // as new requests if they change
    ) {
      res.set('Cache-Control', 'public, max-age=5, s-maxage=31536000');
    }
  });
  next();
};