<script>
import PropTypes from '../../_util/vue-types'

export default {
  name: 'PanelContent',
  props: {
    prefixCls: PropTypes.string,
    isActive: PropTypes.bool,
    destroyInactivePanel: PropTypes.bool,
  },
  render () {
    if (!this.isActive) {
      return null
    }
    const { prefixCls, isActive, destroyInactivePanel } = this.$props
    const { $slots } = this
    const contentCls = {
      [`${prefixCls}-content`]: true,
      [`${prefixCls}-content-active`]: isActive,
      [`${prefixCls}-content-inactive`]: !isActive,
    }
    const child = !isActive && destroyInactivePanel ? null
      : <div class={`${prefixCls}-content-box`}>{$slots.default}</div>
    return (
      <div
        class={contentCls}
        role='tabpanel'
      >{child}</div>
    )
  },
}
</script>
