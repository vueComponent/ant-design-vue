import { inject, defineComponent, HTMLAttributes, CSSProperties } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import { rowContextState } from './Row';

type ColSpanType = number | string;

type FlexType = number | 'none' | 'auto' | string;

export interface ColSize {
  span?: ColSpanType;
  order?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
}

export interface ColProps extends HTMLAttributes {
  span?: ColSpanType;
  order?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
  xs?: ColSpanType | ColSize;
  sm?: ColSpanType | ColSize;
  md?: ColSpanType | ColSize;
  lg?: ColSpanType | ColSize;
  xl?: ColSpanType | ColSize;
  xxl?: ColSpanType | ColSize;
  prefixCls?: string;
  flex?: FlexType;
}

function parseFlex(flex: FlexType): string {
  if (typeof flex === 'number') {
    return `${flex} ${flex} auto`;
  }

  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }

  return flex;
}

const ACol = defineComponent<ColProps>({
  name: 'ACol',
  setup(props, { slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const rowContext = inject<rowContextState>('rowContext', {});

    return () => {
      const { gutter } = rowContext;
      const { prefixCls: customizePrefixCls, span, order, offset, push, pull, flex } = props;
      const prefixCls = configProvider.getPrefixCls('col', customizePrefixCls);
      let sizeClassObj = {};
      ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
        let sizeProps: ColSize = {};
        const propSize = props[size];
        if (typeof propSize === 'number') {
          sizeProps.span = propSize;
        } else if (typeof propSize === 'object') {
          sizeProps = propSize || {};
        }

        sizeClassObj = {
          ...sizeClassObj,
          [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
          [`${prefixCls}-${size}-order-${sizeProps.order}`]:
            sizeProps.order || sizeProps.order === 0,
          [`${prefixCls}-${size}-offset-${sizeProps.offset}`]:
            sizeProps.offset || sizeProps.offset === 0,
          [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
          [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
        };
      });
      const classes = classNames(
        prefixCls,
        {
          [`${prefixCls}-${span}`]: span !== undefined,
          [`${prefixCls}-order-${order}`]: order,
          [`${prefixCls}-offset-${offset}`]: offset,
          [`${prefixCls}-push-${push}`]: push,
          [`${prefixCls}-pull-${pull}`]: pull,
        },
        sizeClassObj,
      );
      let mergedStyle: CSSProperties = {};
      if (gutter) {
        mergedStyle = {
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
          ...mergedStyle,
        };
      }
      if (flex) {
        mergedStyle.flex = parseFlex(flex);
      }

      return (
        <div class={classes} style={mergedStyle}>
          {slots.default?.()}
        </div>
      );
    };
  },
});

const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const ColSize = PropTypes.shape({
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber,
}).loose;

const objectOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number, ColSize]);

ACol.props = {
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

export default ACol;
