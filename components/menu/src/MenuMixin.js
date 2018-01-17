import hasProp from '../../_util/props-util'
import KeyCode from '../../_util/KeyCode'
import scrollIntoView from 'dom-scroll-into-view'
import { getKeyFromChildrenIndex, loopMenuItem } from './util'
import { cloneElement, getComponentName } from '../../_util/vnode'
import DOMWrap from './DOMWrap'
import warning from '../../_util/warning'

function allDisabled (arr) {
  if (!arr.length) {
    return true
  }
  return arr.every(c => {
    return !!c.disabled
  })
}

export default {
  data () {
    const props = this.$props
    return {
      sActiveKey: this.getActiveKey(props.activeKey),
    }
  },
  provide () {
    return {
      parentMenuContext: this,
    }
  },
  watch: {
    '$props': {
      handler: function (nextProps) {
        let props
        if (hasProp(this, 'activeKey')) {
          props = {
            sActiveKey: this.getActiveKey(nextProps.activeKey),
          }
        } else {
          const originalActiveKey = this.$data.sActiveKey
          const sActiveKey = this.getActiveKey(originalActiveKey)
          // fix: this.setState(), parent.render(),
          if (sActiveKey !== originalActiveKey) {
            props = {
              sActiveKey,
            }
          }
        }
        if (props) {
          this.setState(props)
        }
      },
      deep: true,
    },
  },
  methods: {
    getActiveKey (originalActiveKey) {
      let activeKey = originalActiveKey
      const { eventKey, defaultActiveFirst } = this.$props
      const children = this.$slots.default
      if (activeKey) {
        let found
        loopMenuItem(children, (c, i) => {
          const propsData = c.componentOptions.propsData || {}
          if (c && !propsData.disabled && activeKey === getKeyFromChildrenIndex(c, eventKey, i)) {
            found = true
          }
        })
        if (found) {
          return activeKey
        }
      }
      activeKey = null
      if (defaultActiveFirst) {
        loopMenuItem(children, (c, i) => {
          const propsData = c.componentOptions.propsData || {}
          if (!activeKey && c && !propsData.disabled) {
            activeKey = getKeyFromChildrenIndex(c, eventKey, i)
          }
        })
        return activeKey
      }
      return activeKey
    },
    // all keyboard events callbacks run from here at first
    onKeyDown (e) {
      const keyCode = e.keyCode
      let handled
      this.getFlatInstanceArray().forEach((obj) => {
        if (obj && obj.active) {
          handled = obj.onKeyDown(e)
        }
      })
      if (handled) {
        return 1
      }
      let activeItem = null
      if (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN) {
        activeItem = this.step(keyCode === KeyCode.UP ? -1 : 1)
      }
      if (activeItem) {
        e.preventDefault()
        this.setState({
          sActiveKey: activeItem.eventKey,
        }, () => {
          scrollIntoView(activeItem.$el, this.$el, {
            onlyScrollIfNeeded: true,
          })
        })
        return 1
      } else if (activeItem === undefined) {
        e.preventDefault()
        this.setState({
          sActiveKey: null,
        })
        return 1
      }
    },

    onItemHover (e) {
      const { key, hover } = e
      this.setState({
        sActiveKey: hover ? key : null,
      })
    },

    getFlatInstanceArray () {
      let instance = []
      try {
        instance = this.$children[0].$children || []
      } catch (error) {

      }
      return instance
    },

    renderCommonMenuItem (child, i, subIndex, extraProps) {
      if (child.tag === undefined) { return child }
      warning((getComponentName(child.componentOptions) || '').indexOf(['MenuItem', 'MenuItemGroup']) === -1,
        '`Menu child just support MenuItem and MenuItemGroup',
      )
      const state = this.$data
      const props = this.$props
      const key = getKeyFromChildrenIndex(child, props.eventKey, i)
      const childProps = child.componentOptions.propsData || {}
      const isActive = key === state.sActiveKey
      const newChildProps = {
        props: {
          mode: props.mode,
          level: props.level,
          inlineIndent: props.inlineIndent,
          renderMenuItem: this.renderMenuItem,
          rootPrefixCls: props.prefixCls,
          index: i,
          eventKey: key,
          active: !childProps.disabled && isActive,
          multiple: props.multiple,
          openTransitionName: this.getOpenTransitionName(),
          openAnimation: props.openAnimation,
          subMenuOpenDelay: props.subMenuOpenDelay,
          subMenuCloseDelay: props.subMenuCloseDelay,
          forceSubMenuRender: props.forceSubMenuRender,
          ...extraProps,
          openChange: this.onOpenChange,
        },
        on: {
          click: this.onClick,
          itemHover: this.onItemHover,
          openChange: this.onOpenChange,
          deselect: this.onDeselect,
          // destroy: this.onDestroy,
          select: this.onSelect,
        },
      }
      if (props.mode === 'inline') {
        newChildProps.props.triggerSubMenuAction = 'click'
      }
      // if (!extraProps.isRootMenu) {
      //   newChildProps.props.clearSubMenuTimers = this.clearSubMenuTimers
      // }
      return cloneElement(child, newChildProps)
    },

    renderRoot (props, children = []) {
      const className = {
        [props.prefixCls]: true,
        [props.class]: true,
        [`${props.prefixCls}-${props.mode}`]: true,
      }
      const domProps = {
        attrs: {
          role: 'menu',
          'aria-activedescendant': '',
        },
        props: {
          tag: 'ul',
          // hiddenClassName: `${props.prefixCls}-hidden`,
          // visible: props.visible,
        },
        class: className,
        on: {},
      }
      if (props.id) {
        domProps.id = props.id
      }
      if (props.focusable) {
        domProps.attrs.tabIndex = '0'
        domProps.on.keydown = this.onKeyDown
      }
      const newChildren = children.map((c, i) => this.renderMenuItem(c, i))
      return (
        <DOMWrap
          {...domProps}
        >
          {newChildren}
        </DOMWrap>
      )
    },

    step (direction) {
      let children = this.getFlatInstanceArray()
      const sActiveKey = this.$data.sActiveKey
      const len = children.length
      if (!len) {
        return null
      }
      if (direction < 0) {
        children = children.concat().reverse()
      }
      // find current activeIndex
      let activeIndex = -1
      children.every((c, ci) => {
        if (c && c.eventKey === sActiveKey) {
          activeIndex = ci
          return false
        }
        return true
      })
      if (!this.$props.defaultActiveFirst && activeIndex !== -1) {
        if (allDisabled(children.slice(activeIndex, len - 1))) {
          return undefined
        }
      }
      const start = (activeIndex + 1) % len
      let i = start
      for (; ;) {
        const child = children[i]
        if (!child || child.disabled) {
          i = (i + 1 + len) % len
          // complete a loop
          if (i === start) {
            return null
          }
        } else {
          return child
        }
      }
    },
  },
}
