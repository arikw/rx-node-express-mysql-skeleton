/**
 * Extracts a Bearer token from Authorization header.
 */
function getBearerToken(req) {
  const header = req.headers.authorization ?? '';
  const match = header.match(/^Bearer (.+)$/i);
  return match ? match[1] : null;
}


async function ensureAuthenticated(req, res, next) {
  try {
    const token = getBearerToken(req);
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (token !== `Bearer ${process.env.API_BEARER_TOKEN}`) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
        error: 'UNAUTHORIZED'
      });
    }
    return next();
  } catch (err) {
    return res.status(401).json(res, { error_code: 1311, message: 'User not authenticated: Invalid or expired ID token' });
  }
}

module.exports = { ensureAuthenticated };