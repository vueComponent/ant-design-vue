import PanelContent from './PanelContent';
import { initDefaultProps } from '../_util/props-util';
import { collapsePanelProps } from './commonProps';
import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import Transition from '../_util/transition';
import classNames from '../_util/classNames';
import devWarning from '../vc-util/devWarning';
import useConfigInject from '../_util/hooks/useConfigInject';

export { collapsePanelProps };
export type CollapsePanelProps = Partial<ExtractPropTypes<ReturnType<typeof collapsePanelProps>>>;
export default defineComponent({
  name: 'ACollapsePanel',
  props: initDefaultProps(collapsePanelProps(), {
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
      props.disabled === undefined,
      'Collapse.Panel',
      '`disabled` is deprecated. Please use `collapsible="disabled"` instead.',
    );
    const { prefixCls } = useConfigInject('collapse', props);
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
      const prefixClsValue = prefixCls.value;
      const headerCls = classNames(`${prefixClsValue}-header`, {
        [headerClass]: headerClass,
        [`${prefixClsValue}-header-collapsible-only`]: collapsible === 'header',
      });
      const itemCls = classNames({
        [`${prefixClsValue}-item`]: true,
        [`${prefixClsValue}-item-active`]: isActive,
        [`${prefixClsValue}-item-disabled`]: disabled,
        [`${prefixClsValue}-no-arrow`]: !showArrow,
      });

      let icon = <i class="arrow" />;
      if (showArrow && typeof expandIcon === 'function') {
        icon = expandIcon(props);
      }

      const panelContent = (
        <PanelContent
          v-show={isActive}
          prefixCls={prefixClsValue}
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
              <span onClick={handleItemClick} class={`${prefixClsValue}-header-text`}>
                {header}
              </span>
            ) : (
              header
            )}
            {extra && <div class={`${prefixClsValue}-extra`}>{extra}</div>}
          </div>
          <Transition {...transitionProps}>
            {!destroyInactivePanel || isActive ? panelContent : null}
          </Transition>
        </div>
      );
    };
  },
});
