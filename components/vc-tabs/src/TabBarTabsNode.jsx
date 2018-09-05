
import warning from 'warning'
import PropTypes from '../../_util/vue-types'
import BaseMixin from '../../_util/BaseMixin'
import { getOptionProps, getComponentFromProp } from '../../_util/props-util'

function noop () {
}
export default {
  name: 'TabBarTabsNode',
  mixins: [BaseMixin],
  props: {
    activeKey: PropTypes.string,
    panels: PropTypes.any.def([]),
    prefixCls: PropTypes.string.def(''),
    tabBarGutter: PropTypes.any.def(null),
    onTabClick: PropTypes.func,
    saveRef: PropTypes.func.def(noop),
    getRef: PropTypes.func.def(noop),
  },
  render () {
    const { panels: children, activeKey, prefixCls, tabBarGutter } = this.$props
    const rst = []

    children.forEach((child, index) => {
      if (!child) {
        return
      }
      const props = getOptionProps(child)
      const key = child.key
      let cls = activeKey === key ? `${prefixCls}-tab-active` : ''
      cls += ` ${prefixCls}-tab`
      const events = { on: {}}
      const disabled = props.disabled || props.disabled === ''
      if (disabled) {
        cls += ` ${prefixCls}-tab-disabled`
      } else {
        events.on.click = () => {
          this.__emit('tabClick', key)
        }
      }
      const directives = []
      if (activeKey === key) {
        directives.push({
          name: 'ref',
          value: this.saveRef('activeTab'),
        })
      }
      const tab = getComponentFromProp(child, 'tab')
      warning(tab !== undefined, 'There must be `tab` property or slot on children of Tabs.')
      rst.push(
        <div
          role='tab'
          aria-disabled={disabled ? 'true' : 'false'}
          aria-selected={activeKey === key ? 'true' : 'false'}
          {...events}
          class={cls}
          key={key}
          style={{ marginRight: tabBarGutter && index === children.length - 1 ? 0 : tabBarGutter }}
          {...{ directives: directives }}
        >
          {tab}
        </div>
      )
    })

    return <div>{rst}</div>
  },
}

