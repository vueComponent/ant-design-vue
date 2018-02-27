<script>
import { switchPropTypes } from './PropTypes'
import BaseMixin from '../_util/BaseMixin'
import { hasProp, filterEmpty, getOptionProps } from '../_util/props-util'

// function noop () {
// }
export default {
  name: 'vc-switch',
  mixins: [BaseMixin],
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    ...switchPropTypes,
    prefixCls: switchPropTypes.prefixCls.def('rc-switch'),
    checkedChildren: switchPropTypes.checkedChildren.def(null),
    unCheckedChildren: switchPropTypes.unCheckedChildren.def(null),
    defaultChecked: switchPropTypes.defaultChecked.def(''),
    // onChange: switchPropTypes.onChange.def(noop),
    // onClick: switchPropTypes.onClick.def(noop),
  },
  data () {
    let checked = false
    if (hasProp(this, 'checked')) {
      checked = !!this.checked
    } else {
      checked = !!this.defaultChecked
    }
    return {
      stateChecked: checked,
    }
  },
  monted () {
    this.$nextTick(() => {
      const { autoFocus, disabled } = this
      if (autoFocus && !disabled) {
        this.focus()
      }
      this.refSwitchNode = this.$refs.refSwitchNode
    })
  },
  watch: {
    checked (val) {
      this.stateChecked = val
    },
  },
  methods: {
    setChecked (checked) {
      if (this.disabled) {
        return
      }
      if (!hasProp(this, 'checked')) {
        this.stateChecked = checked
      }
      this.$emit('change', checked)
    },
    toggle () {
      const checked = !this.stateChecked
      this.setChecked(checked)
      this.$emit('click', checked)
    },
    handleKeyDown (e) {
      if (e.keyCode === 37) { // Left
        this.setChecked(false)
      } else if (e.keyCode === 39) { // Right
        this.setChecked(true)
      } else if (e.keyCode === 32 || e.keyCode === 13) { // Space, Enter
        this.toggle()
      }
    },
    handleMouseUp (e) {
      if (this.refSwitchNode) {
        this.refSwitchNode.blur()
      }
      this.$emit('mouseUp', e)
    },
    focus () {
      this.refSwitchNode.focus()
    },
    blur () {
      this.refSwitchNode.blur()
    },
    getChildren (slotName) {
      if (hasProp(this, slotName)) {
        return this[slotName]
      }
      if (this.$slots && this.$slots[slotName]) {
        return filterEmpty(this.$slots[slotName])
      }
      return null
    },
  },
  render () {
    const { prefixCls, disabled, tabIndex, ...restProps } = getOptionProps(this)
    const checked = this.stateChecked
    const switchTabIndex = disabled ? -1 : (tabIndex || 0)
    const switchClassName = {
      [prefixCls]: true,
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-disabled`]: disabled,
    }
    const childrenType = checked ? 'checkedChildren' : 'unCheckedChildren'
    return (
      <span
        {...restProps}
        class={switchClassName}
        tabIndex={switchTabIndex}
        ref='refSwitchNode'
        onKeydown={this.handleKeyDown}
        onClick={this.toggle}
        onMouseup={this.handleMouseUp}
      >
        <span class={`${prefixCls}-inner`}>
          {this.getChildren(childrenType)}
        </span>
      </span>
    )
  },
}
</script>
