import { isVNode, Fragment, Comment, Text, h, VNode, ComponentPublicInstance, Slots } from 'vue';
import isPlainObject from 'lodash-es/isPlainObject';
import { camelize, hyphenate, isOn, resolvePropValue } from './util';
import isValid from './isValid';
// function getType(fn) {
//   const match = fn && fn.toString().match(/^\s*function (\w+)/);
//   return match ? match[1] : '';
// }

const splitAttrs = attrs => {
  const allAttrs = Object.keys(attrs);
  const eventAttrs = {};
  const onEvents = {};
  const extraAttrs = {};
  for (let i = 0, l = allAttrs.length; i < l; i++) {
    const key = allAttrs[i];
    if (isOn(key)) {
      eventAttrs[key[2].toLowerCase() + key.slice(3)] = attrs[key];
      onEvents[key] = attrs[key];
    } else {
      extraAttrs[key] = attrs[key];
    }
  }
  return { onEvents, events: eventAttrs, extraAttrs };
};
const parseStyleText = (cssText = '', camel) => {
  const res = {};
  const listDelimiter = /;(?![^(]*\))/g;
  const propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function(item) {
    if (item) {
      const tmp = item.split(propertyDelimiter);
      if (tmp.length > 1) {
        const k = camel ? camelize(tmp[0].trim()) : tmp[0].trim();
        res[k] = tmp[1].trim();
      }
    }
  });
  return res;
};

const hasProp = (instance: VNode, prop: string) => {
  return prop in getOptionProps(instance);
};
// 重构后直接使用 hasProp 替换
const slotHasProp = (slot, prop) => {
  return hasProp(slot, prop);
};

const getScopedSlots = ele => {
  return (ele.data && ele.data.scopedSlots) || {};
};

const getSlots = ele => {
  let componentOptions = ele.componentOptions || {};
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions || {};
  }
  const children = ele.children || componentOptions.children || [];
  const slots = {};
  children.forEach(child => {
    if (!isEmptyElement(child)) {
      const name = (child.data && child.data.slot) || 'default';
      slots[name] = slots[name] || [];
      slots[name].push(child);
    }
  });
  return { ...slots, ...getScopedSlots(ele) };
};

const flattenChildren = (children = [], filterEmpty = true) => {
  const temp = Array.isArray(children) ? children : [children];
  const res = [];
  temp.forEach(child => {
    if (Array.isArray(child)) {
      res.push(...flattenChildren(child, filterEmpty));
    } else if (child && child.type === Fragment) {
      res.push(...flattenChildren(child.children, filterEmpty));
    } else if (child && isVNode(child)) {
      if (filterEmpty && !isEmptyElement(child)) {
        res.push(child);
      } else if (!filterEmpty) {
        res.push(child);
      }
    } else if (isValid(child)) {
      res.push(child);
    }
  });
  return res;
};

const getSlot = (self, name = 'default', options = {}) => {
  if (isVNode(self)) {
    if (self.type === Fragment) {
      return name === 'default' ? flattenChildren(self.children) : [];
    } else if (self.children && self.children[name]) {
      return flattenChildren(self.children[name](options));
    } else {
      return [];
    }
  } else {
    const res = self.$slots[name] && self.$slots[name](options);
    return flattenChildren(res);
  }
};

const getAllChildren = ele => {
  let componentOptions = ele.componentOptions || {};
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions || {};
  }
  return ele.children || componentOptions.children || [];
};
const getSlotOptions = () => {
  throw Error('使用 .type 直接取值');
};
const findDOMNode = (instance: ComponentPublicInstance) => {
  let node = instance && (instance.$el || instance);
  while (node && !node.tagName) {
    node = node.nextSibling;
  }
  return node;
};
const getOptionProps = (instance: ComponentPublicInstance) => {
  const res = {};
  if (instance.$ && instance.$.vnode) {
    const props = instance.$.vnode.props || {};
    Object.keys(instance.$props).forEach(k => {
      const v = instance.$props[k];
      const hyphenateKey = hyphenate(k);
      if (v !== undefined || hyphenateKey in props) {
        res[k] = v; // 直接取 $props[k]
      }
    });
  } else if (isVNode(instance) && typeof instance.type === 'object') {
    const originProps = instance.props || {};
    const props = {};
    Object.keys(originProps).forEach(key => {
      props[camelize(key)] = originProps[key];
    });
    const options = instance.type.props || {};
    Object.keys(options).forEach(k => {
      const v = resolvePropValue(options, props, k, props[k]);
      if (v !== undefined || k in props) {
        res[k] = v;
      }
    });
  }
  return res;
};

const getComponentFromSetup = (
  props: Record<string, unknown>,
  slots: Slots,
  name: string,
  options?: unknown,
) => {
  return props[name] ? props[name] : slots[name]?.(options);
};

const getComponent = (
  instance: ComponentPublicInstance,
  prop = 'default',
  options = instance,
  execute = true,
) => {
  let com = undefined;
  if (instance.$) {
    const temp = instance[prop];
    if (temp !== undefined) {
      return typeof temp === 'function' && execute ? temp(options) : temp;
    } else {
      com = instance.$slots[prop];
      com = execute && com ? com(options) : com;
    }
  } else if (isVNode(instance)) {
    const temp = instance.props && instance.props[prop];
    if (temp !== undefined && instance.props !== null) {
      return typeof temp === 'function' && execute ? temp(options) : temp;
    } else if (instance.type === Fragment) {
      com = instance.children;
    } else if (instance.children && instance.children[prop]) {
      com = instance.children[prop];
      com = execute && com ? com(options) : com;
    }
  }
  if (Array.isArray(com)) {
    com = flattenChildren(com);
    com = com.length === 1 ? com[0] : com;
    com = com.length === 0 ? undefined : com;
  }
  return com;
};
const getComponentFromProp = (instance, prop, options = instance, execute = true) => {
  if (instance.$createElement) {
    // const h = instance.$createElement;
    const temp = instance[prop];
    if (temp !== undefined) {
      return typeof temp === 'function' && execute ? temp(h, options) : temp;
    }
    return (
      (instance.$scopedSlots[prop] && execute && instance.$scopedSlots[prop](options)) ||
      instance.$scopedSlots[prop] ||
      instance.$slots[prop] ||
      undefined
    );
  } else {
    // const h = instance.context.$createElement;
    const temp = getPropsData(instance)[prop];
    if (temp !== undefined) {
      return typeof temp === 'function' && execute ? temp(h, options) : temp;
    }
    const slotScope = getScopedSlots(instance)[prop];
    if (slotScope !== undefined) {
      return typeof slotScope === 'function' && execute ? slotScope(h, options) : slotScope;
    }
    const slotsProp = [];
    const componentOptions = instance.componentOptions || {};
    (componentOptions.children || []).forEach(child => {
      if (child.data && child.data.slot === prop) {
        if (child.data.attrs) {
          delete child.data.attrs.slot;
        }
        if (child.tag === 'template') {
          slotsProp.push(child.children);
        } else {
          slotsProp.push(child);
        }
      }
    });
    return slotsProp.length ? slotsProp : undefined;
  }
};

const getAllProps = ele => {
  let props = getOptionProps(ele);
  if (ele.$) {
    props = { ...props, ...this.$attrs };
  } else {
    props = { ...ele.props, ...props };
  }
  return props;
};

const getPropsData = (ins: ComponentPublicInstance) => {
  const vnode = ins.$ ? ins.$ : ins;
  const res = {};
  const originProps = vnode.props || {};
  const props = {};
  Object.keys(originProps).forEach(key => {
    props[camelize(key)] = originProps[key];
  });
  const options = isPlainObject(vnode.type) ? vnode.type.props : {};
  options &&
    Object.keys(options).forEach(k => {
      const v = resolvePropValue(options, props, k, props[k]);
      if (k in props) {
        // 仅包含 props，不包含默认值
        res[k] = v;
      }
    });
  return { ...props, ...res }; // 合并事件、未声明属性等
};
const getValueByProp = (ele, prop) => {
  return getPropsData(ele)[prop];
};

const getAttrs = ele => {
  let data = ele.data;
  if (ele.$vnode) {
    data = ele.$vnode.data;
  }
  return data ? data.attrs || {} : {};
};

const getKey = ele => {
  const key = ele.key;
  return key;
};

export function getEvents(ele = {}, on = true) {
  let props = {};
  if (ele.$) {
    props = { ...props, ...ele.$attrs };
  } else {
    props = { ...props, ...ele.props };
  }
  return splitAttrs(props)[on ? 'onEvents' : 'events'];
}

export function getEvent(child, event) {
  return child.props && child.props[event];
}

// 获取 xxx.native 或者 原生标签 事件
export function getDataEvents(child) {
  let events = {};
  if (child.data && child.data.on) {
    events = child.data.on;
  }
  return { ...events };
}

// use getListeners instead this.$listeners
// https://github.com/vueComponent/ant-design-vue/issues/1705
export function getListeners(context) {
  return (context.$vnode ? context.$vnode.componentOptions.listeners : context.$listeners) || {};
}
export function getClass(ele) {
  const props = (isVNode(ele) ? ele.props : ele.$attrs) || {};
  const tempCls = props.class || {};
  let cls = {};
  if (typeof tempCls === 'string') {
    tempCls.split(' ').forEach(c => {
      cls[c.trim()] = true;
    });
  } else if (Array.isArray(tempCls)) {
    classNames(tempCls)
      .split(' ')
      .forEach(c => {
        cls[c.trim()] = true;
      });
  } else {
    cls = { ...cls, ...tempCls };
  }
  return cls;
}
export function getStyle(ele, camel) {
  const props = (isVNode(ele) ? ele.props : ele.$attrs) || {};
  let style = props.style || {};
  if (typeof style === 'string') {
    style = parseStyleText(style, camel);
  } else if (camel && style) {
    // 驼峰化
    const res = {};
    Object.keys(style).forEach(k => (res[camelize(k)] = style[k]));
    return res;
  }
  return style;
}

export function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}

export function isFragment(c) {
  return c.length === 1 && c[0].type === Fragment;
}

export function isEmptyElement(c: VNode) {
  return (
    c.type === Comment ||
    (c.type === Fragment && c.children.length === 0) ||
    (c.type === Text && c.children.trim() === '')
  );
}

export function isStringElement(c: VNode): boolean {
  return c && c.type === Text;
}

export function filterEmpty(children: VNode[] = []) {
  const res: VNode[] = [];
  children.forEach(child => {
    if (Array.isArray(child)) {
      res.push(...child);
    } else if (child.type === Fragment) {
      res.push(...child.children);
    } else {
      res.push(child);
    }
  });
  return res.filter(c => !isEmptyElement(c));
}
const initDefaultProps = <T>(
  propTypes: T,
  defaultProps: { [K in Extract<keyof T, string>]?: any },
): T => {
  Object.keys(defaultProps).forEach((k: Extract<keyof T, string>) => {
    const prop = propTypes[k] as PropOptions<any>;
    if (prop) {
      prop.default = defaultProps[k];
    } else {
      throw new Error(`not have ${k} prop`);
    }
  });
  return propTypes;
};

function isValidElement(element) {
  return element && element.__v_isVNode && typeof element.type !== 'symbol'; // remove text node
}

export {
  splitAttrs,
  hasProp,
  getOptionProps,
  getComponent,
  getComponentFromProp,
  getSlotOptions,
  slotHasProp,
  getPropsData,
  getKey,
  getAttrs,
  getValueByProp,
  parseStyleText,
  initDefaultProps,
  isValidElement,
  camelize,
  getSlots,
  getSlot,
  getAllProps,
  getAllChildren,
  findDOMNode,
  flattenChildren,
  getComponentFromSetup,
};
export default hasProp;
