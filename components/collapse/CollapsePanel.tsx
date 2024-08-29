import PanelContent from './PanelContent';
import { initDefaultProps } from '../_util/props-util';
import { collapsePanelProps } from './commonProps';
import type { ExtractPropTypes } from 'vue';
import { defineComponent, Transition } from 'vue';
import classNames from '../_util/classNames';
import devWarning from '../vc-util/devWarning';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
export { collapsePanelProps };
export type CollapsePanelProps = Partial<ExtractPropTypes<ReturnType<typeof collapsePanelProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACollapsePanel',
  inheritAttrs: false,
  props: initDefaultProps(collapsePanelProps(), {
    showArrow: true,
    isActive: false,
    onItemClick() {},
    headerClass: '',
    forceRender: false,
  }),
  slots: Object as CustomSlotsType<{
    expandIcon?: any;
    extra?: any;
    header?: any;
    default?: any;
  }>,

  // emits: ['itemClick'],
  setup(props, { slots, emit, attrs }) {
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
        [`${prefixClsValue}-icon-collapsible-only`]: collapsible === 'icon',
      });
      const itemCls = classNames({
        [`${prefixClsValue}-item`]: true,
        [`${prefixClsValue}-item-active`]: isActive,
        [`${prefixClsValue}-item-disabled`]: disabled,
        [`${prefixClsValue}-no-arrow`]: !showArrow,
        [`${attrs.class}`]: !!attrs.class,
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
        appear: false,
        css: false,
        ...openAnimation,
      };

      return (
        <div {...attrs} class={itemCls}>
          <div
            class={headerCls}
            onClick={() => !['header', 'icon'].includes(collapsible) && handleItemClick()}
            role={accordion ? 'tab' : 'button'}
            tabindex={disabled ? -1 : 0}
            aria-expanded={isActive}
            onKeypress={handleKeyPress}
          >
            {showArrow && icon}
            <span
              onClick={() => collapsible === 'header' && handleItemClick()}
              class={`${prefixClsValue}-header-text`}
            >
              {header}
            </span>
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
