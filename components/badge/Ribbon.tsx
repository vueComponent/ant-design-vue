import type { LiteralUnion } from '../_util/type';
import { tuple } from '../_util/type';
import type { PresetColorType } from '../_util/colors';
import { isPresetColor } from './utils';
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import { defineComponent, computed } from 'vue';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../_util/hooks/useConfigInject';

const ribbonProps = {
  prefix: PropTypes.string,
  color: { type: String as PropType<LiteralUnion<PresetColorType, string>> },
  text: PropTypes.any,
  placement: PropTypes.oneOf(tuple('start', 'end')).def('end'),
};

export type RibbonProps = Partial<ExtractPropTypes<typeof ribbonProps>>;

export default defineComponent({
  name: 'ABadgeRibbon',
  inheritAttrs: false,
  props: ribbonProps,
  slots: ['text'],
  setup(props, { attrs, slots }) {
    const { prefixCls, direction } = useConfigInject('ribbon', props);
    const colorInPreset = computed(() => isPresetColor(props.color));
    const ribbonCls = computed(() => [
      prefixCls.value,
      `${prefixCls.value}-placement-${props.placement}`,
      {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-color-${props.color}`]: colorInPreset.value,
      },
    ]);
    return () => {
      const { class: className, style, ...restAttrs } = attrs;
      const colorStyle: CSSProperties = {};
      const cornerColorStyle: CSSProperties = {};
      if (props.color && !colorInPreset.value) {
        colorStyle.background = props.color;
        cornerColorStyle.color = props.color;
      }
      return (
        <div class={`${prefixCls.value}-wrapper`} {...restAttrs}>
          {slots.default?.()}
          <div
            class={[ribbonCls.value, className]}
            style={{ ...colorStyle, ...(style as CSSProperties) }}
          >
            <span class={`${prefixCls.value}-text`}>{props.text || slots.text?.()}</span>
            <div class={`${prefixCls.value}-corner`} style={cornerColorStyle} />
          </div>
        </div>
      );
    };
  },
});
