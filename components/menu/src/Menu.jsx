// import React from 'react';
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'
import MenuMixin from './MenuMixin'
import { noop } from './util'

const Menu = createReactClass({
  displayName: 'Menu',

  propTypes: {
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
    getPopupContainer: PropTypes.func,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onDestroy: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    subMenuOpenDelay: PropTypes.number,
    subMenuCloseDelay: PropTypes.number,
    forceSubMenuRender: PropTypes.bool,
    triggerSubMenuAction: PropTypes.string,
    level: PropTypes.number,
    selectable: PropTypes.bool,
    multiple: PropTypes.bool,
    children: PropTypes.any,
  },

  mixins: [MenuMixin],

  isRootMenu: true,

  getDefaultProps () {
    return {
      selectable: true,
      onClick: noop,
      onSelect: noop,
      onOpenChange: noop,
      onDeselect: noop,
      defaultSelectedKeys: [],
      defaultOpenKeys: [],
      subMenuOpenDelay: 0,
      subMenuCloseDelay: 0.1,
      triggerSubMenuAction: 'hover',
    }
  },

  getInitialState () {
    const props = this.props
    let selectedKeys = props.defaultSelectedKeys
    let openKeys = props.defaultOpenKeys
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || []
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || []
    }
    return {
      selectedKeys,
      openKeys,
    }
  },

  componentWillReceiveProps (nextProps) {
    const props = {}
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys || []
    }
    if ('openKeys' in nextProps) {
      props.openKeys = nextProps.openKeys || []
    }
    this.setState(props)
  },

  onDestroy (key) {
    const state = this.state
    const props = this.props
    const selectedKeys = state.selectedKeys
    const openKeys = state.openKeys
    let index = selectedKeys.indexOf(key)
    if (!('selectedKeys' in props) && index !== -1) {
      selectedKeys.splice(index, 1)
    }
    index = openKeys.indexOf(key)
    if (!('openKeys' in props) && index !== -1) {
      openKeys.splice(index, 1)
    }
  },

  onSelect (selectInfo) {
    const props = this.props
    if (props.selectable) {
      // root menu
      let selectedKeys = this.state.selectedKeys
      const selectedKey = selectInfo.key
      if (props.multiple) {
        selectedKeys = selectedKeys.concat([selectedKey])
      } else {
        selectedKeys = [selectedKey]
      }
      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys,
        })
      }
      props.onSelect({
        ...selectInfo,
        selectedKeys,
      })
    }
  },

  onClick (e) {
    this.props.onClick(e)
  },

  onOpenChange (e_) {
    const props = this.props
    const openKeys = this.state.openKeys.concat()
    let changed = false
    const processSingle = (e) => {
      let oneChanged = false
      if (e.open) {
        oneChanged = openKeys.indexOf(e.key) === -1
        if (oneChanged) {
          openKeys.push(e.key)
        }
      } else {
        const index = openKeys.indexOf(e.key)
        oneChanged = index !== -1
        if (oneChanged) {
          openKeys.splice(index, 1)
        }
      }
      changed = changed || oneChanged
    }
    if (Array.isArray(e_)) {
      // batch change call
      e_.forEach(processSingle)
    } else {
      processSingle(e_)
    }
    if (changed) {
      if (!('openKeys' in this.props)) {
        this.setState({ openKeys })
      }
      props.onOpenChange(openKeys)
    }
  },

  onDeselect (selectInfo) {
    const props = this.props
    if (props.selectable) {
      const selectedKeys = this.state.selectedKeys.concat()
      const selectedKey = selectInfo.key
      const index = selectedKeys.indexOf(selectedKey)
      if (index !== -1) {
        selectedKeys.splice(index, 1)
      }
      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys,
        })
      }
      props.onDeselect({
        ...selectInfo,
        selectedKeys,
      })
    }
  },

  getOpenTransitionName () {
    const props = this.props
    let transitionName = props.openTransitionName
    const animationName = props.openAnimation
    if (!transitionName && typeof animationName === 'string') {
      transitionName = `${props.prefixCls}-open-${animationName}`
    }
    return transitionName
  },

  isInlineMode () {
    return this.props.mode === 'inline'
  },

  lastOpenSubMenu () {
    let lastOpen = []
    const { openKeys } = this.state
    if (openKeys.length) {
      lastOpen = this.getFlatInstanceArray().filter((c) => {
        return c && openKeys.indexOf(c.props.eventKey) !== -1
      })
    }
    return lastOpen[0]
  },

  renderMenuItem (c, i, subIndex) {
    if (!c) {
      return null
    }
    const state = this.state
    const extraProps = {
      openKeys: state.openKeys,
      selectedKeys: state.selectedKeys,
      triggerSubMenuAction: this.props.triggerSubMenuAction,
    }
    return this.renderCommonMenuItem(c, i, subIndex, extraProps)
  },

  render () {
    const props = { ...this.props }
    props.className += ` ${props.prefixCls}-root`
    return this.renderRoot(props)
  },
})

export default Menu
