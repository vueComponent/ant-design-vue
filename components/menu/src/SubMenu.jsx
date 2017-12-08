import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'
import Trigger from 'rc-trigger'
import KeyCode from 'rc-util/lib/KeyCode'
import classNames from 'classnames'
import SubPopupMenu from './SubPopupMenu'
import placements from './placements'
import { noop, loopMenuItemRecusively } from './util'

let guid = 0

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
}

const SubMenu = createReactClass({
  displayName: 'SubMenu',

  propTypes: {
    parentMenu: PropTypes.object,
    title: PropTypes.node,
    children: PropTypes.any,
    selectedKeys: PropTypes.array,
    openKeys: PropTypes.array,
    onClick: PropTypes.func,
    onOpenChange: PropTypes.func,
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    multiple: PropTypes.bool,
    active: PropTypes.bool, // TODO: remove
    onItemHover: PropTypes.func,
    onSelect: PropTypes.func,
    triggerSubMenuAction: PropTypes.string,
    onDeselect: PropTypes.func,
    onDestroy: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onTitleMouseEnter: PropTypes.func,
    onTitleMouseLeave: PropTypes.func,
    onTitleClick: PropTypes.func,
  },

  isRootMenu: false,

  getDefaultProps () {
    return {
      onMouseEnter: noop,
      onMouseLeave: noop,
      onTitleMouseEnter: noop,
      onTitleMouseLeave: noop,
      onTitleClick: noop,
      title: '',
    }
  },

  getInitialState () {
    this.isSubMenu = 1
    return {
      defaultActiveFirst: false,
    }
  },

  componentDidMount () {
    this.componentDidUpdate()
  },

  componentDidUpdate () {
    const { mode, parentMenu } = this.props
    if (mode !== 'horizontal' || !parentMenu.isRootMenu || !this.isOpen()) {
      return
    }
    setTimeout(() => {
      if (!this.subMenuTitle || !this.menuInstance) {
        return
      }
      const popupMenu = ReactDOM.findDOMNode(this.menuInstance)
      if (popupMenu.offsetWidth >= this.subMenuTitle.offsetWidth) {
        return
      }
      popupMenu.style.minWidth = `${this.subMenuTitle.offsetWidth}px`
    }, 0)
  },

  componentWillUnmount () {
    const { onDestroy, eventKey, parentMenu } = this.props
    if (onDestroy) {
      onDestroy(eventKey)
    }
    if (parentMenu.subMenuInstance === this) {
      this.clearSubMenuTimers()
    }
  },

  onDestroy (key) {
    this.props.onDestroy(key)
  },

  onKeyDown (e) {
    const keyCode = e.keyCode
    const menu = this.menuInstance
    const isOpen = this.isOpen()

    if (keyCode === KeyCode.ENTER) {
      this.onTitleClick(e)
      this.setState({
        defaultActiveFirst: true,
      })
      return true
    }

    if (keyCode === KeyCode.RIGHT) {
      if (isOpen) {
        menu.onKeyDown(e)
      } else {
        this.triggerOpenChange(true)
        this.setState({
          defaultActiveFirst: true,
        })
      }
      return true
    }
    if (keyCode === KeyCode.LEFT) {
      let handled
      if (isOpen) {
        handled = menu.onKeyDown(e)
      } else {
        return undefined
      }
      if (!handled) {
        this.triggerOpenChange(false)
        handled = true
      }
      return handled
    }

    if (isOpen && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      return menu.onKeyDown(e)
    }
  },

  onOpenChange (e) {
    this.props.onOpenChange(e)
  },

  onPopupVisibleChange (visible) {
    this.triggerOpenChange(visible, visible ? 'mouseenter' : 'mouseleave')
  },

  onMouseEnter (e) {
    const { eventKey: key, onMouseEnter } = this.props
    this.clearSubMenuLeaveTimer()
    this.setState({
      defaultActiveFirst: false,
    })
    onMouseEnter({
      key,
      domEvent: e,
    })
  },

  onMouseLeave (e) {
    const {
      parentMenu,
      eventKey,
      onMouseLeave,
    } = this.props
    parentMenu.subMenuInstance = this
    parentMenu.subMenuLeaveFn = () => {
      // trigger mouseleave
      onMouseLeave({
        key: eventKey,
        domEvent: e,
      })
    }
    // prevent popup menu and submenu gap
    parentMenu.subMenuLeaveTimer = setTimeout(parentMenu.subMenuLeaveFn, 100)
  },

  onTitleMouseEnter (domEvent) {
    const { eventKey: key, onItemHover, onTitleMouseEnter } = this.props
    this.clearSubMenuTitleLeaveTimer()
    onItemHover({
      key,
      hover: true,
    })
    onTitleMouseEnter({
      key,
      domEvent,
    })
  },

  onTitleMouseLeave (e) {
    const { parentMenu, eventKey, onItemHover, onTitleMouseLeave } = this.props
    parentMenu.subMenuInstance = this
    parentMenu.subMenuTitleLeaveFn = () => {
      onItemHover({
        key: eventKey,
        hover: false,
      })
      onTitleMouseLeave({
        key: eventKey,
        domEvent: e,
      })
    }
    parentMenu.subMenuTitleLeaveTimer = setTimeout(parentMenu.subMenuTitleLeaveFn, 100)
  },

  onTitleClick (e) {
    const { props } = this
    props.onTitleClick({
      key: props.eventKey,
      domEvent: e,
    })
    if (props.triggerSubMenuAction === 'hover') {
      return
    }
    this.triggerOpenChange(!this.isOpen(), 'click')
    this.setState({
      defaultActiveFirst: false,
    })
  },

  onSubMenuClick (info) {
    this.props.onClick(this.addKeyPath(info))
  },

  onSelect (info) {
    this.props.onSelect(info)
  },

  onDeselect (info) {
    this.props.onDeselect(info)
  },

  getPrefixCls () {
    return `${this.props.rootPrefixCls}-submenu`
  },

  getActiveClassName () {
    return `${this.getPrefixCls()}-active`
  },

  getDisabledClassName () {
    return `${this.getPrefixCls()}-disabled`
  },

  getSelectedClassName () {
    return `${this.getPrefixCls()}-selected`
  },

  getOpenClassName () {
    return `${this.props.rootPrefixCls}-submenu-open`
  },

  saveMenuInstance (c) {
    this.menuInstance = c
  },

  addKeyPath (info) {
    return {
      ...info,
      keyPath: (info.keyPath || []).concat(this.props.eventKey),
    }
  },

  triggerOpenChange (open, type) {
    const key = this.props.eventKey
    this.onOpenChange({
      key,
      item: this,
      trigger: type,
      open,
    })
  },

  clearSubMenuTimers () {
    this.clearSubMenuLeaveTimer()
    this.clearSubMenuTitleLeaveTimer()
  },

  clearSubMenuTitleLeaveTimer () {
    const parentMenu = this.props.parentMenu
    if (parentMenu.subMenuTitleLeaveTimer) {
      clearTimeout(parentMenu.subMenuTitleLeaveTimer)
      parentMenu.subMenuTitleLeaveTimer = null
      parentMenu.subMenuTitleLeaveFn = null
    }
  },

  clearSubMenuLeaveTimer () {
    const parentMenu = this.props.parentMenu
    if (parentMenu.subMenuLeaveTimer) {
      clearTimeout(parentMenu.subMenuLeaveTimer)
      parentMenu.subMenuLeaveTimer = null
      parentMenu.subMenuLeaveFn = null
    }
  },

  isChildrenSelected () {
    const ret = { find: false }
    loopMenuItemRecusively(this.props.children, this.props.selectedKeys, ret)
    return ret.find
  },
  isOpen () {
    return this.props.openKeys.indexOf(this.props.eventKey) !== -1
  },

  renderChildren (children) {
    const props = this.props
    const baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: this.isOpen(),
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
      eventKey: `${props.eventKey}-menu-`,
      openKeys: props.openKeys,
      openTransitionName: props.openTransitionName,
      openAnimation: props.openAnimation,
      onOpenChange: this.onOpenChange,
      subMenuOpenDelay: props.subMenuOpenDelay,
      subMenuCloseDelay: props.subMenuCloseDelay,
      forceSubMenuRender: props.forceSubMenuRender,
      triggerSubMenuAction: props.triggerSubMenuAction,
      defaultActiveFirst: this.state.defaultActiveFirst,
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance,
    }
    return <SubPopupMenu {...baseProps}>{children}</SubPopupMenu>
  },

  saveSubMenuTitle (subMenuTitle) {
    this.subMenuTitle = subMenuTitle
  },

  render () {
    const props = this.props
    const isOpen = this.isOpen()
    const prefixCls = this.getPrefixCls()
    const isInlineMode = props.mode === 'inline'
    const className = classNames(prefixCls, `${prefixCls}-${props.mode}`, {
      [props.className]: !!props.className,
      [this.getOpenClassName()]: isOpen,
      [this.getActiveClassName()]: props.active || (isOpen && !isInlineMode),
      [this.getDisabledClassName()]: props.disabled,
      [this.getSelectedClassName()]: this.isChildrenSelected(),
    })

    if (!this._menuId) {
      if (props.eventKey) {
        this._menuId = `${props.eventKey}$Menu`
      } else {
        this._menuId = `$__$${++guid}$Menu`
      }
    }

    let mouseEvents = {}
    let titleClickEvents = {}
    let titleMouseEvents = {}
    if (!props.disabled) {
      mouseEvents = {
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter,
      }

      // only works in title, not outer li
      titleClickEvents = {
        onClick: this.onTitleClick,
      }
      titleMouseEvents = {
        onMouseEnter: this.onTitleMouseEnter,
        onMouseLeave: this.onTitleMouseLeave,
      }
    }

    const style = {}
    if (isInlineMode) {
      style.paddingLeft = props.inlineIndent * props.level
    }
    const title = (
      <div
        ref={this.saveSubMenuTitle}
        style={style}
        className={`${prefixCls}-title`}
        {...titleMouseEvents}
        {...titleClickEvents}
        aria-expanded={isOpen}
        aria-owns={this._menuId}
        aria-haspopup='true'
        title={typeof props.title === 'string' ? props.title : undefined}
      >
        {props.title}
        <i className={`${prefixCls}-arrow`} />
      </div>
    )
    const children = this.renderChildren(props.children)

    const getPopupContainer = props.parentMenu.isRootMenu
      ? props.parentMenu.props.getPopupContainer : triggerNode => triggerNode.parentNode
    const popupPlacement = popupPlacementMap[props.mode]
    const popupClassName = props.mode === 'inline' ? '' : props.popupClassName
    return (
      <li {...mouseEvents} className={className} style={props.style}>
        {isInlineMode && title}
        {isInlineMode && children}
        {!isInlineMode && (
          <Trigger
            prefixCls={prefixCls}
            popupClassName={`${prefixCls}-popup ${popupClassName}`}
            getPopupContainer={getPopupContainer}
            builtinPlacements={placements}
            popupPlacement={popupPlacement}
            popupVisible={isOpen}
            popup={children}
            action={props.disabled ? [] : [props.triggerSubMenuAction]}
            mouseEnterDelay={props.subMenuOpenDelay}
            mouseLeaveDelay={props.subMenuCloseDelay}
            onPopupVisibleChange={this.onPopupVisibleChange}
            forceRender={props.forceSubMenuRender}
          >
            {title}
          </Trigger>
        )}
      </li>
    )
  },
})

SubMenu.isSubMenu = 1

export default SubMenu
