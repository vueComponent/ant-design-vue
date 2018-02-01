<script>
import PropTypes from '../_util/vue-types'
import animation from '../_util/openAnimation'
import { getOptionProps } from '../_util/props-util'
import RcCollapse from './src'

export default {
  props: {
    prefixCls: PropTypes.string.def('ant-collapse'),
    bordered: PropTypes.bool.def(true),
    openAnimation: PropTypes.any.def({ ...animation, appear () { } }),
    activeKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    change: PropTypes.func.def(() => {}),
    accordion: PropTypes.bool,
  },
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
    return <RcCollapse {...rcCollapeProps}>{this.$slots.default}</RcCollapse>
  },
}
</script>
