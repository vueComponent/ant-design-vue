import React from 'react'
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'
import KeyCode from 'rc-util/lib/KeyCode'
import classNames from 'classnames'
import { noop } from './util'

/* eslint react/no-is-mounted:0 */

const MenuItem = createReactClass({
  displayName: 'MenuItem',

  propTypes: {
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    active: PropTypes.bool,
    children: PropTypes.any,
    selectedKeys: PropTypes.array,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    onItemHover: PropTypes.func,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDeselect: PropTypes.func,
    parentMenu: PropTypes.object,
    onDestroy: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  },

  getDefaultProps () {
    return {
      onSelect: noop,
      onMouseEnter: noop,
      onMouseLeave: noop,
    }
  },

  componentWillUnmount () {
    const props = this.props
    if (props.onDestroy) {
      props.onDestroy(props.eventKey)
    }
  },
  onKeyDown (e) {
    const keyCode = e.keyCode
    if (keyCode === KeyCode.ENTER) {
      this.onClick(e)
      return true
    }
  },

  onMouseLeave (e) {
    const { eventKey, onItemHover, onMouseLeave } = this.props
    onItemHover({
      key: eventKey,
      hover: false,
    })
    onMouseLeave({
      key: eventKey,
      domEvent: e,
    })
  },

  onMouseEnter (e) {
    const { eventKey, parentMenu, onItemHover, onMouseEnter } = this.props
    if (parentMenu.subMenuInstance) {
      parentMenu.subMenuInstance.clearSubMenuTimers()
    }
    onItemHover({
      key: eventKey,
      hover: true,
    })
    onMouseEnter({
      key: eventKey,
      domEvent: e,
    })
  },

  onClick (e) {
    const { eventKey, multiple, onClick, onSelect, onDeselect } = this.props
    const selected = this.isSelected()
    const info = {
      key: eventKey,
      keyPath: [eventKey],
      item: this,
      domEvent: e,
    }
    onClick(info)
    if (multiple) {
      if (selected) {
        onDeselect(info)
      } else {
        onSelect(info)
      }
    } else if (!selected) {
      onSelect(info)
    }
  },

  getPrefixCls () {
    return `${this.props.rootPrefixCls}-item`
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
    return this.props.selectedKeys.indexOf(this.props.eventKey) !== -1
  },

  render () {
    const props = this.props
    const selected = this.isSelected()
    const className = classNames(this.getPrefixCls(), props.className, {
      [this.getActiveClassName()]: !props.disabled && props.active,
      [this.getSelectedClassName()]: selected,
      [this.getDisabledClassName()]: props.disabled,
    })
    const attrs = {
      ...props.attribute,
      title: props.title,
      className,
      role: 'menuitem',
      'aria-selected': selected,
      'aria-disabled': props.disabled,
    }
    let mouseEvent = {}
    if (!props.disabled) {
      mouseEvent = {
        onClick: this.onClick,
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter,
      }
    }
    const style = {
      ...props.style,
    }
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level
    }
    return (
      <li
        {...attrs}
        {...mouseEvent}
        style={style}
      >
        {props.children}
      </li>
    )
  },
})

MenuItem.isMenuItem = 1

export default MenuItem
