<script>
import ScrollableTabBarMixin from './ScrollableTabBarMixin'
import TabBarMixin from './TabBarMixin'

export default {
  name: 'ScrollableTabBar',
  mixins: [TabBarMixin, ScrollableTabBarMixin],
  render () {
    const inkBarNode = this.getInkBarNode()
    const tabs = this.getTabs()
    const scrollbarNode = this.getScrollBarNode([inkBarNode, tabs])
    return this.getRootNode(scrollbarNode)
  },
}
</script>

