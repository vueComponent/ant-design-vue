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
import { getTwoToneColor, setTwoToneColor } from './twoTonePrimaryColor';
import { filterEmpty, getClass } from '../_util/props-util';

// Initial setting
VueIcon.add(...Object.keys(allIcons).map(key => allIcons[key]));
setTwoToneColor('#1890ff');
const defaultTheme = 'outlined';
let dangerousTheme;

const Icon = {
  functional: true,
  name: 'AIcon',
  props: {
    type: PropTypes.string,
    component: PropTypes.any,
    viewBox: PropTypes.any,
    spin: PropTypes.bool.def(false),
    theme: PropTypes.oneOf(['filled', 'outlined', 'twoTone']),
    twoToneColor: PropTypes.string,
  },
  render(h, context) {
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

    let innerNode;

    // component > children > type
    if (Component) {
      const innerSvgProps = {
        attrs: {
          ...svgBaseProps,
          viewBox,
        },
        class: svgClassString,
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
        <VueIcon class={svgClassString} type={computedType} primaryColor={twoToneColor} />
      );
    }
    // functional component not support nativeOn，https://github.com/vuejs/vue/issues/7526
    const iProps = {
      ...data,
      on: { ...listeners, ...data.nativeOn },
      class: classString,
      staticClass: '',
    };
    return <i {...iProps}>{innerNode}</i>;
  },
};

Icon.createFromIconfontCN = createFromIconfontCN;
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;

/* istanbul ignore next */
Icon.install = function(Vue) {
  Vue.component(Icon.name, Icon);
};

export default Icon;
