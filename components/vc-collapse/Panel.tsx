import PanelContent from './PanelContent';
import { initDefaultProps } from '../_util/props-util';
import { panelProps } from './commonProps';
import { defineComponent } from 'vue';
import Transition from '../_util/transition';
import classNames from '../_util/classNames';
import devWarning from '../vc-util/devWarning';

export default defineComponent({
  name: 'Panel',
  props: initDefaultProps(panelProps(), {
    showArrow: true,
    isActive: false,
    onItemClick() {},
    headerClass: '',
    forceRender: false,
  }),
  slots: ['expandIcon', 'extra', 'header'],
  emits: ['itemClick'],
  setup(props, { slots, emit }) {
    devWarning(
      !('disabled' in props),
      'Collapse.Panel',
      '`disabled` is deprecated. Please use `collapsible="disabled"` instead.',
    );
    const handleItemClick = () => {
      emit('itemClick', props.panelKey);
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
        handleItemClick();
      }
    };
    return () => {
      const {
        prefixCls,
        header = slots.header?.(),
        headerClass,
        isActive,
        showArrow,
        destroyInactivePanel,
        accordion,
        forceRender,
        openAnimation,
        expandIcon = slots.expandIcon,
        extra = slots.extra?.(),
        collapsible,
      } = props;
      const disabled = collapsible === 'disabled';

      const headerCls = classNames(`${prefixCls}-header`, {
        [headerClass]: headerClass,
        [`${prefixCls}-header-collapsible-only`]: collapsible === 'header',
      });
      const itemCls = classNames({
        [`${prefixCls}-item`]: true,
        [`${prefixCls}-item-active`]: isActive,
        [`${prefixCls}-item-disabled`]: disabled,
      });

      let icon = <i class="arrow" />;
      if (showArrow && typeof expandIcon === 'function') {
        icon = expandIcon(props);
      }

      const panelContent = (
        <PanelContent
          v-show={isActive}
          prefixCls={prefixCls}
          isActive={isActive}
          forceRender={forceRender}
          role={accordion ? 'tabpanel' : null}
          v-slots={{ default: slots.default }}
        ></PanelContent>
      );
      const transitionProps = {
        appear: true,
        css: false,
        ...openAnimation,
      };

      return (
        <div class={itemCls}>
          <div
            class={headerCls}
            onClick={() => collapsible !== 'header' && handleItemClick()}
            role={accordion ? 'tab' : 'button'}
            tabindex={disabled ? -1 : 0}
            aria-expanded={isActive}
            onKeypress={handleKeyPress}
          >
            {showArrow && icon}
            {collapsible === 'header' ? (
              <span onClick={handleItemClick} class={`${prefixCls}-header-text`}>
                {header}
              </span>
            ) : (
              header
            )}
            {extra && <div class={`${prefixCls}-extra`}>{extra}</div>}
          </div>
          <Transition {...transitionProps}>
            {!destroyInactivePanel || isActive ? panelContent : null}
          </Transition>
        </div>
      );
    };
  },
});
