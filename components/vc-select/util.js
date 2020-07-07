import { getPropsData, getComponent, getSlot } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { isVNode, Text } from 'vue';

export function toTitle(title) {
  if (typeof title === 'string') {
    return title.trim();
  }
  return '';
}
export function getValuePropValue(child) {
  if (!child) {
    return null;
  }
  const props = getPropsData(child);
  if ('value' in props) {
    return props.value;
  }
  if (child.key !== undefined) {
    return child.key;
  }
  if (typeof child.type === 'object' && child.type.isSelectOptGroup) {
    const label = getComponent(child, 'label');
    if (label) {
      return label;
    }
  }
  throw new Error(`Need at least a key or a value or a label (only for OptGroup) for ${child}`);
}

export function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  if (prop === 'children') {
    const temp = getComponent(child);
    const newChild = isVNode(temp) ? cloneElement(temp) : temp;
    if (isVNode(newChild) && newChild.type === Text) {
      return newChild.children;
    }
    return newChild;
  }
  const props = getPropsData(child);
  return props[prop];
}

export function isMultiple(props) {
  return props.multiple;
}

export function isCombobox(props) {
  return props.combobox;
}

export function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

export function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

export function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

export function toArray(value) {
  let ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

export function getMapKey(value) {
  return `${typeof value}-${value}`;
}

export function preventDefaultEvent(e) {
  e.preventDefault();
}

export function findIndexInValueBySingleValue(value, singleValue) {
  let index = -1;
  if (value) {
    for (let i = 0; i < value.length; i++) {
      if (value[i] === singleValue) {
        index = i;
        break;
      }
    }
  }
  return index;
}

export function getLabelFromPropsValue(value, key) {
  let label;
  value = toArray(value);
  if (value) {
    for (let i = 0; i < value.length; i++) {
      if (value[i].key === key) {
        label = value[i].label;
        break;
      }
    }
  }
  return label;
}

export function getSelectKeys(menuItems = [], value) {
  if (value === null || value === undefined) {
    return [];
  }
  let selectedKeys = [];
  menuItems.forEach(item => {
    if (item.type?.isMenuItemGroup) {
      selectedKeys = selectedKeys.concat(getSelectKeys(getSlot(item), value));
    } else {
      const itemValue = getValuePropValue(item);
      const itemKey = item.key;
      if (findIndexInValueBySingleValue(value, itemValue) !== -1 && itemKey !== undefined) {
        selectedKeys.push(itemKey);
      }
    }
  });
  return selectedKeys;
}

export const UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

export const UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'on',
};

export function findFirstMenuItem(children) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const props = getPropsData(child);
    if (child.type?.isMenuItemGroup) {
      const found = findFirstMenuItem(getSlot(child));
      if (found) {
        return found;
      }
    } else if (!props.disabled) {
      return child;
    }
  }
  return null;
}

export function includesSeparators(str, separators) {
  for (let i = 0; i < separators.length; ++i) {
    if (str.lastIndexOf(separators[i]) > 0) {
      return true;
    }
  }
  return false;
}

export function splitBySeparators(str, separators) {
  const reg = new RegExp(`[${separators.join()}]`);
  return str.split(reg).filter(token => token);
}

export function defaultFilterFn(input, child) {
  const props = getPropsData(child);
  if (props.disabled) {
    return false;
  }
  let value = getPropValue(child, this.optionFilterProp);
  if (value.length && value[0].text) {
    value = value[0].text;
  } else {
    value = String(value);
  }
  return value.toLowerCase().indexOf(input.toLowerCase()) > -1;
}

export function validateOptionValue(value, props) {
  if (isSingleMode(props) || isMultiple(props)) {
    return;
  }
  if (typeof value !== 'string') {
    throw new Error(
      `Invalid \`value\` of type \`${typeof value}\` supplied to Option, ` +
        `expected \`string\` when \`tags/combobox\` is \`true\`.`,
    );
  }
}

export function saveRef(instance, name) {
  return node => {
    instance[name] = node;
  };
}

export function generateUUID() {
  if (process.env.NODE_ENV === 'test') {
    return 'test-uuid';
  }
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
}
