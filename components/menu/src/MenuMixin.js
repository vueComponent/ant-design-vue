import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import KeyCode from 'rc-util/lib/KeyCode'
import createChainedFunction from 'rc-util/lib/createChainedFunction'
import classNames from 'classnames'
import scrollIntoView from 'dom-scroll-into-view'
import { getKeyFromChildrenIndex, loopMenuItem } from './util'
import DOMWrap from './DOMWrap'

function allDisabled (arr) {
  if (!arr.length) {
    return true
  }
  return arr.every(c => !!c.props.disabled)
}

function getActiveKey (props, originalActiveKey) {
  let activeKey = originalActiveKey
  const { children, eventKey } = props
  if (activeKey) {
    let found
    loopMenuItem(children, (c, i) => {
      if (c && !c.props.disabled && activeKey === getKeyFromChildrenIndex(c, eventKey, i)) {
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
      if (!activeKey && c && !c.props.disabled) {
        activeKey = getKeyFromChildrenIndex(c, eventKey, i)
      }
    })
    return activeKey
  }
  return activeKey
}

function saveRef (index, subIndex, c) {
  if (c) {
    if (subIndex !== undefined) {
      this.instanceArray[index] = this.instanceArray[index] || []
      this.instanceArray[index][subIndex] = c
    } else {
      this.instanceArray[index] = c
    }
  }
}

const MenuMixin = {
  propTypes: {
    focusable: PropTypes.bool,
    multiple: PropTypes.bool,
    style: PropTypes.object,
    defaultActiveFirst: PropTypes.bool,
    visible: PropTypes.bool,
    activeKey: PropTypes.string,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.any,
  },

  getDefaultProps () {
    return {
      prefixCls: 'rc-menu',
      className: '',
      mode: 'vertical',
      level: 1,
      inlineIndent: 24,
      visible: true,
      focusable: true,
      style: {},
    }
  },

  getInitialState () {
    const props = this.props
    return {
      activeKey: getActiveKey(props, props.activeKey),
    }
  },

  componentWillReceiveProps (nextProps) {
    let props
    if ('activeKey' in nextProps) {
      props = {
        activeKey: getActiveKey(nextProps, nextProps.activeKey),
      }
    } else {
      const originalActiveKey = this.state.activeKey
      const activeKey = getActiveKey(nextProps, originalActiveKey)
      // fix: this.setState(), parent.render(),
      if (activeKey !== originalActiveKey) {
        props = {
          activeKey,
        }
      }
    }
    if (props) {
      this.setState(props)
    }
  },

  shouldComponentUpdate (nextProps) {
    return this.props.visible || nextProps.visible
  },

  componentWillMount () {
    this.instanceArray = []
  },

  // all keyboard events callbacks run from here at first
  onKeyDown (e, callback) {
    const keyCode = e.keyCode
    let handled
    this.getFlatInstanceArray().forEach((obj) => {
      if (obj && obj.props.active && obj.onKeyDown) {
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
        activeKey: activeItem.props.eventKey,
      }, () => {
        scrollIntoView(ReactDOM.findDOMNode(activeItem), ReactDOM.findDOMNode(this), {
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
        activeKey: null,
      })
      return 1
    }
  },

  onItemHover (e) {
    const { key, hover } = e
    this.setState({
      activeKey: hover ? key : null,
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
    const state = this.state
    const props = this.props
    const key = getKeyFromChildrenIndex(child, props.eventKey, i)
    const childProps = child.props
    const isActive = key === state.activeKey
    const newChildProps = {
      mode: props.mode,
      level: props.level,
      inlineIndent: props.inlineIndent,
      renderMenuItem: this.renderMenuItem,
      rootPrefixCls: props.prefixCls,
      index: i,
      parentMenu: this,
      ref: childProps.disabled ? undefined
        : createChainedFunction(child.ref, saveRef.bind(this, i, subIndex)),
      eventKey: key,
      active: !childProps.disabled && isActive,
      multiple: props.multiple,
      onClick: this.onClick,
      onItemHover: this.onItemHover,
      openTransitionName: this.getOpenTransitionName(),
      openAnimation: props.openAnimation,
      subMenuOpenDelay: props.subMenuOpenDelay,
      subMenuCloseDelay: props.subMenuCloseDelay,
      forceSubMenuRender: props.forceSubMenuRender,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      onSelect: this.onSelect,
      ...extraProps,
    }
    if (props.mode === 'inline') {
      newChildProps.triggerSubMenuAction = 'click'
    }
    return React.cloneElement(child, newChildProps)
  },

  renderRoot (props) {
    this.instanceArray = []
    const className = classNames(
      props.prefixCls,
      props.className,
      `${props.prefixCls}-${props.mode}`,
    )
    const domProps = {
      className,
      role: 'menu',
      'aria-activedescendant': '',
    }
    if (props.id) {
      domProps.id = props.id
    }
    if (props.focusable) {
      domProps.tabIndex = '0'
      domProps.onKeyDown = this.onKeyDown
    }
    return (
      // ESLint is not smart enough to know that the type of `children` was checked.
      /* eslint-disable */
      <DOMWrap
        style={props.style}
        tag="ul"
        hiddenClassName={`${props.prefixCls}-hidden`}
        visible={props.visible}
        {...domProps}
      >
        {React.Children.map(props.children, this.renderMenuItem)}
      </DOMWrap>
      /*eslint -enable */
    )
  },

  step (direction) {
    let children = this.getFlatInstanceArray()
    const activeKey = this.state.activeKey
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
      if (c && c.props.eventKey === activeKey) {
        activeIndex = ci
        return false
      }
      return true
    })
    if (!this.props.defaultActiveFirst && activeIndex !== -1) {
      if (allDisabled(children.slice(activeIndex, len - 1))) {
        return undefined
      }
    }
    const start = (activeIndex + 1) % len
    let i = start
    for (; ;) {
      const child = children[i]
      if (!child || child.props.disabled) {
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
}

export default MenuMixin
