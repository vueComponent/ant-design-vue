import PanelContent from './PanelContent';
import { initDefaultProps, getComponentFromProp } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import { panelProps } from './commonProps';

export default {
  name: 'Panel',
  props: initDefaultProps(panelProps, {
    showArrow: true,
    isActive: false,
    destroyInactivePanel: false,
    headerClass: '',
    forceRender: false,
  }),
  methods: {
    handleItemClick() {
      this.$emit('itemClick');
    },
    handleKeyPress(e) {
      if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
        this.handleItemClick();
      }
    },
  },
  render() {
    const {
      prefixCls,
      headerClass,
      isActive,
      showArrow,
      destroyInactivePanel,
      disabled,
      openAnimation,
      accordion,
      forceRender,
      expandIcon,
    } = this.$props;
    const { $slots } = this;

    const transitionProps = {
      props: Object.assign({
        appear: true,
        css: false,
      }),
      on: { ...openAnimation },
    };
    const headerCls = {
      [`${prefixCls}-header`]: true,
      [headerClass]: headerClass,
    };
    const header = getComponentFromProp(this, 'header');
    const itemCls = {
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-active`]: isActive,
      [`${prefixCls}-item-disabled`]: disabled,
    };
    let icon = null;
    if (showArrow && typeof expandIcon === 'function') {
      icon = cloneElement(expandIcon(this.$props));
    }
    return (
      <div class={itemCls} role="tablist">
        <div
          class={headerCls}
          onClick={this.handleItemClick.bind(this)}
          onKeypress={this.handleKeyPress}
          role={accordion ? 'tab' : 'button'}
          tabIndex={disabled ? -1 : 0}
          aria-expanded={isActive}
        >
          {showArrow && (icon || <i class="arrow" />)}
          {header}
        </div>
        <transition {...transitionProps}>
          <PanelContent
            v-show={isActive}
            prefixCls={prefixCls}
            isActive={isActive}
            destroyInactivePanel={destroyInactivePanel}
            forceRender={forceRender}
            role={accordion ? 'tabpanel' : null}
          >
            {$slots.default}
          </PanelContent>
        </transition>
      </div>
    );
  },
};
