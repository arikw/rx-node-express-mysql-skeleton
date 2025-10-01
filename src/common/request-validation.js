const expressValidator = require('express-validator');

const { validationResult, matchedData } = expressValidator;

function validationMW(...middlewares) {
  return [
    ...middlewares,
    (req, res, next) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Param(s) validation error(s)',
          error: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }
      next();
    }
  ];
}

/*
  Checks that no unknown params were given
*/
function strictValidationMW(...middlewares) {
  const locations = ['body', 'params', 'query'];
  return validationMW(...middlewares,
    (req, res, next) => {

      // All the params that were checked by the validation middlewares
      const mandatoryOnlyParamNames = Object.keys(matchedData(
        req,
        { locations, includeOptionals: false, onlyValidData: false }
      ));

      const allParamNames = Object.keys(matchedData(
        req,
        { locations, includeOptionals: true, onlyValidData: false }
      ));

      // All the request params given - body, query etc.
      const existingParams = {};
      for (const location of locations) {
        Object.assign(existingParams, req[location] );
      }

      const existingParamNames = Object.keys(JSON.parse(JSON.stringify(existingParams))  /* removes undefined values */);
      const unknown = existingParamNames.filter(item => allParamNames.indexOf(item) === -1);
      const missing = mandatoryOnlyParamNames.filter(item => (existingParamNames.indexOf(item) === -1));

      if ((missing.length > 0) || (unknown.length > 0)) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing or unknown param(s) found',
          error: 'STRICT_VALIDATION_ERROR',
          ...(process.env.NODE_ENV !== 'production' ? { details: { missing, unknown } } : {})
        });
      }
      next();
    });
}

module.exports = {
  validationMW,
  strictValidationMW
};
  