const isFunction = val => typeof val === 'function';
const onRE = /^on[^a-z]/;
const isOn = key => onRE.test(key);

const cacheStringFunction = fn => {
  const cache = Object.create(null);
  return str => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction(str => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});

const capitalize = cacheStringFunction(str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);

// change from vue sourcecode
function resolvePropValue(options, props, key, value) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, 'default');
    // default values
    if (hasDefault && value === undefined) {
      const defaultValue = opt.default;
      value = opt.type !== Function && isFunction(defaultValue) ? defaultValue() : defaultValue;
    }
    // boolean casting
    if (opt[0 /* shouldCast */]) {
      if (!hasOwn(props, key) && !hasDefault) {
        value = false;
      } else if (opt[1 /* shouldCastTrue */] && (value === '' || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}

export { isOn, cacheStringFunction, camelize, hyphenate, capitalize, resolvePropValue };
