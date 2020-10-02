import { inject, defineComponent, HTMLAttributes, CSSProperties } from 'vue';
import classNames from '../_util/classNames';
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

export default defineComponent({
  name: 'ACol',
  inheritAttrs: false,
  setup(_: ColProps, { slots, attrs }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const rowContext = inject<rowContextState>('rowContext', {});

    return () => {
      const { gutter } = rowContext;
      const {
        prefixCls: customizePrefixCls,
        span,
        order,
        offset,
        push,
        pull,
        class: className,
        flex,
        style,
        ...others
      } = attrs as ColProps;
      const prefixCls = configProvider.getPrefixCls('col', customizePrefixCls);
      let sizeClassObj = {};
      ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
        let sizeProps: ColSize = {};
        const propSize = attrs[size];
        if (typeof propSize === 'number') {
          sizeProps.span = propSize;
        } else if (typeof propSize === 'object') {
          sizeProps = propSize || {};
        }

        delete (others as any)[size];

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
        className,
        sizeClassObj,
      );
      let mergedStyle: CSSProperties = { ...(style as CSSProperties) };
      if (gutter) {
        mergedStyle = {
          ...(gutter[0]! > 0
            ? {
                paddingLeft: gutter[0]! / 2,
                paddingRight: gutter[0]! / 2,
              }
            : {}),
          ...(gutter[1]! > 0
            ? {
                paddingTop: gutter[1]! / 2,
                paddingBottom: gutter[1]! / 2,
              }
            : {}),
          ...mergedStyle,
        };
      }
      if (flex) {
        mergedStyle.flex = parseFlex(flex);
      }

      return (
        <div {...others} style={mergedStyle} class={classes}>
          {slots.default?.()}
        </div>
      );
    };
  },
});
