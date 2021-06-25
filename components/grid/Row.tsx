import type { ExtractPropTypes, CSSProperties } from 'vue';
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import classNames from '../_util/classNames';
import { tuple } from '../_util/type';
import PropTypes from '../_util/vue-types';
import type { Breakpoint, ScreenMap } from '../_util/responsiveObserve';
import ResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import useConfigInject from '../_util/hooks/useConfigInject';
import useFlexGapSupport from '../_util/hooks/useFlexGapSupport';
import useProvideRow from './context';

const RowAligns = tuple('top', 'middle', 'bottom', 'stretch');
const RowJustify = tuple('start', 'end', 'center', 'space-around', 'space-between');

export type Gutter = number | Partial<Record<Breakpoint, number>>;

export interface rowContextState {
  gutter?: [number, number];
}

const rowProps = {
  type: PropTypes.oneOf(['flex']),
  align: PropTypes.oneOf(RowAligns),
  justify: PropTypes.oneOf(RowJustify),
  prefixCls: PropTypes.string,
  gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]).def(0),
  wrap: PropTypes.looseBool,
};

export type RowProps = Partial<ExtractPropTypes<typeof rowProps>>;

const ARow = defineComponent({
  name: 'ARow',
  props: rowProps,
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('row', props);

    let token: number;

    const screens = ref<ScreenMap>({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
      xxl: true,
    });

    const supportFlexGap = useFlexGapSupport();

    onMounted(() => {
      token = ResponsiveObserve.subscribe(screen => {
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
      ResponsiveObserve.unsubscribe(token);
    });

    const gutter = computed(() => {
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
    });

    useProvideRow({
      gutter,
      supportFlexGap,
      wrap: computed(() => props.wrap),
    });

    const classes = computed(() =>
      classNames(prefixCls.value, {
        [`${prefixCls.value}-no-wrap`]: props.wrap === false,
        [`${prefixCls.value}-${props.justify}`]: props.justify,
        [`${prefixCls.value}-${props.align}`]: props.align,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      }),
    );

    const rowStyle = computed(() => {
      const gt = gutter.value;
      // Add gutter related style
      const style: CSSProperties = {};
      const horizontalGutter = gt[0] > 0 ? `${gt[0] / -2}px` : undefined;
      const verticalGutter = gt[1] > 0 ? `${gt[1] / -2}px` : undefined;

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

    return () => {
      return (
        <div class={classes.value} style={rowStyle.value}>
          {slots.default?.()}
        </div>
      );
    };
  },
});

export default ARow;
