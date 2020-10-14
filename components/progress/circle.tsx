import { Circle as VCCircle } from '../vc-progress';
import { validProgress } from './utils';
import { HTMLAttributes, SetupContext } from 'vue';
import { PresetColorType, PresetStatusColorType } from '../_util/colors';
import { LiteralUnion } from '../_util/type';

const statusColorMap: any = {
  normal: '#108ee9',
  exception: '#ff5500',
  success: '#87d068',
};

export interface CircleProps extends HTMLAttributes {
  prefixCls?: string;
  width?: number;
  strokeWidth?: number;
  trailColor?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
  strokeLinecap?: string;
  gapPosition?: string;
  gapDegree?: number;
  type?: string;
  progressStatus?: string | 'normal' | 'exception' | 'active' | 'success';
  successPercent?: number;
  percent?: number;
  strokeColor?: string;
}

function getPercentage({ percent, successPercent }: { percent?: number; successPercent?: number }) {
  const ptg = validProgress(percent);

  if (!successPercent) return ptg;

  const successPtg = validProgress(successPercent);
  return [successPercent, validProgress(ptg - successPtg)];
}

function getStrokeColor({
  progressStatus,
  successPercent,
  strokeColor,
}: {
  progressStatus?: string;
  successPercent?: number;
  strokeColor?: string;
}) {
  const color = strokeColor || (progressStatus && statusColorMap[progressStatus]);
  if (!successPercent) return color;
  return [statusColorMap.success, color];
}

const Circle = (_: CircleProps, { attrs, slots }: SetupContext) => {
  const props = attrs as CircleProps;
  const {
    prefixCls,
    width,
    strokeWidth,
    trailColor,
    strokeLinecap,
    gapPosition,
    gapDegree,
    type,
  } = props;
  const circleSize = width || 120;
  const circleStyle = {
    width: typeof circleSize === 'number' ? `${circleSize}px` : circleSize,
    height: typeof circleSize === 'number' ? `${circleSize}px` : circleSize,
    fontSize: `${circleSize * 0.15 + 6}px`,
  };
  const circleWidth = strokeWidth || 6;
  const gapPos = gapPosition || (type === 'dashboard' && 'bottom') || 'top';
  const gapDeg = gapDegree || (type === 'dashboard' && 75);
  const strokeColor = getStrokeColor(props);
  const isGradient = Object.prototype.toString.call(strokeColor) === '[object Object]';

  const wrapperClassName = {
    [`${prefixCls}-inner`]: true,
    [`${prefixCls}-circle-gradient`]: isGradient,
  };

  return (
    <div class={wrapperClassName} style={circleStyle}>
      <VCCircle
        percent={getPercentage(props)}
        strokeWidth={circleWidth}
        trailWidth={circleWidth}
        strokeColor={strokeColor}
        strokeLinecap={strokeLinecap}
        trailColor={trailColor}
        prefixCls={prefixCls}
        gapDegree={gapDeg}
        gapPosition={gapPos}
      />
      {slots?.default?.()}
    </div>
  );
};

export default Circle;
