import { LiteralUnion, tuple } from '../_util/type';
import { PresetColorType } from '../_util/colors';
import { isPresetColor } from './utils';
import { defaultConfigProvider } from '../config-provider';
import { HTMLAttributes, FunctionalComponent, VNodeTypes, inject, CSSProperties } from 'vue';
import PropTypes from '../_util/vue-types';

type RibbonPlacement = 'start' | 'end';

export interface RibbonProps extends HTMLAttributes {
  prefixCls?: string;
  text?: VNodeTypes;
  color?: LiteralUnion<PresetColorType, string>;
  placement?: RibbonPlacement;
}

const Ribbon: FunctionalComponent<RibbonProps> = (props, { attrs, slots }) => {
  const { prefixCls: customizePrefixCls, color, text = slots.text?.(), placement = 'end' } = props;
  const { class: className, style } = attrs;
  const children = slots.default?.();
  const { getPrefixCls, direction } = inject('configProvider', defaultConfigProvider);

  const prefixCls = getPrefixCls('ribbon', customizePrefixCls);
  const colorInPreset = isPresetColor(color);
  const ribbonCls = [
    prefixCls,
    `${prefixCls}-placement-${placement}`,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-color-${color}`]: colorInPreset,
    },
    className,
  ];
  const colorStyle: CSSProperties = {};
  const cornerColorStyle: CSSProperties = {};
  if (color && !colorInPreset) {
    colorStyle.background = color;
    cornerColorStyle.color = color;
  }
  return (
    <div class={`${prefixCls}-wrapper`}>
      {children}
      <div class={ribbonCls} style={{ ...colorStyle, ...(style as CSSProperties) }}>
        <span class={`${prefixCls}-text`}>{text}</span>
        <div class={`${prefixCls}-corner`} style={cornerColorStyle} />
      </div>
    </div>
  );
};

Ribbon.displayName = 'ABadgeRibbon';
Ribbon.inheritAttrs = false;
Ribbon.props = {
  prefix: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.any,
  placement: PropTypes.oneOf(tuple('start', 'end')),
};

export default Ribbon;
