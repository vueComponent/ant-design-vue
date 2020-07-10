export function getValueFromEvent(e) {
  // To support custom element
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}

export function getErrorStrs(errors) {
  if (errors) {
    return errors.map(e => {
      if (e && e.message) {
        return e.message;
      }
      return e;
    });
  }
  return errors;
}

export function getParams(ns, opt, cb) {
  let names = ns;
  let options = opt;
  let callback = cb;
  if (typeof names === 'string') {
    names = [names];
  }
  if (cb === undefined) {
    if (typeof names === 'function') {
      callback = names;
      options = {};
      names = undefined;
    } else if (Array.isArray(names)) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options = options || {};
      }
    } else {
      callback = options;
      options = names || {};
      names = undefined;
    }
  }
  return {
    names,
    options,
    callback,
  };
}

export function hasRules(validate) {
  if (validate) {
    return validate.some(item => {
      return item.rules && item.rules.length;
    });
  }
  return false;
}
