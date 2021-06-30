import type { FunctionalComponent, VNodeChild } from 'vue';
import PropTypes from '../_util/vue-types';

export interface TransBtnProps {
  class: string;
  customizeIcon: VNodeChild | ((props?: any) => VNodeChild);
  customizeIconProps?: any;
  onMousedown?: (payload: MouseEvent) => void;
  onClick?: (payload: MouseEvent) => void;
}

export interface TransBtnType extends FunctionalComponent<TransBtnProps> {
  displayName: string;
}

const TransBtn: TransBtnType = (props, { slots }) => {
  const { class: className, customizeIcon, customizeIconProps, onMousedown, onClick } = props;
  let icon: VNodeChild;

  if (typeof customizeIcon === 'function') {
    icon = customizeIcon(customizeIconProps);
  } else {
    icon = customizeIcon;
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
  class: PropTypes.string,
  customizeIcon: PropTypes.any,
  customizeIconProps: PropTypes.any,
  onMousedown: PropTypes.func,
  onClick: PropTypes.func,
};

export default TransBtn;
