
import InkTabBarMixin from './InkTabBarMixin'
import TabBarMixin from './TabBarMixin'

export default {
  name: 'InkTabBar',
  mixins: [TabBarMixin, InkTabBarMixin],
  render (h) {
    const inkBarNode = this.getInkBarNode()
    const tabs = this.getTabs(h)
    return this.getRootNode([inkBarNode, tabs], h)
  },
}

