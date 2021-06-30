import type { CSSProperties, ExtractPropTypes } from 'vue';
import { defineComponent, computed } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../_util/hooks/useConfigInject';
import { useInjectRow } from './context';

type ColSpanType = number | string;

type FlexType = number | 'none' | 'auto' | string;

export interface ColSize {
  span?: ColSpanType;
  order?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
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

const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
export const colSize = PropTypes.shape<ColSize>({
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber,
}).loose;
const objectOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number, colSize]);

const colProps = {
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

export type ColProps = Partial<ExtractPropTypes<typeof colProps>>;

export default defineComponent({
  name: 'ACol',
  props: colProps,
  setup(props, { slots }) {
    const { gutter, supportFlexGap, wrap } = useInjectRow();
    const { prefixCls, direction } = useConfigInject('col', props);
    const classes = computed(() => {
      const { span, order, offset, push, pull } = props;
      const pre = prefixCls.value;
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
          [`${pre}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
          [`${pre}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
          [`${pre}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
          [`${pre}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
          [`${pre}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
          [`${pre}-rtl`]: direction.value === 'rtl',
        };
      });
      return classNames(
        pre,
        {
          [`${pre}-${span}`]: span !== undefined,
          [`${pre}-order-${order}`]: order,
          [`${pre}-offset-${offset}`]: offset,
          [`${pre}-push-${push}`]: push,
          [`${pre}-pull-${pull}`]: pull,
        },
        sizeClassObj,
      );
    });

    const mergedStyle = computed(() => {
      const { flex } = props;
      const gutterVal = gutter.value;
      const style: CSSProperties = {};
      // Horizontal gutter use padding
      if (gutterVal && gutterVal[0] > 0) {
        const horizontalGutter = `${gutterVal[0] / 2}px`;
        style.paddingLeft = horizontalGutter;
        style.paddingRight = horizontalGutter;
      }

      // Vertical gutter use padding when gap not support
      if (gutterVal && gutterVal[1] > 0 && !supportFlexGap.value) {
        const verticalGutter = `${gutterVal[1] / 2}px`;
        style.paddingTop = verticalGutter;
        style.paddingBottom = verticalGutter;
      }

      if (flex) {
        style.flex = parseFlex(flex);

        // Hack for Firefox to avoid size issue
        // https://github.com/ant-design/ant-design/pull/20023#issuecomment-564389553
        if (flex === 'auto' && wrap.value === false && !style.minWidth) {
          style.minWidth = 0;
        }
      }
      return style;
    });
    return () => {
      return (
        <div class={classes.value} style={mergedStyle.value}>
          {slots.default?.()}
        </div>
      );
    };
  },
});
