import isMobile from './utils/isMobile';
import isObject from 'lodash-es/isObject';

export function noop() {}

export function getKeyFromChildrenIndex(child, menuEventKey, index) {
  const prefix = menuEventKey || '';
  return child.key === null ? `${prefix}item_${index}` : child.key;
}

export function getMenuIdFromSubMenuEventKey(eventKey) {
  return `${eventKey}-menu-`;
}

export function loopMenuItem(children, cb) {
  let index = -1;
  children.forEach(c => {
    index++;
    if (c && c.type && c.type.isMenuItemGroup) {
      c.children.default &&
        c.children.default().forEach(c2 => {
          index++;
          cb(c2, index);
        });
    } else {
      cb(c, index);
    }
  });
}

export function loopMenuItemRecursively(children, keys, ret) {
  if (!children || ret.find) {
    return;
  }
  children.forEach(c => {
    if (ret.find) {
      return;
    }
    const construct = c.type;
    if (construct && isObject(construct)) {
      if (
        !construct ||
        !(construct.isSubMenu || construct.isMenuItem || construct.isMenuItemGroup)
      ) {
        return;
      }
      if (keys.indexOf(c.key) !== -1) {
        ret.find = true;
      } else if (c.children && c.children.default) {
        loopMenuItemRecursively(c.children.default(), keys, ret);
      }
    }
  });
}

export const menuAllProps = [
  'defaultSelectedKeys',
  'selectedKeys',
  'defaultOpenKeys',
  'openKeys',
  'mode',
  'getPopupContainer',
  'openTransitionName',
  'openAnimation',
  'subMenuOpenDelay',
  'subMenuCloseDelay',
  'forceSubMenuRender',
  'triggerSubMenuAction',
  'level',
  'selectable',
  'multiple',
  'visible',
  'focusable',
  'defaultActiveFirst',
  'prefixCls',
  'inlineIndent',
  'title',
  'rootPrefixCls',
  'eventKey',
  'active',
  'popupAlign',
  'popupOffset',
  'isOpen',
  'renderMenuItem',
  'manualRef',
  'subMenuKey',
  'disabled',
  'index',
  'isSelected',
  'store',
  'activeKey',
  'builtinPlacements',
  'overflowedIndicator',

  // the following keys found need to be removed from test regression
  'attribute',
  'value',
  'popupClassName',
  'inlineCollapsed',
  'menu',
  'theme',
  'itemIcon',
  'expandIcon',

  'onSelect',
  'onDeselect',
  'onDestroy',
  'onOpenChange',
  'onItemHover',
  'onTitleMouseenter',
  'onTitleMouseleave',
  'onTitleClick',
  'slots',
  'ref',
  'isRootMenu',
];

// ref: https://github.com/ant-design/ant-design/issues/14007
// ref: https://bugs.chromium.org/p/chromium/issues/detail?id=360889
// getBoundingClientRect return the full precision value, which is
// not the same behavior as on chrome. Set the precision to 6 to
// unify their behavior
export const getWidth = elem => {
  let width =
    elem && typeof elem.getBoundingClientRect === 'function' && elem.getBoundingClientRect().width;
  if (width) {
    width = +width.toFixed(6);
  }
  return width || 0;
};

export const setStyle = (elem, styleProperty, value) => {
  if (elem && typeof elem.style === 'object') {
    elem.style[styleProperty] = value;
  }
};

export const isMobileDevice = () => {
  return isMobile.any;
};
