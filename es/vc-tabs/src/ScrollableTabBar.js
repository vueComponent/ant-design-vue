
import ScrollableTabBarMixin from './ScrollableTabBarMixin';
import TabBarMixin from './TabBarMixin';
import BaseMixin from '../../_util/BaseMixin';

export default {
  name: 'ScrollableTabBar',
  mixins: [TabBarMixin, ScrollableTabBarMixin, BaseMixin],
  render: function render(h) {
    var inkBarNode = this.getInkBarNode();
    var tabs = this.getTabs(h);
    var scrollbarNode = this.getScrollBarNode([inkBarNode, tabs]);
    return this.getRootNode(scrollbarNode, h);
  }
};