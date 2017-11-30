<script>
import InkTabBarMixin from './InkTabBarMixin'
import TabBarMixin from './TabBarMixin'

export default {
  name: 'InkTabBar',
  mixins: [TabBarMixin, InkTabBarMixin],
  render () {
    const inkBarNode = this.getInkBarNode()
    const tabs = this.getTabs()
    return this.getRootNode([inkBarNode, tabs])
  },
}
</script>
