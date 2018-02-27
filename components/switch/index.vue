<script>
import PropTypes from '../_util/vue-types'
import { getOptionProps, getComponentFromProp } from '../_util/props-util'
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
  methods: {
    focus () {
      this.$refs.refSwitchNode.focus()
    },
    blur () {
      this.$refs.refSwitchNode.blur()
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
    return (
      <VcSwitch
        {...switchProps}
      >
        <template slot='checkedChildren'>{getComponentFromProp(this, 'checkedChildren')}</template>
        <template slot='unCheckedChildren'>{getComponentFromProp(this, 'unCheckedChildren')}</template>
      </VcSwitch>
    )
  },
}
</script>
