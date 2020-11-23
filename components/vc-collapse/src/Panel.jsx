import PanelContent from './PanelContent';
import { initDefaultProps, getComponent, getSlot } from '../../_util/props-util';
import { panelProps } from './commonProps';
import { defineComponent } from 'vue';
import BaseMixin from '../../_util/BaseMixin';
import Transition from '../../_util/transition';

export default defineComponent({
  name: 'Panel',
  mixins: [BaseMixin],
  props: initDefaultProps(panelProps(), {
    showArrow: true,
    isActive: false,
    destroyInactivePanel: false,
    headerClass: '',
    forceRender: false,
  }),
  methods: {
    handleItemClick() {
      this.__emit('itemClick', this.panelKey);
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
      extra,
    } = this.$props;

    const transitionProps = {
      appear: true,
      css: false,
      ...openAnimation,
    };
    const headerCls = {
      [`${prefixCls}-header`]: true,
      [headerClass]: headerClass,
    };

    const header = getComponent(this, 'header');
    const itemCls = {
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-active`]: isActive,
      [`${prefixCls}-item-disabled`]: disabled,
    };
    let icon = <i class="arrow" />;
    if (showArrow && typeof expandIcon === 'function') {
      icon = expandIcon(this.$props);
    }

    const panelContent = (
      <PanelContent
        v-show={isActive}
        prefixCls={prefixCls}
        isActive={isActive}
        destroyInactivePanel={destroyInactivePanel}
        forceRender={forceRender}
        role={accordion ? 'tabpanel' : null}
      >
        {getSlot(this)}
      </PanelContent>
    );
    return (
      <div class={itemCls} role="tablist">
        <div
          class={headerCls}
          onClick={this.handleItemClick}
          onKeypress={this.handleKeyPress}
          role={accordion ? 'tab' : 'button'}
          tabindex={disabled ? -1 : 0}
          aria-expanded={isActive}
        >
          {showArrow && icon}
          {header}
          {extra && <div class={`${prefixCls}-extra`}>{extra}</div>}
        </div>
        <Transition {...transitionProps}>{panelContent}</Transition>
      </div>
    );
  },
});
