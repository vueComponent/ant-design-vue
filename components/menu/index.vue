<script>
import RcMenu, { Divider, ItemGroup, SubMenu } from '../src'
import PropTypes from '../util/vue-types'
import animation from '../_util/openAnimation'
import warning from '../_util/warning'
import Item from './MenuItem'
import { hasProp } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'

export const MenuMode = PropTypes.oneOf(['vertical', 'vertical-left', 'vertical-right', 'horizontal', 'inline'])

export const menuProps = {
  theme: PropTypes.oneOf(['light', 'dark']).def('light'),
  mode: MenuMode,
  selectable: PropTypes.bool,
  selectedKeys: PropTypes.array,
  defaultSelectedKeys: PropTypes.array,
  openKeys: PropTypes.array,
  defaultOpenKeys: PropTypes.array,
  // onOpenChange: (openKeys: string[]) => void;
  // onSelect: (param: SelectParam) => void;
  // onDeselect: (param: SelectParam) => void;
  // onClick: (param: ClickParam) => void;
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  openTransitionName: PropTypes.string,
  prefixCls: PropTypes.string.def('ant-menu'),
  multiple: PropTypes.bool,
  inlineIndent: PropTypes.number.def(24),
  inlineCollapsed: PropTypes.bool,
}

export default {
  props: menuProps,
  Divider,
  Item,
  SubMenu,
  ItemGroup,
  provide () {
    return {
      inlineCollapsed: this.getInlineCollapsed(),
      antdMenuTheme: this.$props.theme,
    }
  },
  mixins: [BaseMixin],
  inject: {
    siderCollapsed: { default: undefined },
    collapsedWidth: { default: undefined },
  },
  data () {
    const props = this.$props
    warning(
      !(hasProp(this, 'inlineCollapsed') && props.mode !== 'inline'),
      '`inlineCollapsed` should only be used when Menu\'s `mode` is inline.',
    )
    this.switchModeFromInline = false
    this.leaveAnimationExecutedWhenInlineCollapsed = false
    this.inlineOpenKeys = []
    let sOpenKeys
    if (hasProp(this, 'defaultOpenKeys')) {
      sOpenKeys = props.defaultOpenKeys
    } else if (hasProp(this, 'openKeys')) {
      sOpenKeys = props.openKeys
    }
    return {
      sOpenKeys,
    }
  },
  methods: {
    handleClick (e) {
      this.handleOpenChange([])
      const { onClick } = this.props
      if (onClick) {
        onClick(e)
      }
    },
    handleOpenChange (openKeys) {
      this.setOpenKeys(openKeys)

      const { onOpenChange } = this.props
      if (onOpenChange) {
        onOpenChange(openKeys)
      }
    },
    setOpenKeys (openKeys) {
      if (!('openKeys' in this.props)) {
        this.setState({ openKeys })
      }
    },
    getRealMenuMode () {
      const inlineCollapsed = this.getInlineCollapsed()
      if (this.switchModeFromInline && inlineCollapsed) {
        return 'inline'
      }
      const { mode } = this.props
      return inlineCollapsed ? 'vertical' : mode
    },
    getInlineCollapsed () {
      const { inlineCollapsed } = this.props
      if (this.context.siderCollapsed !== undefined) {
        return this.context.siderCollapsed
      }
      return inlineCollapsed
    },
    getMenuOpenAnimation (menuMode) {
      const { openAnimation, openTransitionName } = this.props
      let menuOpenAnimation = openAnimation || openTransitionName
      if (openAnimation === undefined && openTransitionName === undefined) {
        switch (menuMode) {
          case 'horizontal':
            menuOpenAnimation = 'slide-up'
            break
          case 'vertical':
          case 'vertical-left':
          case 'vertical-right':
          // When mode switch from inline
          // submenu should hide without animation
            if (this.switchModeFromInline) {
              menuOpenAnimation = ''
              this.switchModeFromInline = false
            } else {
              menuOpenAnimation = 'zoom-big'
            }
            break
          case 'inline':
            menuOpenAnimation = {
              ...animation,
              leave: (node, done: () => void) => animation.leave(node, () => {
              // Make sure inline menu leave animation finished before mode is switched
                this.switchModeFromInline = false
                this.setState({})
                // when inlineCollapsed change false to true, all submenu will be unmounted,
                // so that we don't need handle animation leaving.
                if (this.getRealMenuMode() === 'vertical') {
                  return
                }
                done()
              }),
            }
            break
          default:
        }
      }
      return menuOpenAnimation
    },
  },

  componentWillReceiveProps (nextProps, nextContext) {
    const { prefixCls } = this.props
    if (this.props.mode === 'inline' &&
        nextProps.mode !== 'inline') {
      this.switchModeFromInline = true
    }
    if ('openKeys' in nextProps) {
      this.setState({ openKeys: nextProps.openKeys })
      return
    }
    if ((nextProps.inlineCollapsed && !this.props.inlineCollapsed) ||
        (nextContext.siderCollapsed && !this.context.siderCollapsed)) {
      this.switchModeFromInline =
        !!this.state.openKeys.length && !!this.$el.querySelectorAll(`.${prefixCls}-submenu-open`).length
      this.inlineOpenKeys = this.state.openKeys
      this.setState({ openKeys: [] })
    }
    if ((!nextProps.inlineCollapsed && this.props.inlineCollapsed) ||
        (!nextContext.siderCollapsed && this.context.siderCollapsed)) {
      this.setState({ openKeys: this.inlineOpenKeys })
      this.inlineOpenKeys = []
    }
  },
  render () {
    const { prefixCls, className, theme } = this.props
    const menuMode = this.getRealMenuMode()
    const menuOpenAnimation = this.getMenuOpenAnimation(menuMode)

    const menuClassName = {
      [`${prefixCls}-${theme}`]: true,
      [`${prefixCls}-inline-collapsed`]: this.getInlineCollapsed(),
    }

    const menuProps = {
      openKeys: this.state.openKeys,
      onOpenChange: this.handleOpenChange,
      className: menuClassName,
      mode: menuMode,
    }

    if (menuMode !== 'inline') {
      // closing vertical popup submenu after click it
      menuProps.onClick = this.handleClick
      menuProps.openTransitionName = menuOpenAnimation
    } else {
      menuProps.openAnimation = menuOpenAnimation
    }

    // https://github.com/ant-design/ant-design/issues/8587
    const { collapsedWidth } = this.context
    if (
      this.getInlineCollapsed() &&
      (collapsedWidth === 0 || collapsedWidth === '0' || collapsedWidth === '0px')
    ) {
      return null
    }

    return <RcMenu {...this.props} {...menuProps} />
  },
}

</script>
