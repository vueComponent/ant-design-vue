<script>
import PropTypes from '../../_util/vue-types'
import MenuMixin from './MenuMixin'
import StateMixin from '../../_util/StateMixin'
import commonPropsType from './commonPropsType'
import { noop } from './util'
export default {
  name: 'SubPopupMenu',
  props: { ...commonPropsType,
    clearSubMenuTimers: PropTypes.func.def(noop),
  },

  mixins: [MenuMixin, StateMixin],
  methods: {
    onDeselect (selectInfo) {
      this.$emit('deselect', selectInfo)
    },

    onSelect (selectInfo) {
      this.$emit('select', selectInfo)
    },

    onClick (e) {
      this.$emit('click', e)
    },

    onOpenChange (e) {
      this.$emit('openChange', e)
    },

    onDestroy (key) {
      this.$emit('destroy', key)
    },

    getOpenTransitionName () {
      return this.$props.openTransitionName
    },

    renderMenuItem (c, i, subIndex) {
      if (!c) {
        return null
      }
      const props = this.$props
      const extraProps = {
        openKeys: props.openKeys,
        selectedKeys: props.selectedKeys,
        triggerSubMenuAction: props.triggerSubMenuAction,
        isRootMenu: false,
      }
      return this.renderCommonMenuItem(c, i, subIndex, extraProps)
    },
  },
  render () {
    const { prefixCls } = this.$props
    return this.renderRoot({ ...this.$props, class: `${prefixCls}-sub` }, this.$slots.default)
  },
}
</script>
