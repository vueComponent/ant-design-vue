<script>
import PropTypes from '../../_util/vue-types'
import KeyCode from '../../_util/KeyCode'
import { noop } from './util'

const MenuItem = {
  name: 'MenuItem',

  props: {
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    active: PropTypes.bool,
    selectedKeys: PropTypes.array,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    inlineIndent: PropTypes.number.def(24),
    level: PropTypes.number.def(1),
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
    // onItemHover: PropTypes.func,
    // onSelect: PropTypes.func,
    // onClick: PropTypes.func,
    // onDeselect: PropTypes.func,
    parentMenu: PropTypes.object,
    // onDestroy: PropTypes.func,
    // onMouseEnter: PropTypes.func,
    // onMouseLeave: PropTypes.func,
    clearSubMenuTimers: PropTypes.func.def(noop),
  },

  beforeDestroy () {
    const props = this.$props
    this.$emit('destroy', props.eventKey)
  },
  data () {
    return {
      isMenuItem: 1,
    }
  },
  methods: {
    onKeyDown (e) {
      const keyCode = e.keyCode
      if (keyCode === KeyCode.ENTER) {
        this.$emit('click', e)
        return true
      }
    },

    onMouseLeave (e) {
      const { eventKey } = this.$props
      this.$emit('itemHover', {
        key: eventKey,
        hover: false,
      })
      this.$emit('mouseLeave', {
        key: eventKey,
        domEvent: e,
      })
    },

    onMouseEnter (e) {
      const { eventKey } = this.$props
      this.clearSubMenuTimers()
      this.$emit('itemHover', {
        key: eventKey,
        hover: true,
      })
      this.$emit('mouseEnter', {
        key: eventKey,
        domEvent: e,
      })
    },

    onClick (e) {
      const { eventKey, multiple } = this.$props
      const selected = this.isSelected()
      const info = {
        key: eventKey,
        keyPath: [eventKey],
        item: this,
        domEvent: e,
      }
      this.$emit('click', info)
      if (multiple) {
        if (selected) {
          this.$emit('deselect', info)
        } else {
          this.$emit('select', info)
        }
      } else if (!selected) {
        this.$emit('select', info)
      }
    },

    getPrefixCls () {
      return `${this.$props.rootPrefixCls}-item`
    },

    getActiveClassName () {
      return `${this.getPrefixCls()}-active`
    },

    getSelectedClassName () {
      return `${this.getPrefixCls()}-selected`
    },

    getDisabledClassName () {
      return `${this.getPrefixCls()}-disabled`
    },

    isSelected () {
      return this.$props.selectedKeys.indexOf(this.$props.eventKey) !== -1
    },
  },

  render () {
    const props = this.$props
    const selected = this.isSelected()
    const className = {
      [this.getPrefixCls()]: true,
      [this.getActiveClassName()]: !props.disabled && props.active,
      [this.getSelectedClassName()]: selected,
      [this.getDisabledClassName()]: props.disabled,
    }
    const attrs = {
      ...props.attribute,
      title: props.title,
      role: 'menuitem',
      'aria-selected': selected,
      'aria-disabled': props.disabled,
    }
    let mouseEvent = {}
    if (!props.disabled) {
      mouseEvent = {
        click: this.onClick,
        mouseleave: this.onMouseLeave,
        mouseenter: this.onMouseEnter,
      }
    }
    const style = {}
    if (props.mode === 'inline') {
      style.paddingLeft = `${props.inlineIndent * props.level}px`
    }
    const liProps = {
      attrs,
      on: {
        ...mouseEvent,
      },
    }
    return (
      <li
        {...liProps}
        style={style}
        class={className}
      >
        {this.$slots.default}
      </li>
    )
  },
}

export default MenuItem
</script>
