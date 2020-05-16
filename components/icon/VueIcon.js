import _extends from 'babel-runtime/helpers/extends';
import { generate, getSecondaryColor, isIconDefinition, log, MiniMap, withSuffix } from '@ant-design/icons-vue/es/utils';

var twoToneColorPalette = {
  primaryColor: '#333',
  secondaryColor: '#E6E6E6'
};

var Icon = {
  name: 'AntdIcon',
  props: ['type', 'primaryColor', 'secondaryColor'],
  displayName: 'IconVue',
  definitions: new MiniMap(),
  data: function data() {
    return {
      twoToneColorPalette: twoToneColorPalette
    };
  },
  add: function add() {
    for (var _len = arguments.length, icons = Array(_len), _key = 0; _key < _len; _key++) {
      icons[_key] = arguments[_key];
    }

    icons.forEach(function (icon) {
      Icon.definitions.set(withSuffix(icon.name, icon.theme), icon);
    });
  },
  clear: function clear() {
    Icon.definitions.clear();
  },
  get: function get(key) {
    var colors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : twoToneColorPalette;

    if (key) {
      var target = Icon.definitions.get(key);
      if (target && typeof target.icon === 'function') {
        target = _extends({}, target, {
          icon: target.icon(colors.primaryColor, colors.secondaryColor)
        });
      }
      return target;
    }
  },
  setTwoToneColors: function setTwoToneColors(_ref) {
    var primaryColor = _ref.primaryColor,
        secondaryColor = _ref.secondaryColor;

    twoToneColorPalette.primaryColor = primaryColor;
    twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
  },
  getTwoToneColors: function getTwoToneColors() {
    return _extends({}, twoToneColorPalette);
  },
  render: function render(h) {
    var _$props = this.$props,
        type = _$props.type,
        primaryColor = _$props.primaryColor,
        secondaryColor = _$props.secondaryColor;


    var target = void 0;
    var colors = twoToneColorPalette;
    if (primaryColor) {
      colors = {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
      };
    }
    if (isIconDefinition(type)) {
      target = type;
    } else if (typeof type === 'string') {
      target = Icon.get(type, colors);
      if (!target) {
        // log(`Could not find icon: ${type}`);
        return null;
      }
    }
    if (!target) {
      log('type should be string or icon definiton, but got ' + type);
      return null;
    }
    if (target && typeof target.icon === 'function') {
      target = _extends({}, target, {
        icon: target.icon(colors.primaryColor, colors.secondaryColor)
      });
    }
    const rootProps = {
      attrs: {
        'data-icon': target.name,
        width: '1em',
        height: '1em',
        fill: 'currentColor',
        'aria-hidden': 'true',
      },
      on: this.$listeners,
    };
    if (target.icon.attrs.fill) {
      rootProps.attrs.fill = target.icon.attrs.fill;
    }
    return generate(h, target.icon, 'svg-' + target.name, rootProps);
  }
};

/* istanbul ignore next */
Icon.install = function (Vue) {
  Vue.component(Icon.name, Icon);
};

export default Icon;
