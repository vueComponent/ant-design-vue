
import PropTypes from '../../_util/vue-types'

export default {
  name: 'PanelContent',
  props: {
    prefixCls: PropTypes.string,
    isActive: PropTypes.bool,
    destroyInactivePanel: PropTypes.bool,
  },
  data () {
    return {
      _isActive: undefined,
    }
  },
  render () {
    this._isActive = this._isActive || this.isActive
    if (!this._isActive) {
      return null
    }
    const { prefixCls, isActive, destroyInactivePanel } = this.$props
    const { $slots } = this
    const contentCls = {
      [`${prefixCls}-content`]: true,
      [`${prefixCls}-content-active`]: isActive,
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

