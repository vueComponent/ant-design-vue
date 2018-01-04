import PropTypes from '../../_util/vue-types'
import hasProp from '../../_util/hasProp'
import KeyCode from '../../_util/KeyCode'
import scrollIntoView from 'dom-scroll-into-view'
import { getKeyFromChildrenIndex, loopMenuItem } from './util'
import { cloneElement, cloneVNode } from '../../_util/vnode'
import DOMWrap from './DOMWrap'

function allDisabled (arr) {
  if (!arr.length) {
    return true
  }

  return arr.every(c => {
    const propsData = c.componentOptions.propsData || {}
    return !!propsData.disabled
  })
}

function getActiveKey (props, originalActiveKey) {
  let activeKey = originalActiveKey
  const { children, eventKey } = props
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
  if (props.defaultActiveFirst) {
    loopMenuItem(children, (c, i) => {
      const propsData = c.componentOptions.propsData || {}
      if (!activeKey && c && !propsData.disabled) {
        activeKey = getKeyFromChildrenIndex(c, eventKey, i)
      }
    })
    return activeKey
  }
  return activeKey
}

export default {
  props: {
    test: PropTypes.any,
    prefixCls: PropTypes.string.def('rc-menu'),
    inlineIndent: PropTypes.number.def(24),
    focusable: PropTypes.bool.def(true),
    multiple: PropTypes.bool,
    defaultActiveFirst: PropTypes.bool,
    visible: PropTypes.bool.def(true),
    activeKey: PropTypes.string,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
  },
  data () {
    const props = this.$props
    return {
      sActiveKey: getActiveKey(props, props.activeKey),
    }
  },
  watch: {
    '$props': {
      handler: function (nextProps) {
        let props
        if (hasProp(this, 'activeKey')) {
          props = {
            sActiveKey: getActiveKey(nextProps, nextProps.activeKey),
          }
        } else {
          const originalActiveKey = this.$data.sActiveKey
          const sActiveKey = getActiveKey(nextProps, originalActiveKey)
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

  created () {
    this.instanceArray = []
  },
  methods: {
    saveRef (index, subIndex, c) {
      if (c) {
        if (subIndex !== undefined) {
          this.instanceArray[index] = this.instanceArray[index] || []
          this.instanceArray[index][subIndex] = c
        } else {
          this.instanceArray[index] = c
        }
      }
    },
    // all keyboard events callbacks run from here at first
    onKeyDown (e, callback) {
      const keyCode = e.keyCode
      let handled
      this.getFlatInstanceArray().forEach((obj) => {
        if (obj && obj.$props.active) {
          handled = this.$emit('keydown', e)
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
          sActiveKey: activeItem.$props.eventKey,
        }, () => {
          scrollIntoView(activeItem.$el, this.$el, {
            onlyScrollIfNeeded: true,
          })
          // https://github.com/react-component/menu/commit/9899a9672f6f028ec3cdf773f1ecea5badd2d33e
          if (typeof callback === 'function') {
            callback(activeItem)
          }
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
      let instanceArray = this.instanceArray
      const hasInnerArray = instanceArray.some((a) => {
        return Array.isArray(a)
      })
      if (hasInnerArray) {
        instanceArray = []
        this.instanceArray.forEach((a) => {
          if (Array.isArray(a)) {
            instanceArray.push.apply(instanceArray, a)
          } else {
            instanceArray.push(a)
          }
        })
        this.instanceArray = instanceArray
      }
      return instanceArray
    },

    renderCommonMenuItem (child, i, subIndex, extraProps) {
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
          // parentMenu: this,
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
          destroy: this.onDestroy,
          select: this.onSelect,
        },
        // ref: childProps.disabled ? undefined : child.ref,
        // ref: childProps.disabled ? undefined
        //  : createChainedFunction(child.ref, saveRef.bind(this, i, subIndex)),
      }
      // !childProps.disabled && this.saveRef(i, subIndex, child.ref)
      if (props.mode === 'inline') {
        newChildProps.props.triggerSubMenuAction = 'click'
      }
      if (!extraProps.isRootMenu) {
        newChildProps.props.clearSubMenuTimers = this.clearSubMenuTimers
      }
      return cloneElement(child, newChildProps)
    },

    renderRoot (props, children = []) {
      this.instanceArray = []
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
          hiddenClassName: `${props.prefixCls}-hidden`,
          visible: props.visible,
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
      const newChildren = children.map(this.renderMenuItem)
      return (
        <ul
          {...domProps}
        >
          {newChildren}
        </ul>
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
        const propsData = c.componentOptions.propsData || {}
        if (c && propsData.eventKey === sActiveKey) {
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
        const propsData = child.componentOptions.propsData || {}
        if (!child || propsData.disabled) {
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
