<script>
import PropTypes from '../_util/vue-types'
import Trigger from '../trigger'
import KeyCode from '../_util/KeyCode'
import SubPopupMenu from './SubPopupMenu'
import placements from './placements'
import { loopMenuItemRecusively, noop } from './util'
import BaseMixin from '../_util/BaseMixin'
import { getComponentFromProp } from '../_util/props-util'

let guid = 0

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
}

export default {
  name: 'SubMenu',
  props: {
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
    title: PropTypes.any,
    selectedKeys: PropTypes.array.def([]),
    openKeys: PropTypes.array.def([]),
    openChange: PropTypes.func.def(noop),
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.string,
    multiple: PropTypes.bool,
    active: PropTypes.bool, // TODO: remove
    isRootMenu: PropTypes.bool,
    index: PropTypes.number,
    triggerSubMenuAction: PropTypes.string,
    popupClassName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    test: PropTypes.any,
    forceSubMenuRender: PropTypes.bool,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    subMenuOpenDelay: PropTypes.number.def(0.1),
    subMenuCloseDelay: PropTypes.number.def(0.1),
    level: PropTypes.number.def(1),
    inlineIndent: PropTypes.number.def(24),
    openTransitionName: PropTypes.string,
  },
  inject: {
    parentMenuContext: { default: undefined },
  },
  mixins: [BaseMixin],
  isSubMenu: true,
  data () {
    return {
      defaultActiveFirst: false,
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handleUpdated()
    })
  },

  updated () {
    this.$nextTick(() => {
      this.handleUpdated()
    })
  },

  beforeDestroy () {
    const { eventKey } = this
    this.__emit('destroy', eventKey)
    // if (parentMenuContext.subMenuInstance === this) {
    //   this.clearSubMenuTimers()
    // }
    if (this.minWidthTimeout) {
      clearTimeout(this.minWidthTimeout)
    }
    if (this.mouseenterTimeout) {
      clearTimeout(this.mouseenterTimeout)
    }
  },
  methods: {
    handleUpdated () {
      const { mode, isRootMenu } = this.$props
      if (mode !== 'horizontal' || !isRootMenu || !this.isOpen()) {
        return
      }
      const self = this
      this.minWidthTimeout = setTimeout(() => {
        if (!self.$refs.subMenuTitle || !self.$refs.menuInstance) {
          return
        }
        const popupMenu = self.$refs.menuInstance.$el
        if (popupMenu.offsetWidth >= self.$refs.subMenuTitle.offsetWidth) {
          return
        }
        popupMenu.style.minWidth = `${self.$refs.subMenuTitle.offsetWidth}px`
      }, 0)
    },

    onKeyDown (e) {
      const keyCode = e.keyCode
      const menu = this.$refs.menuInstance
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

    onPopupVisibleChange (visible) {
      this.triggerOpenChange(visible, visible ? 'mouseenter' : 'mouseleave')
    },

    onMouseEnter (e) {
      const { eventKey: key } = this.$props
      // this.clearSubMenuLeaveTimer()
      this.setState({
        defaultActiveFirst: false,
      })
      this.__emit('mouseenter', {
        key,
        domEvent: e,
      })
    },

    onMouseLeave (e) {
      const {
        eventKey,
        parentMenuContext,
      } = this
      parentMenuContext.subMenuInstance = this
      // parentMenuContext.subMenuLeaveFn = () => {
      // // trigger mouseleave
      //   this.__emit('mouseleave', {
      //     key: eventKey,
      //     domEvent: e,
      //   })
      // }
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e,
      })
      // prevent popup menu and submenu gap
      // parentMenuContext.subMenuLeaveTimer = setTimeout(parentMenuContext.subMenuLeaveFn, 100)
    },

    onTitleMouseEnter (domEvent) {
      const { eventKey: key } = this.$props
      // this.clearSubMenuTitleLeaveTimer()
      this.__emit('itemHover', {
        key,
        hover: true,
      })
      this.__emit('titleMouseenter', {
        key,
        domEvent,
      })
    },

    onTitleMouseLeave (e) {
      const { eventKey, parentMenuContext } = this
      parentMenuContext.subMenuInstance = this
      this.__emit('itemHover', {
        key: eventKey,
        hover: false,
      })
      this.__emit('titleMouseleave', {
        key: eventKey,
        domEvent: e,
      })
      // parentMenuContext.subMenuTitleLeaveFn = () => {
      //   this.__emit('itemHover', {
      //     key: eventKey,
      //     hover: false,
      //   })
      //   this.__emit('titleMouseleave', {
      //     key: eventKey,
      //     domEvent: e,
      //   })
      // }
      // parentMenuContext.subMenuTitleLeaveTimer = setTimeout(parentMenuContext.subMenuTitleLeaveFn, 100)
    },

    onTitleClick (e) {
      const { triggerSubMenuAction, eventKey } = this.$props
      this.$emit('titleClick', {
        key: eventKey,
        domEvent: e,
      })
      if (triggerSubMenuAction === 'hover') {
        return
      }
      this.triggerOpenChange(!this.isOpen(), 'click')
      this.setState({
        defaultActiveFirst: false,
      })
    },

    onSubMenuClick (info) {
      this.__emit('click', this.addKeyPath(info))
    },

    getPrefixCls () {
      return `${this.$props.rootPrefixCls}-submenu`
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
      return `${this.$props.rootPrefixCls}-submenu-open`
    },

    addKeyPath (info) {
      return {
        ...info,
        keyPath: (info.keyPath || []).concat(this.$props.eventKey),
      }
    },

    // triggerOpenChange (open, type) {
    //   const key = this.$props.eventKey
    //   this.__emit('openChange', {
    //     key,
    //     item: this,
    //     trigger: type,
    //     open,
    //   })
    // },
    triggerOpenChange (open, type) {
      const key = this.$props.eventKey
      const openChange = () => {
        this.__emit('openChange', {
          key,
          item: this,
          trigger: type,
          open,
        })
      }
      if (type === 'mouseenter') {
      // make sure mouseenter happen after other menu item's mouseleave
        this.mouseenterTimeout = setTimeout(() => {
          openChange()
        }, 0)
      } else {
        openChange()
      }
    },

    // clearSubMenuTimers () {
    //   this.clearSubMenuLeaveTimer()
    //   this.clearSubMenuTitleLeaveTimer()
    // },

    // clearSubMenuTitleLeaveTimer () {
    //   const parentMenuContext = this.parentMenuContext
    //   if (parentMenuContext.subMenuTitleLeaveTimer) {
    //     clearTimeout(parentMenuContext.subMenuTitleLeaveTimer)
    //     parentMenuContext.subMenuTitleLeaveTimer = null
    //     parentMenuContext.subMenuTitleLeaveFn = null
    //   }
    // },

    // clearSubMenuLeaveTimer () {
    //   const parentMenuContext = this.parentMenuContext
    //   if (parentMenuContext.subMenuLeaveTimer) {
    //     clearTimeout(parentMenuContext.subMenuLeaveTimer)
    //     parentMenuContext.subMenuLeaveTimer = null
    //     parentMenuContext.subMenuLeaveFn = null
    //   }
    // },

    isChildrenSelected () {
      const ret = { find: false }
      loopMenuItemRecusively(this.$slots.default, this.$props.selectedKeys, ret)
      return ret.find
    },
    isOpen () {
      return this.$props.openKeys.indexOf(this.$props.eventKey) !== -1
    },

    renderChildren (children, vShow) {
      const props = this.$props
      const isOpen = this.isOpen()
      const { select, deselect, openChange } = this.$listeners
      const subPopupMenuProps = {
        props: {
          mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
          visible: isOpen,
          level: props.level + 1,
          inlineIndent: props.inlineIndent,
          focusable: false,
          selectedKeys: props.selectedKeys,
          eventKey: `${props.eventKey}-menu-`,
          openKeys: props.openKeys,
          openTransitionName: props.openTransitionName,
          openAnimation: props.openAnimation,
          subMenuOpenDelay: props.subMenuOpenDelay,
          subMenuCloseDelay: props.subMenuCloseDelay,
          forceSubMenuRender: props.forceSubMenuRender,
          triggerSubMenuAction: props.triggerSubMenuAction,
          defaultActiveFirst: this.$data.defaultActiveFirst,
          multiple: props.multiple,
          prefixCls: props.rootPrefixCls,
          // clearSubMenuTimers: this.clearSubMenuTimers,
        },
        on: {
          click: this.onSubMenuClick,
          select, deselect, openChange,
        },
        id: this._menuId,
        ref: 'menuInstance',
      }
      return vShow
        ? <SubPopupMenu v-show={isOpen} {...subPopupMenuProps}>{children}</SubPopupMenu>
        : <SubPopupMenu {...subPopupMenuProps}>{children}</SubPopupMenu>
    },
  },

  render (h) {
    const props = this.$props
    const { rootPrefixCls, parentMenuContext } = this
    const isOpen = this.isOpen()
    const prefixCls = this.getPrefixCls()
    const isInlineMode = props.mode === 'inline'
    const className = {
      [prefixCls]: true,
      [`${prefixCls}-${props.mode}`]: true,
      [this.getOpenClassName()]: isOpen,
      [this.getActiveClassName()]: props.active || (isOpen && !isInlineMode),
      [this.getDisabledClassName()]: props.disabled,
      [this.getSelectedClassName()]: this.isChildrenSelected(),
    }

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
        mouseleave: this.onMouseLeave,
        mouseenter: this.onMouseEnter,
      }

      // only works in title, not outer li
      titleClickEvents = {
        click: this.onTitleClick,
      }
      titleMouseEvents = {
        mouseenter: this.onTitleMouseEnter,
        mouseleave: this.onTitleMouseLeave,
      }
    }

    const style = {}
    if (isInlineMode) {
      style.paddingLeft = `${props.inlineIndent * props.level}px`
    }
    const titleProps = {
      attrs: {
        'aria-expanded': isOpen,
        'aria-owns': this._menuId,
        'aria-haspopup': 'true',
        title: typeof props.title === 'string' ? props.title : undefined,
      },
      on: {
        ...titleMouseEvents,
        ...titleClickEvents,
      },
      style,
      class: `${prefixCls}-title`,
      ref: 'subMenuTitle',
    }
    const title = (
      <div
        {...titleProps}
      >
        {getComponentFromProp(this, 'title')}
        <i class={`${prefixCls}-arrow`} />
      </div>
    )
    // const children = this.renderChildren(this.$slots.default)

    const getPopupContainer = this.isRootMenu
      ? this.getPopupContainer : triggerNode => triggerNode.parentNode
    const popupPlacement = popupPlacementMap[props.mode]
    const popupClassName = props.mode === 'inline' ? '' : props.popupClassName
    const liProps = {
      on: { ...mouseEvents },
      class: className,
    }

    const { forceSubMenuRender, mode, openTransitionName, openAnimation } = this.$props
    const haveRendered = this.haveRendered
    this.haveRendered = true

    this.haveOpened = this.haveOpened || isOpen || forceSubMenuRender

    const transitionAppear = !(!haveRendered && isOpen && mode === 'inline')

    let animProps = { appear: true }
    if (openTransitionName) {
      animProps.name = openTransitionName
    } else if (typeof openAnimation === 'object') {
      animProps = { ...animProps, ...openAnimation.props || {}}
      if (!transitionAppear) {
        animProps.appear = false
      }
    } else if (typeof openAnimation === 'string') {
      animProps.name = openAnimation
    }
    const transitionProps = {
      props: animProps,
    }
    if (typeof openAnimation === 'object' && openAnimation.on) {
      transitionProps.on = { ...openAnimation.on }
    }
    const children = this.renderChildren(this.$slots.default, isInlineMode)
    return (
      <li {...liProps}>
        {isInlineMode && title}
        {isInlineMode && (
          <transition {...transitionProps}>
            {children}
          </transition>
        )}
        {!isInlineMode && (
          <Trigger
            prefixCls={prefixCls}
            popupClassName={`${prefixCls}-popup ${rootPrefixCls}-${parentMenuContext.theme} ${popupClassName || ''}`}
            getPopupContainer={getPopupContainer}
            builtinPlacements={placements}
            popupPlacement={popupPlacement}
            popupVisible={isOpen}
            action={props.disabled ? [] : [props.triggerSubMenuAction]}
            mouseEnterDelay={props.subMenuOpenDelay}
            mouseLeaveDelay={props.subMenuCloseDelay}
            onPopupVisibleChange={this.onPopupVisibleChange}
            forceRender={props.forceSubMenuRender}
            // popupTransitionName='rc-menu-open-slide-up'
            popupAnimation={transitionProps}
          >
            <template slot='popup'>
              {this.haveOpened ? children : null}
            </template>
            {title}
          </Trigger>
        )}
      </li>
    )
  },
}
</script>
