import { cloneVNode, isVNode } from 'vue';
import type { VNode, FunctionalComponent, PropType } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';
import type { RenderNode } from './BaseSelect';

export interface TransBtnProps {
  class: string;
  customizeIcon: RenderNode;
  customizeIconProps?: any;
  onMousedown?: (payload: MouseEvent) => void;
  onClick?: (payload: MouseEvent) => void;
}

export interface TransBtnType extends FunctionalComponent<TransBtnProps> {
  displayName: string;
}

const TransBtn: TransBtnType = (props, { slots }) => {
  const { class: className, customizeIcon, customizeIconProps, onMousedown, onClick } = props;
  let icon: VueNode;

  if (typeof customizeIcon === 'function') {
    icon = customizeIcon(customizeIconProps);
  } else {
    icon = isVNode(customizeIcon) ? cloneVNode(customizeIcon as VNode) : customizeIcon;
  }

  return (
    <span
      class={className}
      onMousedown={event => {
        event.preventDefault();
        if (onMousedown) {
          onMousedown(event);
        }
      }}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      unselectable="on"
      onClick={onClick}
      aria-hidden
    >
      {icon !== undefined ? (
        icon
      ) : (
        <span class={className.split(/\s+/).map((cls: any) => `${cls}-icon`)}>
          {slots.default?.()}
        </span>
      )}
    </span>
  );
};

TransBtn.inheritAttrs = false;
TransBtn.displayName = 'TransBtn';
TransBtn.props = {
  class: String,
  customizeIcon: PropTypes.any,
  customizeIconProps: PropTypes.any,
  onMousedown: Function as PropType<MouseEventHandler>,
  onClick: Function as PropType<MouseEventHandler>,
};

export default TransBtn;
