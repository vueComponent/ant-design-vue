import {
  inject,
  provide,
  reactive,
  defineComponent,
  HTMLAttributes,
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import classNames from '../_util/classNames';
import { tuple } from '../_util/type';
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import ResponsiveObserve, {
  Breakpoint,
  ScreenMap,
  responsiveArray,
} from '../_util/responsiveObserve';

const RowProps = {
  gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  type: PropTypes.oneOf(['flex']),
  align: PropTypes.oneOf(['top', 'middle', 'bottom', 'stretch']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  prefixCls: PropTypes.string,
};
const RowAligns = tuple('top', 'middle', 'bottom', 'stretch');
const RowJustify = tuple('start', 'end', 'center', 'space-around', 'space-between');

export type Gutter = number | Partial<Record<Breakpoint, number>>;

export interface rowContextState {
  gutter?: [number, number];
}

export interface RowProps extends HTMLAttributes {
  gutter?: Gutter | [Gutter, Gutter];
  align?: typeof RowAligns[number];
  justify?: typeof RowJustify[number];
  prefixCls?: string;
}

export default defineComponent<RowProps>({
  name: 'ARow',
  setup(_: RowProps, { slots, attrs }) {
    const rowContext = reactive<rowContextState>({
      gutter: undefined,
    });
    provide('rowContext', rowContext);

    const props = attrs as RowProps;

    let token: number;

    onMounted(() => {
      token = ResponsiveObserve.subscribe(screen => {
        const currentGutter = gutterRef.value || 0;
        if (
          (!Array.isArray(currentGutter) && typeof currentGutter === 'object') ||
          (Array.isArray(currentGutter) &&
            (typeof currentGutter[0] === 'object' || typeof currentGutter[1] === 'object'))
        ) {
          screens.value = screen;
        }
      });
    });

    onBeforeUnmount(() => {
      ResponsiveObserve.unsubscribe(token);
    });

    const screens = ref<ScreenMap>({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
      xxl: true,
    });
    const gutterRef = ref<Gutter | [Gutter, Gutter]>();
    gutterRef.value = props.gutter;

    const configProvider = inject('configProvider', defaultConfigProvider);
    const { getPrefixCls } = configProvider;

    const getGutter = (): [number, number] => {
      const results: [number, number] = [0, 0];
      const { gutter = 0 } = props;
      const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, 0];
      normalizedGutter.forEach((g, index) => {
        if (typeof g === 'object') {
          for (let i = 0; i < responsiveArray.length; i++) {
            const breakpoint: Breakpoint = responsiveArray[i];
            if (screens.value[breakpoint] && g[breakpoint] !== undefined) {
              results[index] = g[breakpoint] as number;
              break;
            }
          }
        } else {
          results[index] = g || 0;
        }
      });
      return results;
    };

    return () => {
      const {
        prefixCls: customizePrefixCls,
        justify,
        align,
        class: className,
        style,
        ...others
      } = props;
      const prefixCls = getPrefixCls('row', customizePrefixCls);
      const gutter = getGutter();
      const classes = classNames(
        prefixCls,
        {
          [`${prefixCls}-${justify}`]: justify,
          [`${prefixCls}-${align}`]: align,
        },
        className,
      );
      const rowStyle = {
        ...(gutter[0]! > 0
          ? {
              marginLeft: gutter[0]! / -2,
              marginRight: gutter[0]! / -2,
            }
          : {}),
        ...(gutter[1]! > 0
          ? {
              marginTop: gutter[1]! / -2,
              marginBottom: gutter[1]! / 2,
            }
          : {}),
      };
      const otherProps = { ...others, style };
      delete otherProps.gutter;

      rowContext.gutter = gutter;
      return (
        <div {...otherProps} class={classes} style={rowStyle}>
          {slots.default?.()}
        </div>
      );
    };
  },
});
