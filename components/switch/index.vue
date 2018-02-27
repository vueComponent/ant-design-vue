<script>
import PropTypes from '../_util/vue-types'
import { getOptionProps } from '../_util/props-util'
import VcSwitch from '../vc-switch'

export default {
  name: 'vSwitch',
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    prefixCls: PropTypes.string.def('ant-switch'),
    // size=default and size=large are the same
    size: PropTypes.oneOf(['small', 'default', 'large']),
    disabled: PropTypes.bool,
    checkedChildren: PropTypes.any,
    unCheckedChildren: PropTypes.any,
    tabIndex: PropTypes.number,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    autoFocus: PropTypes.bool,
    loading: PropTypes.bool,
  },
  monted () {
    this.$nextTick(() => {
      this.refSwitchNode = this.$refs.refSwitchNode
    })
  },
  methods: {
    focus () {
      this.refSwitchNode.focus()
    },
    blur () {
      this.refSwitchNode.blur()
    },
    getChildren () {
      return {
        checkedChildren: this.$slots.checkedChildren || null,
        unCheckedChildren: this.$slots.unCheckedChildren || null,
      }
    },
  },

  render () {
    const { prefixCls, size, loading, ...restProps } = getOptionProps(this)
    const classes = {
      [`${prefixCls}-small`]: size === 'small',
      [`${prefixCls}-loading`]: loading,
    }
    const switchProps = {
      props: {
        ...restProps,
        prefixCls,
      },
      on: this.$listeners,
      class: classes,
      ref: 'refSwitchNode',
    }
    const children = this.getChildren()
    return (
      <VcSwitch
        {...switchProps}
      >
        {children.checkedChildren ? (
          <template slot='checkedChildren'>{children.checkedChildren}</template>
        ) : null}
        {children.unCheckedChildren ? (
          <template slot='unCheckedChildren'>{children.unCheckedChildren}</template>
        ) : null}
      </VcSwitch>
    )
  },
}
</script>
