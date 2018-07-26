
import InkTabBarMixin from './InkTabBarMixin';
import TabBarMixin from './TabBarMixin';

export default {
  name: 'InkTabBar',
  mixins: [TabBarMixin, InkTabBarMixin],
  render: function render(h) {
    var inkBarNode = this.getInkBarNode();
    var tabs = this.getTabs(h);
    return this.getRootNode([inkBarNode, tabs], h);
  }
};