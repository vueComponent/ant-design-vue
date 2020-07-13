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

export function computedStyle(el, prop) {
  const getComputedStyle = window.getComputedStyle;
  const style =
    // If we have getComputedStyle
    getComputedStyle
      ? // Query it
        // TODO: From CSS-Query notes, we might need (node, null) for FF
        getComputedStyle(el)
      : // Otherwise, we are in IE and use currentStyle
        el.currentStyle;
  if (style) {
    return style[
      // Switch to camelCase for CSSOM
      // DEV: Grabbed from jQuery
      // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
      // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
      prop.replace(/-(\w)/gi, (word, letter) => {
        return letter.toUpperCase();
      })
    ];
  }
  return undefined;
}

export function getScrollableContainer(n) {
  let node = n;
  let nodeName;
  /* eslint no-cond-assign:0 */
  while ((nodeName = node.nodeName.toLowerCase()) !== 'body') {
    const overflowY = computedStyle(node, 'overflowY');
    // https://stackoverflow.com/a/36900407/3040605
    if (
      node !== n &&
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentNode;
  }
  return nodeName === 'body' ? node.ownerDocument : node;
}

// export async function finishOnAllFailed(rulePromises) {
//   return Promise.all(rulePromises).then(errorsList => {
//     const errors = [].concat(...errorsList);

//     return errors;
//   });
// }

// export async function finishOnFirstFailed(rulePromises) {
//   let count = 0;

//   return new Promise(resolve => {
//     rulePromises.forEach(promise => {
//       promise.then(errors => {
//         if (errors.length) {
//           resolve(errors);
//         }

//         count += 1;
//         if (count === rulePromises.length) {
//           resolve([]);
//         }
//       });
//     });
//   });
// }

// export function toArray(value) {
//   if (value === undefined || value === null) {
//     return [];
//   }

//   return Array.isArray(value) ? value : [value];
// }

// export function getNamePath(path) {
//   return toArray(path);
// }
