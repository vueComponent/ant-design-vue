import type { VueNode } from './type';
export const isFunction = val => typeof val === 'function';
export const controlDefaultValue = Symbol('controlDefaultValue') as any;
export const isArray = Array.isArray;
export const isString = val => typeof val === 'string';
export const isSymbol = val => typeof val === 'symbol';
export const isObject = val => val !== null && typeof val === 'object';
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
    if (opt.type === Boolean) {
      if (!hasOwn(props, key) && !hasDefault) {
        value = false;
      } else if (value === '') {
        value = true;
      }
    }
  }
  return value;
}

export function getDataAndAriaProps(props) {
  return Object.keys(props).reduce((memo, key) => {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      memo[key] = props[key];
    }
    return memo;
  }, {});
}

export function toPx(val) {
  if (typeof val === 'number') return `${val}px`;
  return val;
}

export function renderHelper<T = Record<string, any>>(
  v: VueNode | ((arg0: T) => VueNode),
  props: T = {} as T,
  defaultV?: any,
) {
  if (typeof v === 'function') {
    return v(props);
  }
  return v ?? defaultV;
}
export function wrapPromiseFn(openFn: (resolve: VoidFunction) => VoidFunction) {
  let closeFn: VoidFunction;

  const closePromise = new Promise<boolean>(resolve => {
    closeFn = openFn(() => {
      resolve(true);
    });
  });

  const result: any = () => {
    closeFn?.();
  };

  result.then = (filled: VoidFunction, rejected: VoidFunction) =>
    closePromise.then(filled, rejected);
  result.promise = closePromise;

  return result;
}

export { isOn, cacheStringFunction, camelize, hyphenate, capitalize, resolvePropValue };
