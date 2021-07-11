import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import { Circle as VCCircle } from '../vc-progress';
import { getSuccessPercent, validProgress } from './utils';
import { progressProps } from './props';
import PropTypes from '../_util/vue-types';

const circleProps = {
  ...progressProps,
  prefixCls: PropTypes.string,
  // progressStatus: PropTypes.string,
};
export type CircleProps = Partial<ExtractPropTypes<typeof circleProps>>;

const statusColorMap = {
  normal: '#108ee9',
  exception: '#ff5500',
  success: '#87d068',
};

function getPercentage(
  percent: CircleProps['percent'],
  success: CircleProps['success'],
  successPercent: CircleProps['successPercent'],
) {
  const ptg = validProgress(percent);
  const realSuccessPercent = getSuccessPercent(success, successPercent);
  if (!realSuccessPercent) {
    return ptg;
  }
  return [
    validProgress(realSuccessPercent),
    validProgress(ptg - validProgress(realSuccessPercent)),
  ];
}

function getStrokeColor(
  success: CircleProps['success'],
  strokeColor: CircleProps['strokeColor'],
  successPercent: CircleProps['successPercent'],
) {
  const color = strokeColor || null;
  const realSuccessPercent = getSuccessPercent(success, successPercent);
  if (!realSuccessPercent) {
    return color;
  }
  return [statusColorMap.success, color];
}

export default defineComponent({
  props: progressProps,
  inheritAttrs: false,
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
    const strokeColor = computed(() =>
      getStrokeColor(props.success, props.strokeColor, props.successPercent),
    );
    const percent = computed(() =>
      getPercentage(props.percent, props.success, props.successPercent),
    );
    const isGradient = computed(
      () => Object.prototype.toString.call(strokeColor.value) === '[object Object]',
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
