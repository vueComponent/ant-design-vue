import type { CSSProperties } from 'vue';
import { computed, defineComponent } from 'vue';
import { Circle as VCCircle } from '../vc-progress';
import { getPercentage, getStrokeColor } from './utils';
import type { ProgressProps } from './props';
import { progressProps } from './props';
import { initDefaultProps } from '../_util/props-util';
import Tooltip from '../tooltip';

export type CircleProps = ProgressProps;

const CIRCLE_MIN_STROKE_WIDTH = 3;

const getMinPercent = (width: number): number => (CIRCLE_MIN_STROKE_WIDTH / width) * 100;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Circle',
  inheritAttrs: false,
  props: initDefaultProps(progressProps(), {
    width: 120,
    trailColor: null as unknown as string,
  }),
  setup(props, { slots }) {
    const gapDeg = computed(() => {
      // Support gapDeg = 0 when type = 'dashboard'
      if (props.gapDegree || props.gapDegree === 0) {
        return props.gapDegree;
      }
      if (props.type === 'dashboard') {
        return 75;
      }
      return undefined;
    });

    const circleStyle = computed<CSSProperties>(() => {
      const circleSize = props.width;
      return {
        width: typeof circleSize === 'number' ? `${circleSize}px` : circleSize,
        height: typeof circleSize === 'number' ? `${circleSize}px` : circleSize,
        fontSize: `${circleSize * 0.15 + 6}px`,
      };
    });

    const circleWidth = computed(
      () => props.strokeWidth ?? Math.max(getMinPercent(props.width), 6),
    );
    const gapPos = computed(
      () => props.gapPosition || (props.type === 'dashboard' && 'bottom') || undefined,
    );

    // using className to style stroke color
    const percent = computed(() => getPercentage(props));
    const isGradient = computed(
      () => Object.prototype.toString.call(props.strokeColor) === '[object Object]',
    );
    const strokeColor = computed(() =>
      getStrokeColor({ success: props.success, strokeColor: props.strokeColor }),
    );
    const wrapperClassName = computed(() => ({
      [`${props.prefixCls}-inner`]: true,
      [`${props.prefixCls}-circle-gradient`]: isGradient.value,
    }));

    return () => {
      const circleContent = (
        <VCCircle
          percent={percent.value}
          strokeWidth={circleWidth.value}
          trailWidth={circleWidth.value}
          strokeColor={strokeColor.value}
          strokeLinecap={props.strokeLinecap}
          trailColor={props.trailColor}
          prefixCls={props.prefixCls}
          gapDegree={gapDeg.value}
          gapPosition={gapPos.value}
        />
      );
      return (
        <div class={wrapperClassName.value} style={circleStyle.value}>
          {props.width <= 20 ? (
            <Tooltip v-slots={{ title: slots.default }}>{circleContent}</Tooltip>
          ) : (
            <>
              {circleContent}
              {slots.default?.()}
            </>
          )}
        </div>
      );
    };
  },
});
