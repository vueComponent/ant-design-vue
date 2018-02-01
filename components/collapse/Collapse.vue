<script>
import PropTypes from '../_util/vue-types'
import animation from '../_util/openAnimation'
import { getOptionProps } from '../_util/props-util'
import RcCollapse from './src'
import { collapseProps } from './src/commonProps'

export default {
  props: {
    ...collapseProps,
    bordered: PropTypes.bool.def(true),
    openAnimation: PropTypes.any.def({ ...animation, appear () { } }),
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
