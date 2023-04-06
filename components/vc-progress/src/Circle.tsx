import { useTransitionDuration, defaultProps } from './common';
import type { GapPositionType } from './types';
import { propTypes } from './types';
import { computed, defineComponent, ref } from 'vue';
import initDefaultProps from '../../_util/props-util/initDefaultProps';
import useRefs from '../../_util/hooks/useRefs';

let gradientSeed = 0;

function stripPercentToNumber(percent: string) {
  return +percent.replace('%', '');
}

function toArray(value: any) {
  return Array.isArray(value) ? value : [value];
}

function getPathStyles(
  offset: number,
  percent: number,
  strokeColor: string,
  strokeWidth: number,
  gapDegree = 0,
  gapPosition: GapPositionType,
) {
  const radius = 50 - strokeWidth / 2;
  let beginPositionX = 0;
  let beginPositionY = -radius;
  let endPositionX = 0;
  let endPositionY = -2 * radius;
  switch (gapPosition) {
    case 'left':
      beginPositionX = -radius;
      beginPositionY = 0;
      endPositionX = 2 * radius;
      endPositionY = 0;
      break;
    case 'right':
      beginPositionX = radius;
      beginPositionY = 0;
      endPositionX = -2 * radius;
      endPositionY = 0;
      break;
    case 'bottom':
      beginPositionY = radius;
      endPositionY = 2 * radius;
      break;
    default:
  }
  const pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
   a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
   a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;
  const len = Math.PI * 2 * radius;

  const pathStyle = {
    stroke: strokeColor,
    strokeDasharray: `${(percent / 100) * (len - gapDegree)}px ${len}px`,
    strokeDashoffset: `-${gapDegree / 2 + (offset / 100) * (len - gapDegree)}px`,
    transition:
      'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s', // eslint-disable-line
  };

  return {
    pathString,
    pathStyle,
  };
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'VCCircle',
  props: initDefaultProps(propTypes, defaultProps),
  setup(props) {
    gradientSeed += 1;
    const gradientId = ref(gradientSeed);
    const percentList = computed(() => toArray(props.percent));
    const strokeColorList = computed(() => toArray(props.strokeColor));

    const [setRef, paths] = useRefs();
    useTransitionDuration(paths);

    const getStokeList = () => {
      const { prefixCls, strokeWidth, strokeLinecap, gapDegree, gapPosition } = props;

      let stackPtg = 0;
      return percentList.value.map((ptg, index) => {
        const color =
          strokeColorList.value[index] || strokeColorList.value[strokeColorList.value.length - 1];
        const stroke =
          Object.prototype.toString.call(color) === '[object Object]'
            ? `url(#${prefixCls}-gradient-${gradientId.value})`
            : '';
        const { pathString, pathStyle } = getPathStyles(
          stackPtg,
          ptg,
          color,
          strokeWidth,
          gapDegree,
          gapPosition,
        );

        stackPtg += ptg;

        const pathProps = {
          key: index,
          d: pathString,
          stroke,
          'stroke-linecap': strokeLinecap,
          'stroke-width': strokeWidth,
          opacity: ptg === 0 ? 0 : 1,
          'fill-opacity': '0',
          class: `${prefixCls}-circle-path`,
          style: pathStyle,
        };
        return <path ref={setRef(index)} {...pathProps} />;
      });
    };

    return () => {
      const {
        prefixCls,
        strokeWidth,
        trailWidth,
        gapDegree,
        gapPosition,
        trailColor,
        strokeLinecap,
        strokeColor,
        ...restProps
      } = props;
      const { pathString, pathStyle } = getPathStyles(
        0,
        100,
        trailColor,
        strokeWidth,
        gapDegree,
        gapPosition,
      );
      delete restProps.percent;
      const gradient = strokeColorList.value.find(
        color => Object.prototype.toString.call(color) === '[object Object]',
      );
      const pathFirst = {
        d: pathString,
        stroke: trailColor,
        'stroke-linecap': strokeLinecap,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0',
        class: `${prefixCls}-circle-trail`,
        style: pathStyle,
      };
      return (
        <svg class={`${prefixCls}-circle`} viewBox="0 0 100 100" {...restProps}>
          {gradient && (
            <defs>
              <linearGradient
                id={`${prefixCls}-gradient-${gradientId.value}`}
                x1="100%"
                y1="0%"
                x2="0%"
                y2="0%"
              >
                {Object.keys(gradient)
                  .sort((a, b) => stripPercentToNumber(a) - stripPercentToNumber(b))
                  .map((key, index) => (
                    <stop key={index} offset={key} stop-color={gradient[key]} />
                  ))}
              </linearGradient>
            </defs>
          )}
          <path {...pathFirst} />
          {getStokeList().reverse()}
        </svg>
      );
    };
  },
});
