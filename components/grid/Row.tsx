import type { ExtractPropTypes, CSSProperties } from 'vue';
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import classNames from '../_util/classNames';
import type { Breakpoint, ScreenMap } from '../_util/responsiveObserve';
import useResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useFlexGapSupport from '../_util/hooks/useFlexGapSupport';
import useProvideRow from './context';
import { useRowStyle } from './style';
import { someType } from '../_util/type';

const RowAligns = ['top', 'middle', 'bottom', 'stretch'] as const;
const RowJustify = [
  'start',
  'end',
  'center',
  'space-around',
  'space-between',
  'space-evenly',
] as const;

type Responsive = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
type ResponsiveLike<T> = {
  [key in Responsive]?: T;
};

type Gap = number | undefined;
export type Gutter = number | undefined | Partial<Record<Breakpoint, number>>;

type ResponsiveAligns = ResponsiveLike<(typeof RowAligns)[number]>;
type ResponsiveJustify = ResponsiveLike<(typeof RowJustify)[number]>;

export interface rowContextState {
  gutter?: [number, number];
}

export const rowProps = () => ({
  align: someType<(typeof RowAligns)[number] | ResponsiveAligns>([String, Object]),
  justify: someType<(typeof RowJustify)[number] | ResponsiveJustify>([String, Object]),
  prefixCls: String,
  gutter: someType<Gutter | [Gutter, Gutter]>([Number, Array, Object], 0),
  wrap: { type: Boolean, default: undefined },
});

export type RowProps = Partial<ExtractPropTypes<ReturnType<typeof rowProps>>>;

const ARow = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ARow',
  inheritAttrs: false,
  props: rowProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('row', props);
    const [wrapSSR, hashId] = useRowStyle(prefixCls);

    let token: number;

    const responsiveObserve = useResponsiveObserve();

    const screens = ref<ScreenMap>({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
      xxl: true,
    });

    const curScreens = ref<ScreenMap>({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
    });

    const mergePropsByScreen = (oriProp: 'align' | 'justify') => {
      return computed(() => {
        if (typeof props[oriProp] === 'string') {
          return props[oriProp];
        }
        if (typeof props[oriProp] !== 'object') {
          return '';
        }

        for (let i = 0; i < responsiveArray.length; i++) {
          const breakpoint: Breakpoint = responsiveArray[i];
          // if do not match, do nothing
          if (!curScreens.value[breakpoint]) continue;
          const curVal = props[oriProp][breakpoint];
          if (curVal !== undefined) {
            return curVal;
          }
        }
        return '';
      });
    };

    const mergeAlign = mergePropsByScreen('align');
    const mergeJustify = mergePropsByScreen('justify');

    const supportFlexGap = useFlexGapSupport();

    onMounted(() => {
      token = responsiveObserve.value.subscribe(screen => {
        curScreens.value = screen;
        const currentGutter = props.gutter || 0;
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
      responsiveObserve.value.unsubscribe(token);
    });

    const gutter = computed(() => {
      const results: [Gap, Gap] = [undefined, undefined];
      const { gutter = 0 } = props;
      const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, undefined];
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
          results[index] = g;
        }
      });
      return results;
    });

    useProvideRow({
      gutter,
      supportFlexGap,
      wrap: computed(() => props.wrap),
    });

    const classes = computed(() =>
      classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-no-wrap`]: props.wrap === false,
          [`${prefixCls.value}-${mergeJustify.value}`]: mergeJustify.value,
          [`${prefixCls.value}-${mergeAlign.value}`]: mergeAlign.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        attrs.class,
        hashId.value,
      ),
    );

    const rowStyle = computed(() => {
      const gt = gutter.value;
      // Add gutter related style
      const style: CSSProperties = {};
      const horizontalGutter = gt[0] != null && gt[0] > 0 ? `${gt[0] / -2}px` : undefined;
      const verticalGutter = gt[1] != null && gt[1] > 0 ? `${gt[1] / -2}px` : undefined;

      if (horizontalGutter) {
        style.marginLeft = horizontalGutter;
        style.marginRight = horizontalGutter;
      }

      if (supportFlexGap.value) {
        // Set gap direct if flex gap support
        style.rowGap = `${gt[1]}px`;
      } else if (verticalGutter) {
        style.marginTop = verticalGutter;
        style.marginBottom = verticalGutter;
      }
      return style;
    });

    return () =>
      wrapSSR(
        <div
          {...attrs}
          class={classes.value}
          style={{ ...rowStyle.value, ...(attrs.style as CSSProperties) }}
        >
          {slots.default?.()}
        </div>,
      );
  },
});

export default ARow;
