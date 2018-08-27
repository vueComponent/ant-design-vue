import PropTypes from '../../_util/vue-types'
import { getComponentFromProp } from '../../_util/props-util'
export default {
  name: 'TabPane',
  props: {
    active: PropTypes.bool,
    destroyInactiveTabPane: PropTypes.bool,
    forceRender: PropTypes.bool,
    placeholder: PropTypes.any,
    rootPrefixCls: PropTypes.string,
    tab: PropTypes.any,
    closable: PropTypes.bool,
    disabled: PropTypes.bool,
  },
  render () {
    const {
      destroyInactiveTabPane, active, forceRender,
      rootPrefixCls,
    } = this.$props
    const children = this.$slots.default
    const placeholder = getComponentFromProp(this, 'placeholder')
    this._isActived = this._isActived || active
    const prefixCls = `${rootPrefixCls}-tabpane`
    const cls = {
      [prefixCls]: 1,
      [`${prefixCls}-inactive`]: !active,
      [`${prefixCls}-active`]: active,
    }
    const isRender = destroyInactiveTabPane ? active : this._isActived
    return (
      <div
        class={cls}
        role='tabpanel'
        aria-hidden={active ? 'false' : 'true'}
      >
        {isRender || forceRender ? children : placeholder}
      </div>
    )
  },
}

