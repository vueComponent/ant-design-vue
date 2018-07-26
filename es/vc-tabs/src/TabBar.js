
import TabBarMixin from './TabBarMixin';
import BaseMixin from '../../_util/BaseMixin';
export default {
  mixins: [TabBarMixin, BaseMixin],
  name: 'TabBar',
  props: {
    prefixCls: {
      'default': 'ant-tabs',
      type: String
    },
    tabBarPosition: {
      'default': 'top',
      type: String
    },
    disabled: Boolean,
    activeKey: String,
    panels: Array
  },
  render: function render(h) {
    var tabs = this.getTabs(h);
    return this.getRootNode(tabs, h);
  }
};