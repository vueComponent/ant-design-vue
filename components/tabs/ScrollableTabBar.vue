<script>
import ScrollableTabBarMixin from './ScrollableTabBarMixin'
import TabBarMixin from './TabBarMixin'

export default {
  name: 'ScrollableTabBar',
  mixins: [TabBarMixin, ScrollableTabBarMixin],
  render (h) {
    const inkBarNode = this.getInkBarNode()
    const tabs = this.getTabs(h)
    const scrollbarNode = this.getScrollBarNode([inkBarNode, tabs])
    return this.getRootNode(scrollbarNode)
  },
}
</script>

