
import InkTabBarMixin from './InkTabBarMixin';
import ScrollableTabBarMixin from './ScrollableTabBarMixin';
import TabBarMixin from './TabBarMixin';
import BaseMixin from '../../_util/BaseMixin';

export default {
  name: 'ScrollableInkTabBar',
  mixins: [TabBarMixin, InkTabBarMixin, ScrollableTabBarMixin, BaseMixin],
  render: function render(h) {
    var inkBarNode = this.getInkBarNode();
    var tabs = this.getTabs(h);
    var scrollbarNode = this.getScrollBarNode([inkBarNode, tabs]);
    return this.getRootNode(scrollbarNode, h);
  }
};