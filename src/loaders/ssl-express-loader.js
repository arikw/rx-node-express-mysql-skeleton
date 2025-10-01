const options = {};

// load ssl certs if needed
if (process.env.USE_HTTPS_SERVER === '1') {
  const sslCertName = process.env.SSL_CERT_NAME || 'localhost';

  if (sslCertName) {
    const fs = require('fs');
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    options.key = fs.readFileSync(`../certs/ssl/${sslCertName}/${sslCertName}.key`);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    options.cert = fs.readFileSync(`../certs/ssl/${sslCertName}/${sslCertName}.cert`);
  }
}

module.exports = options;