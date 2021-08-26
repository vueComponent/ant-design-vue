import type { CSSProperties } from 'vue';
import { computed, defineComponent } from 'vue';
import { presetPrimaryColors } from '@ant-design/colors';
import { Circle as VCCircle } from '../vc-progress';
import { getSuccessPercent, validProgress } from './utils';
import type { ProgressProps } from './props';
import { progressProps } from './props';

export type CircleProps = ProgressProps;

function getPercentage({ percent, success, successPercent }: CircleProps) {
  const realSuccessPercent = validProgress(getSuccessPercent({ success, successPercent }));
  return [realSuccessPercent, validProgress(validProgress(percent) - realSuccessPercent)];
}

export default defineComponent({
  inheritAttrs: false,
  props: progressProps(),
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
      const circleSize = props.width || 120;
      return {
        width: typeof circleSize === 'number' ? `${circleSize}px` : circleSize,
        height: typeof circleSize === 'number' ? `${circleSize}px` : circleSize,
        fontSize: `${circleSize * 0.15 + 6}px`,
      };
    });

    const circleWidth = computed(() => props.strokeWidth || 6);
    const gapPos = computed(
      () => props.gapPosition || (props.type === 'dashboard' && 'bottom') || 'top',
    );

    // using className to style stroke color
    const strokeColor = computed(() => [presetPrimaryColors.green, props.strokeColor || null]);
    const percent = computed(() => getPercentage(props));
    const isGradient = computed(
      () => Object.prototype.toString.call(props.strokeColor) === '[object Object]',
    );

    const wrapperClassName = computed(() => ({
      [`${props.prefixCls}-inner`]: true,
      [`${props.prefixCls}-circle-gradient`]: isGradient.value,
    }));

    return () => (
      <div class={wrapperClassName.value} style={circleStyle.value}>
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
        {slots.default?.()}
      </div>
    );
  },
});
