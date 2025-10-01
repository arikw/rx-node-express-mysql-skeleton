const urlParser = function (url) {
  try {
    return new URL(url);
  } catch (ignore) {
    return new URL('err:');
  }
};

module.exports = {
  urlParser
};