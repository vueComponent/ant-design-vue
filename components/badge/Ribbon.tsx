import type { CustomSlotsType, LiteralUnion } from '../_util/type';
import type { PresetColorType } from '../_util/colors';
import useStyle from './style';
import { isPresetColor } from '../_util/colors';
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import { defineComponent, computed } from 'vue';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../config-provider/hooks/useConfigInject';

export const ribbonProps = () => ({
  prefix: String,
  color: { type: String as PropType<LiteralUnion<PresetColorType>> },
  text: PropTypes.any,
  placement: { type: String as PropType<'start' | 'end'>, default: 'end' },
});

export type RibbonProps = Partial<ExtractPropTypes<ReturnType<typeof ribbonProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABadgeRibbon',
  inheritAttrs: false,
  props: ribbonProps(),
  slots: Object as CustomSlotsType<{
    text: any;
    default: any;
  }>,
  setup(props, { attrs, slots }) {
    const { prefixCls, direction } = useConfigInject('ribbon', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const colorInPreset = computed(() => isPresetColor(props.color, false));
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
      return wrapSSR(
        <div class={`${prefixCls.value}-wrapper ${hashId.value}`} {...restAttrs}>
          {slots.default?.()}
          <div
            class={[ribbonCls.value, className, hashId.value]}
            style={{ ...colorStyle, ...(style as CSSProperties) }}
          >
            <span class={`${prefixCls.value}-text`}>{props.text || slots.text?.()}</span>
            <div class={`${prefixCls.value}-corner`} style={cornerColorStyle} />
          </div>
        </div>,
      );
    };
  },
});
