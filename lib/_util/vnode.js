'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.cloneVNode = cloneVNode;
exports.cloneVNodes = cloneVNodes;
exports.cloneElement = cloneElement;

var _propsUtil = require('./props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function cloneVNode(vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var data = vnode.data;

  var listeners = {};
  if (componentOptions && componentOptions.listeners) {
    listeners = (0, _extends3['default'])({}, componentOptions.listeners);
  }

  var on = {};
  if (data && data.on) {
    on = (0, _extends3['default'])({}, data.on);
  }

  var cloned = new vnode.constructor(vnode.tag, data ? (0, _extends3['default'])({}, data, { on: on }) : data, vnode.children, vnode.text, vnode.elm, vnode.context, componentOptions ? (0, _extends3['default'])({}, componentOptions, { listeners: listeners }) : componentOptions, vnode.asyncFactory);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned;
}

function cloneVNodes(vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res;
}

function cloneElement(n, nodeProps, deep) {
  var ele = n;
  if (Array.isArray(n)) {
    ele = (0, _propsUtil.filterEmpty)(n)[0];
  }
  if (!ele) {
    return null;
  }
  var node = cloneVNode(ele, deep);
  var _nodeProps$props = nodeProps.props,
      props = _nodeProps$props === undefined ? {} : _nodeProps$props,
      key = nodeProps.key,
      _nodeProps$on = nodeProps.on,
      on = _nodeProps$on === undefined ? {} : _nodeProps$on,
      children = nodeProps.children,
      _nodeProps$directives = nodeProps.directives,
      directives = _nodeProps$directives === undefined ? [] : _nodeProps$directives;

  var data = node.data || {};
  var cls = {};
  var style = {};
  var _nodeProps$attrs = nodeProps.attrs,
      attrs = _nodeProps$attrs === undefined ? {} : _nodeProps$attrs,
      ref = nodeProps.ref,
      _nodeProps$domProps = nodeProps.domProps,
      domProps = _nodeProps$domProps === undefined ? {} : _nodeProps$domProps,
      _nodeProps$style = nodeProps.style,
      tempStyle = _nodeProps$style === undefined ? {} : _nodeProps$style,
      _nodeProps$class = nodeProps['class'],
      tempCls = _nodeProps$class === undefined ? {} : _nodeProps$class,
      _nodeProps$scopedSlot = nodeProps.scopedSlots,
      scopedSlots = _nodeProps$scopedSlot === undefined ? {} : _nodeProps$scopedSlot;


  if (typeof data.style === 'string') {
    style = (0, _propsUtil.parseStyleText)(data.style);
  } else {
    style = (0, _extends3['default'])({}, data.style, style);
  }
  if (typeof tempStyle === 'string') {
    style = (0, _extends3['default'])({}, style, (0, _propsUtil.parseStyleText)(style));
  } else {
    style = (0, _extends3['default'])({}, style, tempStyle);
  }

  if (typeof data['class'] === 'string') {
    cls[data['class']] = true;
    data['class'].split(' ').forEach(function (c) {
      cls[c.trim()] = true;
    });
  } else {
    cls = (0, _extends3['default'])({}, data['class'], cls);
  }
  if (typeof tempCls === 'string') {
    tempCls.split(' ').forEach(function (c) {
      cls[c.trim()] = true;
    });
  } else {
    cls = (0, _extends3['default'])({}, cls, tempCls);
  }
  node.data = (0, _extends3['default'])({}, data, {
    style: style,
    attrs: (0, _extends3['default'])({}, data.attrs, attrs),
    'class': cls,
    domProps: (0, _extends3['default'])({}, data.domProps, domProps),
    scopedSlots: (0, _extends3['default'])({}, data.scopedSlots, scopedSlots),
    directives: [].concat((0, _toConsumableArray3['default'])(data.directives || []), (0, _toConsumableArray3['default'])(directives))
  });

  if (node.componentOptions) {
    node.componentOptions.propsData = node.componentOptions.propsData || {};
    node.componentOptions.listeners = node.componentOptions.listeners || {};
    node.componentOptions.propsData = (0, _extends3['default'])({}, node.componentOptions.propsData, props);
    node.componentOptions.listeners = (0, _extends3['default'])({}, node.componentOptions.listeners, on);
    if (children) {
      node.componentOptions.children = children;
    }
  } else {
    node.data.on = (0, _extends3['default'])({}, node.data.on || {}, on);
  }

  if (key !== undefined) {
    node.key = key;
    node.data.key = key;
  }
  if (typeof ref === 'string') {
    node.data.ref = ref;
  }
  return node;
}