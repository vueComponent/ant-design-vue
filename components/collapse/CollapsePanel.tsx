import type { ExtractPropTypes } from 'vue';
import { defineComponent, inject } from 'vue';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import VcCollapse from '../vc-collapse';
import { defaultConfigProvider } from '../config-provider';
import PropTypes from '../_util/vue-types';

const collapsePanelProps = {
  openAnimation: PropTypes.object,
  prefixCls: PropTypes.string,
  header: PropTypes.VNodeChild,
  headerClass: PropTypes.string,
  showArrow: PropTypes.looseBool,
  isActive: PropTypes.looseBool,
  destroyInactivePanel: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  accordion: PropTypes.looseBool,
  forceRender: PropTypes.looseBool,
  expandIcon: PropTypes.func,
  extra: PropTypes.VNodeChild,
  panelKey: PropTypes.VNodeChild,
};

export type CollapsePanelProps = Partial<ExtractPropTypes<typeof collapsePanelProps>>;
export default defineComponent({
  name: 'ACollapsePanel',
  inheritAttrs: false,
  props: collapsePanelProps,
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, showArrow = true } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('collapse', customizePrefixCls);
    const { class: className, ...restAttrs } = this.$attrs;
    const collapsePanelClassName = {
      [className as string]: className,
      [`${prefixCls}-no-arrow`]: !showArrow,
    };

    const rcCollapePanelProps = {
      ...getOptionProps(this),
      header: getComponent(this, 'header'),
      prefixCls,
      extra: getComponent(this, 'extra'),
      class: collapsePanelClassName,
      ...restAttrs,
    };
    return <VcCollapse.Panel {...rcCollapePanelProps}>{getSlot(this)}</VcCollapse.Panel>;
  },
});
