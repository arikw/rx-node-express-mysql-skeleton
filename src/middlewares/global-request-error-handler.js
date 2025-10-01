// https://expressjs.com/en/guide/error-handling.html

function clientErrorHandler(err, req, res, next) {
  
  const errorResponse = {
    status: err.status || 'error',
    message: (typeof err === 'string') ? err : err.message
  };

  if (process.env.NODE_ENV === 'development') {
    Object.assign(errorResponse, {
      error: JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    });
  }

  res.status(err.statusCode || 500).json(errorResponse);

  console.error('------ ERROR -------');
  err.message = err.rawMessage || err.message;
  if (err.stack) {
    console.error(err.stack);
  }

  console.error(JSON.stringify(errorResponse, true, 2));

}

module.exports = clientErrorHandler;
