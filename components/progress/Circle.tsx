import type { CSSProperties } from 'vue';
import { computed, defineComponent } from 'vue';
import { Circle as VCCircle } from '../vc-progress';
import { getPercentage, getSize, getStrokeColor } from './utils';
import type { ProgressProps, ProgressGradient } from './props';
import { progressProps } from './props';
import { initDefaultProps } from '../_util/props-util';
import Tooltip from '../tooltip';
import { anyType } from '../_util/type';

export interface CircleProps extends ProgressProps {
  strokeColor?: string | ProgressGradient;
}

export const circleProps = () => ({
  ...progressProps(),
  strokeColor: anyType<string | ProgressGradient>(),
});

const CIRCLE_MIN_STROKE_WIDTH = 3;

const getMinPercent = (width: number): number => (CIRCLE_MIN_STROKE_WIDTH / width) * 100;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ProgressCircle',
  inheritAttrs: false,
  props: initDefaultProps(circleProps(), {
    trailColor: null as unknown as string,
  }),
  setup(props, { slots, attrs }) {
    const originWidth = computed(() => props.width ?? 120);
    const mergedSize = computed(() => props.size ?? [originWidth.value, originWidth.value]);

    const sizeRef = computed(() => getSize(mergedSize.value as ProgressProps['size'], 'circle'));
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
      return {
        width: `${sizeRef.value.width}px`,
        height: `${sizeRef.value.height}px`,
        fontSize: `${sizeRef.value.width * 0.15 + 6}px`,
      };
    });

    const circleWidth = computed(
      () => props.strokeWidth ?? Math.max(getMinPercent(sizeRef.value.width), 6),
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
        <div
          {...attrs}
          class={[wrapperClassName.value, attrs.class]}
          style={[attrs.style as CSSProperties, circleStyle.value]}
        >
          {sizeRef.value.width <= 20 ? (
            <Tooltip v-slots={{ title: slots.default }}>
              <span>{circleContent}</span>
            </Tooltip>
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
