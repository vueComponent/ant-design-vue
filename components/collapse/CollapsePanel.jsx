import { inject } from 'vue';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import VcCollapse, { panelProps } from '../vc-collapse';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ACollapsePanel',
  props: {
    ...panelProps(),
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, showArrow = true } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('collapse', customizePrefixCls);

    const collapsePanelClassName = {
      [`${prefixCls}-no-arrow`]: !showArrow,
    };

    const rcCollapePanelProps = {
      ...getOptionProps(this),
      header: getComponent(this, 'header'),
      prefixCls,
      extra: getComponent(this, 'extra'),
      class: collapsePanelClassName,
    };
    return <VcCollapse.Panel {...rcCollapePanelProps}>{getSlot(this)}</VcCollapse.Panel>;
  },
};
