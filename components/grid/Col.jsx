import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { getListeners } from '../_util/props-util';

const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const ColSize = PropTypes.shape({
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber,
}).loose;

const objectOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number, ColSize]);

export const ColProps = {
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber,
  xs: objectOrNumber,
  sm: objectOrNumber,
  md: objectOrNumber,
  lg: objectOrNumber,
  xl: objectOrNumber,
  xxl: objectOrNumber,
  prefixCls: PropTypes.string,
  flex: stringOrNumber,
};

export default {
  name: 'ACol',
  props: ColProps,
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
    rowContext: {
      default: () => null,
    },
  },
  methods: {
    parseFlex(flex) {
      if (typeof flex === 'number') {
        return `${flex} ${flex} auto`;
      }
      if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
      }
      return flex;
    },
  },
  render() {
    const {
      span,
      order,
      offset,
      push,
      pull,
      flex,
      prefixCls: customizePrefixCls,
      $slots,
      rowContext,
    } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('col', customizePrefixCls);

    let sizeClassObj = {};
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
      let sizeProps = {};
      const propSize = this[size];
      if (typeof propSize === 'number') {
        sizeProps.span = propSize;
      } else if (typeof propSize === 'object') {
        sizeProps = propSize || {};
      }

      sizeClassObj = {
        ...sizeClassObj,
        [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
        [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
        [`${prefixCls}-${size}-offset-${sizeProps.offset}`]:
          sizeProps.offset || sizeProps.offset === 0,
        [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
        [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
      };
    });
    const classes = {
      [`${prefixCls}`]: true,
      [`${prefixCls}-${span}`]: span !== undefined,
      [`${prefixCls}-order-${order}`]: order,
      [`${prefixCls}-offset-${offset}`]: offset,
      [`${prefixCls}-push-${push}`]: push,
      [`${prefixCls}-pull-${pull}`]: pull,
      ...sizeClassObj,
    };
    const divProps = {
      on: getListeners(this),
      class: classes,
      style: {},
    };
    if (rowContext) {
      const gutter = rowContext.getGutter();
      if (gutter) {
        divProps.style = {
          ...(gutter[0] > 0
            ? {
                paddingLeft: `${gutter[0] / 2}px`,
                paddingRight: `${gutter[0] / 2}px`,
              }
            : {}),
          ...(gutter[1] > 0
            ? {
                paddingTop: `${gutter[1] / 2}px`,
                paddingBottom: `${gutter[1] / 2}px`,
              }
            : {}),
        };
      }
    }

    if (flex) {
      divProps.style.flex = this.parseFlex(flex);
    }

    return <div {...divProps}>{$slots.default}</div>;
  },
};
