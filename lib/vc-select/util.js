'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNSELECTABLE_ATTRIBUTE = exports.UNSELECTABLE_STYLE = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.getValuePropValue = getValuePropValue;
exports.getPropValue = getPropValue;
exports.isMultiple = isMultiple;
exports.isCombobox = isCombobox;
exports.isMultipleOrTags = isMultipleOrTags;
exports.isMultipleOrTagsOrCombobox = isMultipleOrTagsOrCombobox;
exports.isSingleMode = isSingleMode;
exports.toArray = toArray;
exports.preventDefaultEvent = preventDefaultEvent;
exports.findIndexInValueByKey = findIndexInValueByKey;
exports.findIndexInValueByLabel = findIndexInValueByLabel;
exports.getSelectKeys = getSelectKeys;
exports.findFirstMenuItem = findFirstMenuItem;
exports.includesSeparators = includesSeparators;
exports.splitBySeparators = splitBySeparators;
exports.defaultFilterFn = defaultFilterFn;
exports.validateOptionValue = validateOptionValue;

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getValuePropValue(child) {
  var props = (0, _propsUtil.getPropsData)(child);
  if ('value' in props) {
    return props.value;
  }
  if ((0, _propsUtil.getKey)(child) !== undefined) {
    return (0, _propsUtil.getKey)(child);
  }
  if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
    var label = (0, _propsUtil.getComponentFromProp)(child, 'label');
    if (label) {
      return label;
    }
  }
  throw new Error('Need at least a key or a value or a label(slot) (only for OptGroup) for ' + child);
}

function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  if (prop === 'children') {
    var newChild = child.$slots ? (0, _vnode.cloneVNodes)(child.$slots['default'], true) : (0, _vnode.cloneVNodes)(child.componentOptions.children, true);
    if (newChild.length === 1 && !newChild[0].tag) {
      return newChild[0].text;
    }
    return newChild;
  }
  var data = (0, _propsUtil.getPropsData)(child);
  if (prop in data) {
    return data[prop];
  } else {
    return (0, _propsUtil.getAttrs)(child)[prop];
  }
}

function isMultiple(props) {
  return props.multiple;
}

function isCombobox(props) {
  return props.combobox;
}

function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

function toArray(value) {
  var ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

function preventDefaultEvent(e) {
  e.preventDefault();
}

function findIndexInValueByKey(value, key) {
  var index = -1;
  for (var i = 0; i < value.length; i++) {
    if (value[i].key === key) {
      index = i;
      break;
    }
  }
  return index;
}

function findIndexInValueByLabel(value, label) {
  var index = -1;
  for (var i = 0; i < value.length; i++) {
    if (toArray(value[i].label).join('') === label) {
      index = i;
      break;
    }
  }
  return index;
}

function getSelectKeys(menuItems, value) {
  if (value === null || value === undefined) {
    return [];
  }
  var selectedKeys = [];
  menuItems.forEach(function (item) {
    if ((0, _propsUtil.getSlotOptions)(item).isMenuItemGroup) {
      selectedKeys = selectedKeys.concat(getSelectKeys(item.componentOptions.children, value));
    } else {
      var itemValue = getValuePropValue(item);
      var itemKey = item.key;
      if (findIndexInValueByKey(value, itemValue) !== -1 && itemKey) {
        selectedKeys.push(itemKey);
      }
    }
  });
  return selectedKeys;
}

var UNSELECTABLE_STYLE = exports.UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

var UNSELECTABLE_ATTRIBUTE = exports.UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable'
};

function findFirstMenuItem(children) {
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var props = (0, _propsUtil.getPropsData)(child);
    if ((0, _propsUtil.getSlotOptions)(child).isMenuItemGroup) {
      var found = findFirstMenuItem(child.componentOptions.children);
      if (found) {
        return found;
      }
    } else if (!props.disabled) {
      return child;
    }
  }
  return null;
}

function includesSeparators(string, separators) {
  for (var i = 0; i < separators.length; ++i) {
    if (string.lastIndexOf(separators[i]) > 0) {
      return true;
    }
  }
  return false;
}

function splitBySeparators(string, separators) {
  var reg = new RegExp('[' + separators.join() + ']');
  return string.split(reg).filter(function (token) {
    return token;
  });
}

function defaultFilterFn(input, child) {
  var props = (0, _propsUtil.getPropsData)(child);
  if (props.disabled) {
    return false;
  }
  var value = getPropValue(child, this.optionFilterProp);
  if (value.length && value[0].text) {
    value = value[0].text;
  } else {
    value = String(value);
  }
  return value.toLowerCase().indexOf(input.toLowerCase()) > -1;
}

function validateOptionValue(value, props) {
  if (isSingleMode(props) || isMultiple(props)) {
    return;
  }
  if (typeof value !== 'string') {
    throw new Error('Invalid `value` of type `' + (typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) + '` supplied to Option, ' + 'expected `string` when `tags/combobox` is `true`.');
  }
}