function copy(obj, replacer) {
  return JSON.parse(JSON.stringify(obj, replacer));
}

function removeUndefined(obj) {
  return copy(obj);
}

function copyAndFreeze(obj) {
  return deepFreeze(copy(obj));
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
function deepFreeze(obj, root = true) {

  const target = root ? copy(obj) : obj;

  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(target);

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = target[name];

    if (value && typeof value === 'object') {
      deepFreeze(value, false);
    }
  }

  return Object.freeze(target);
}

function isObject(obj) {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}

/**
 * 
 * @param {*} obj 
 * @param {Array|Function} allowedKeys an array of allowed keys or a callback
 * @param {*} allowMissing object keys can have missing keys defined in the allowedKeys array
 * @returns true if object has only allowed keys
 */
function hasOnlyAllowedKeys(obj, allowedKeys, allowMissing = true) {
  
  const objKeys = Object.keys(obj);
  const filteringFn = Array.isArray(allowedKeys) ?
    allowedKeys.includes.bind(allowedKeys) :
    allowedKeys;

  const unknownKeys = objKeys.filter(objKey => !filteringFn(objKey));
  const hasUnknownKeys = (unknownKeys.length > 0);
  if (hasUnknownKeys) {
    return false;
  }

  if (Array.isArray(allowedKeys)) {
    const missingKeys = allowedKeys.filter(key => !(objKeys.includes(key)));
    const hasMissingKeys = (missingKeys.length > 0);
    if (!allowMissing && hasMissingKeys) {
      return false;
    }
  }

  return true;
}

function isEmpty(obj) {
  for (const key in obj) {
    return false;
  }
  return true;
}

module.exports = {
  copy,
  copyAndFreeze,
  deepFreeze,
  isObject,
  removeUndefined,
  hasOnlyAllowedKeys,
  isEmpty
};