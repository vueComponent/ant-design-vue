import classNames from 'classnames';
import * as allIcons from '@ant-design/icons/lib/dist';
import VueIcon from '@ant-design/icons-vue';
import PropTypes from '../_util/vue-types';
import createFromIconfontCN from './IconFont';
import {
  svgBaseProps,
  withThemeSuffix,
  removeTypeTheme,
  getThemeFromTypeName,
  alias,
} from './utils';
import warning from '../_util/warning';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { getTwoToneColor, setTwoToneColor } from './twoTonePrimaryColor';
import { filterEmpty, getClass } from '../_util/props-util';
import Base from '../base';

// Initial setting
VueIcon.add(...Object.keys(allIcons).map(key => allIcons[key]));
setTwoToneColor('#1890ff');
const defaultTheme = 'outlined';
let dangerousTheme;

function renderIcon(h, locale, context) {
  const { props, slots, listeners, data } = context;
  const {
    // affect inner <svg>...</svg>
    type,
    component: Component,
    viewBox,
    spin,
    // other
    theme, // default to outlined
    twoToneColor,
    rotate,
    tabIndex,
  } = props;
  const slotsMap = slots();
  let children = filterEmpty(slotsMap.default);
  children = children.length === 0 ? undefined : children;
  warning(
    Boolean(type || Component || children),
    'Icon should have `type` prop or `component` prop or `children`.',
  );

  const classString = classNames({
    ...getClass(context),
    [`anticon`]: true,
    [`anticon-${type}`]: !!type,
  });

  const svgClassString = classNames({
    [`anticon-spin`]: !!spin || type === 'loading',
  });

  const svgStyle = rotate
    ? {
        msTransform: `rotate(${rotate}deg)`,
        transform: `rotate(${rotate}deg)`,
      }
    : undefined;

  let innerNode;

  // component > children > type
  if (Component) {
    const innerSvgProps = {
      attrs: {
        ...svgBaseProps,
        viewBox,
      },
      class: svgClassString,
      style: svgStyle,
    };
    if (!viewBox) {
      delete innerSvgProps.attrs.viewBox;
    }

    innerNode = <Component {...innerSvgProps}>{children}</Component>;
  }
  if (children) {
    warning(
      Boolean(viewBox) || (children.length === 1 && children[0].tag === 'use'),
      'Make sure that you provide correct `viewBox`' +
        ' prop (default `0 0 1024 1024`) to the icon.',
    );
    const innerSvgProps = {
      attrs: {
        ...svgBaseProps,
      },
      class: svgClassString,
      style: svgStyle,
    };
    innerNode = (
      <svg {...innerSvgProps} viewBox={viewBox}>
        {children}
      </svg>
    );
  }

  if (typeof type === 'string') {
    let computedType = type;
    if (theme) {
      const themeInName = getThemeFromTypeName(type);
      warning(
        !themeInName || theme === themeInName,
        `The icon name '${type}' already specify a theme '${themeInName}',` +
          ` the 'theme' prop '${theme}' will be ignored.`,
      );
    }
    computedType = withThemeSuffix(
      removeTypeTheme(alias(computedType)),
      dangerousTheme || theme || defaultTheme,
    );
    innerNode = (
      <VueIcon
        focusable="false"
        class={svgClassString}
        type={computedType}
        primaryColor={twoToneColor}
        style={svgStyle}
      />
    );
  }
  let iconTabIndex = tabIndex;
  if (iconTabIndex === undefined && 'click' in listeners) {
    iconTabIndex = -1;
  }
  const { attrs, ...restDataProps } = data;
  // functional component not support nativeOn，https://github.com/vuejs/vue/issues/7526
  const iProps = {
    ...restDataProps,
    attrs: {
      ...attrs,
      'aria-label': type && `${locale.icon}: ${type}`,
      tabIndex: iconTabIndex,
    },
    on: { ...listeners, ...data.nativeOn },
    class: classString,
    staticClass: '',
  };
  return <i {...iProps}>{innerNode}</i>;
}

const Icon = {
  functional: true,
  name: 'AIcon',
  props: {
    tabIndex: PropTypes.number,
    type: PropTypes.string,
    component: PropTypes.any,
    viewBox: PropTypes.any,
    spin: PropTypes.bool.def(false),
    rotate: PropTypes.number,
    theme: PropTypes.oneOf(['filled', 'outlined', 'twoTone']),
    twoToneColor: PropTypes.string,
    role: PropTypes.string,
  },
  render(h, context) {
    return (
      <LocaleReceiver
        componentName="Icon"
        scopedSlots={{ default: locale => renderIcon(h, locale, context) }}
      />
    );
  },
};

Icon.createFromIconfontCN = createFromIconfontCN;
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;

/* istanbul ignore next */
Icon.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Icon.name, Icon);
};

export default Icon;
