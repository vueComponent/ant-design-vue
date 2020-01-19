import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';
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
  render() {
    const {
      span,
      order,
      offset,
      push,
      pull,
      prefixCls: customizePrefixCls,
      $slots,
      rowContext,
    } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('col', customizePrefixCls);

    let sizeClassObj = {};
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
      let sizeProps = {};
      if (typeof this[size] === 'number') {
        sizeProps.span = this[size];
      } else if (typeof this[size] === 'object') {
        sizeProps = this[size] || {};
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
      if (gutter > 0) {
        divProps.style = {
          paddingLeft: `${gutter / 2}px`,
          paddingRight: `${gutter / 2}px`,
        };
      }
    }
    return <div {...divProps}>{$slots.default}</div>;
  },
};
