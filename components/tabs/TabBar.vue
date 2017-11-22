<script>
import TabBarMixin from './TabBarMixin'
function noop () {
}
export default {
  mixins: [TabBarMixin],
  name: 'TabBar',
  props: {
    prefixCls: {
      default: 'ant-tabs',
      type: String,
    },
    tabBarPosition: {
      default: 'top',
      type: String,
    },
    disabled: Boolean,
    onKeyDown: {
      default: noop,
      type: Function,
    },
    onTabClick: {
      default: noop,
      type: Function,
    },
    activeKey: String,
    panels: Array,
  },
  render (createElement) {
    const tabs = this.getTabs()
    return this.getRootNode(tabs, createElement)
  },
}
</script>
