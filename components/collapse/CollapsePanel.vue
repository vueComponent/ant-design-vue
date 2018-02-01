<script>
import PropTypes from '../_util/vue-types'
import { getOptionProps } from '../_util/props-util'
import RcCollapse from './src'
import { panelProps } from './src/commonProps'

export default {
  props: {
    name: PropTypes.string,
    ...panelProps,
  },
  render () {
    const { prefixCls, showArrow = true, $listeners } = this
    const collapsePanelClassName = {
      [`${prefixCls}-no-arrow`]: !showArrow,
    }
    const rcCollapePanelProps = {
      props: {
        ...getOptionProps(this),
      },
      class: collapsePanelClassName,
      on: $listeners,
    }
    return <RcCollapse.Panel {...rcCollapePanelProps} >{this.$slots.default}</RcCollapse.Panel>
  },
}
</script>
