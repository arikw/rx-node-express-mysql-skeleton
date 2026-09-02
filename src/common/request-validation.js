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

/**
 * Checks that no unknown params were given, PER LOCATION.
 *
 * A name declared for the body is unknown in the query string, and vice
 * versa. Comparing names alone would let `?token=x` pass alongside a correct
 * body, which matters for a credential: by the time this runs, a value in the
 * URL is in the access log of every hop it crossed.
 *
 * A value that arrives ONLY in the wrong location was already refused, by the
 * field validator rather than by this check -- `body('x')` reads the body,
 * finds nothing and fails. That behaviour is unchanged.
 */
function strictValidationMW(...middlewares) {
  const locations = ['body', 'params', 'query'];
  return validationMW(...middlewares,
    (req, res, next) => {

      const missing = [];
      const unknown = [];

      for (const location of locations) {
        // What this location declares, asked for one location at a time --
        // which is what makes the comparison location-aware.
        const declared = Object.keys(matchedData(
          req,
          { locations: [location], includeOptionals: true, onlyValidData: false }
        ));
        const declaredMandatory = Object.keys(matchedData(
          req,
          { locations: [location], includeOptionals: false, onlyValidData: false }
        ));

        // JSON round-trip drops undefined values, as the merged version did.
        const supplied = Object.keys(JSON.parse(JSON.stringify(req[location] ?? {})));

        for (const name of supplied) {
          if (!declared.includes(name)) {
            // Named with its location, so "token" arriving in the query
            // string does not read as the body field of the same name.
            unknown.push(`${location}.${name}`);
          }
        }
        for (const name of declaredMandatory) {
          if (!supplied.includes(name)) {
            missing.push(`${location}.${name}`);
          }
        }
      }

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
  
