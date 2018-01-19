<script>
import PropTypes from '../../_util/vue-types'
import KeyCode from '../../_util/KeyCode'
// import { noop } from './util'
import BaseMixin from '../../_util/BaseMixin'
const props = {
  rootPrefixCls: PropTypes.string,
  eventKey: PropTypes.string,
  active: PropTypes.bool,
  selectedKeys: PropTypes.array,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  index: PropTypes.number,
  inlineIndent: PropTypes.number.def(24),
  level: PropTypes.number.def(1),
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
  parentMenu: PropTypes.object,
  // clearSubMenuTimers: PropTypes.func.def(noop),
}
const MenuItem = {
  name: 'MenuItem',
  props,
  inject: {
    parentMenuContext: { default: undefined },
  },
  mixins: [BaseMixin],
  isMenuItem: true,
  beforeDestroy () {
    const props = this.$props
    this.__emit('destroy', props.eventKey)
  },
  methods: {
    onKeyDown (e) {
      const keyCode = e.keyCode
      if (keyCode === KeyCode.ENTER) {
        this.__emit('click', e)
        return true
      }
    },

    onMouseLeave (e) {
      const { eventKey } = this.$props
      this.__emit('itemHover', {
        key: eventKey,
        hover: false,
      })
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e,
      })
    },

    onMouseEnter (e) {
      const { eventKey } = this
      // if (parentMenuContext && parentMenuContext.subMenuInstance) {
      //   parentMenuContext.subMenuInstance.clearSubMenuTimers()
      // }
      this.__emit('itemHover', {
        key: eventKey,
        hover: true,
      })
      this.__emit('mouseenter', {
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

      this.__emit('click', info)
      if (multiple) {
        if (selected) {
          this.__emit('deselect', info)
        } else {
          this.__emit('select', info)
        }
      } else if (!selected) {
        this.__emit('select', info)
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
      return this.$props.selectedKeys && this.$props.selectedKeys.indexOf(this.$props.eventKey) !== -1
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
export { props as menuItemProps }
</script>
