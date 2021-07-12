import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Direction } from '../config-provider';
import PropTypes from '../_util/vue-types';
import type { StringGradients, ProgressGradient } from './props';
import { progressProps } from './props';
import { getSuccessPercent, validProgress } from './utils';

const lineProps = {
  ...progressProps(),
  prefixCls: PropTypes.string,
  direction: {
    type: String as PropType<Direction>,
  },
};

export type LineProps = Partial<ExtractPropTypes<typeof lineProps>>;

/**
 * {
 *   '0%': '#afc163',
 *   '75%': '#009900',
 *   '50%': 'green',     ====>     '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
 *   '25%': '#66FF00',
 *   '100%': '#ffffff'
 * }
 */
export const sortGradient = (gradients: StringGradients) => {
  let tempArr = [];
  Object.keys(gradients).forEach(key => {
    const formattedKey = parseFloat(key.replace(/%/g, ''));
    if (!isNaN(formattedKey)) {
      tempArr.push({
        key: formattedKey,
        value: gradients[key],
      });
    }
  });
  tempArr = tempArr.sort((a, b) => a.key - b.key);
  return tempArr.map(({ key, value }) => `${value} ${key}%`).join(', ');
};

/**
 * Then this man came to realize the truth: Besides six pence, there is the moon. Besides bread and
 * butter, there is the bug. And... Besides women, there is the code.
 *
 * @example
 *   {
 *     "0%": "#afc163",
 *     "25%": "#66FF00",
 *     "50%": "#00CC00", // ====>  linear-gradient(to right, #afc163 0%, #66FF00 25%,
 *     "75%": "#009900", //        #00CC00 50%, #009900 75%, #ffffff 100%)
 *     "100%": "#ffffff"
 *   }
 */
export const handleGradient = (strokeColor: ProgressGradient, directionConfig: Direction) => {
  const {
    from = '#1890ff',
    to = '#1890ff',
    direction = directionConfig === 'rtl' ? 'to left' : 'to right',
    ...rest
  } = strokeColor;
  if (Object.keys(rest).length !== 0) {
    const sortedGradients = sortGradient(rest as StringGradients);
    return { backgroundImage: `linear-gradient(${direction}, ${sortedGradients})` };
  }
  return { backgroundImage: `linear-gradient(${direction}, ${from}, ${to})` };
};

export default defineComponent({
  name: 'Line',
  props: lineProps,
  setup(props, { slots }) {
    const backgroundProps = computed(() => {
      const { strokeColor, direction } = props;
      return strokeColor && typeof strokeColor !== 'string'
        ? handleGradient(strokeColor, direction)
        : {
            background: strokeColor,
          };
    });

    const trailStyle = computed(() =>
      props.trailColor
        ? {
            backgroundColor: props.trailColor,
          }
        : undefined,
    );

    const percentStyle = computed<CSSProperties>(() => {
      const { percent, strokeWidth, strokeLinecap, size } = props;
      return {
        width: `${validProgress(percent)}%`,
        height: `${strokeWidth || (size === 'small' ? 6 : 8)}px`,
        borderRadius: strokeLinecap === 'square' ? 0 : '',
        ...(backgroundProps.value as any),
      };
    });

    const successPercent = computed(() => {
      return getSuccessPercent(props);
    });
    const successPercentStyle = computed<CSSProperties>(() => {
      const { strokeWidth, size, strokeLinecap, success } = props;
      return {
        width: `${validProgress(successPercent.value)}%`,
        height: `${strokeWidth || (size === 'small' ? 6 : 8)}px`,
        borderRadius: strokeLinecap === 'square' ? 0 : '',
        backgroundColor: success?.strokeColor,
      };
    });

    return () => (
      <>
        <div class={`${props.prefixCls}-outer`}>
          <div class={`${props.prefixCls}-inner`} style={trailStyle.value}>
            <div class={`${props.prefixCls}-bg`} style={percentStyle.value} />
            {successPercent.value !== undefined ? (
              <div class={`${props.prefixCls}-success-bg`} style={successPercentStyle.value} />
            ) : null}
          </div>
        </div>
        {slots.default?.()}
      </>
    );
  },
});
