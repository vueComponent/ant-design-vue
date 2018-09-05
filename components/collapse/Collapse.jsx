
import PropTypes from '../_util/vue-types'
import animation from '../_util/openAnimation'
import { getOptionProps, initDefaultProps } from '../_util/props-util'
import VcCollapse, { collapseProps } from '../vc-collapse'

export default {
  name: 'ACollapse',
  model: {
    prop: 'activeKey',
    event: 'change',
  },
  props: initDefaultProps(collapseProps, {
    prefixCls: 'ant-collapse',
    bordered: true,
    openAnimation: animation,
  }),
  render () {
    const { prefixCls, bordered, $listeners } = this
    const collapseClassName = {
      [`${prefixCls}-borderless`]: !bordered,
    }
    const rcCollapeProps = {
      props: {
        ...getOptionProps(this),
      },
      class: collapseClassName,
      on: $listeners,
    }
    return <VcCollapse {...rcCollapeProps}>{this.$slots.default}</VcCollapse>
  },
}

