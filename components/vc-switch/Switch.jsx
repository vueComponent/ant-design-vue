
import { switchPropTypes } from './PropTypes'
import BaseMixin from '../_util/BaseMixin'
import { hasProp, getOptionProps, getComponentFromProp } from '../_util/props-util'

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
  mounted () {
    this.$nextTick(() => {
      const { autoFocus, disabled } = this
      if (autoFocus && !disabled) {
        this.focus()
      }
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
      if (this.$refs.refSwitchNode) {
        this.$refs.refSwitchNode.blur()
      }
      this.$emit('mouseup', e)
    },
    focus () {
      this.$refs.refSwitchNode.focus()
    },
    blur () {
      this.$refs.refSwitchNode.blur()
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
    const spanProps = {
      props: { ...restProps },
      on: {
        ...this.$listeners,
        keydown: this.handleKeyDown,
        click: this.toggle,
        mouseup: this.handleMouseUp,
      },
      attrs: {
        tabIndex: switchTabIndex,
      },
      class: switchClassName,
      ref: 'refSwitchNode',
    }
    return (
      <span {...spanProps}>
        <span class={`${prefixCls}-inner`}>
          {checked ? getComponentFromProp(this, 'checkedChildren') : getComponentFromProp(this, 'unCheckedChildren')}
        </span>
      </span>
    )
  },
}

