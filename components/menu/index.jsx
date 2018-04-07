
import omit from 'omit.js'
import VcMenu, { Divider, ItemGroup, SubMenu } from '../vc-menu'
import PropTypes from '../_util/vue-types'
import animation from '../_util/openAnimation'
import warning from '../_util/warning'
import Item from './MenuItem'
import { hasProp } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
import commonPropsType from '../vc-menu/commonPropsType'

export const MenuMode = PropTypes.oneOf(['vertical', 'vertical-left', 'vertical-right', 'horizontal', 'inline'])

export const menuProps = {
  ...commonPropsType,
  theme: PropTypes.oneOf(['light', 'dark']).def('light'),
  mode: MenuMode.def('vertical'),
  selectable: PropTypes.bool,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  defaultSelectedKeys: PropTypes.array,
  openKeys: PropTypes.array,
  defaultOpenKeys: PropTypes.array,
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  openTransitionName: PropTypes.string,
  prefixCls: PropTypes.string.def('ant-menu'),
  multiple: PropTypes.bool,
  inlineIndent: PropTypes.number.def(24),
  inlineCollapsed: PropTypes.bool,
  isRootMenu: PropTypes.bool.def(true),
}

export default {
  name: 'Menu',
  props: menuProps,
  Divider,
  Item,
  SubMenu,
  ItemGroup,
  provide () {
    return {
      inlineCollapsed: this.getInlineCollapsed(),
      getInlineCollapsed: this.getInlineCollapsed,
    }
  },
  mixins: [BaseMixin],
  inject: {
    layoutContext: { default: {}},
  },
  model: {
    prop: 'selectedKeys',
    event: 'selectChange',
  },
  mounted () {
    this.preProps = { ...this.props }
  },
  watch: {
    '$props': {
      handler: function (nextProps) {
        const { preProps, sOpenKeys } = this
        const { prefixCls } = preProps
        if (preProps.mode === 'inline' && nextProps.mode !== 'inline') {
          this.switchModeFromInline = true
        }
        if (hasProp(this, 'openKeys')) {
          this.setState({ sOpenKeys: nextProps.openKeys })
          return
        }
        if (nextProps.inlineCollapsed && !preProps.inlineCollapsed) {
          this.switchModeFromInline =
        !!sOpenKeys.length && !!this.$el.querySelectorAll(`.${prefixCls}-submenu-open`).length
          this.inlineOpenKeys = sOpenKeys
          this.setState({ sOpenKeys: [] })
        }

        if (!nextProps.inlineCollapsed && preProps.inlineCollapsed) {
          this.setState({ sOpenKeys: this.inlineOpenKeys })
          this.inlineOpenKeys = []
        }
        this.preProps = { ...nextProps }
      },
      deep: true,
    },
    'layoutContext.siderCollapsed': function (val) {
      const { openKeys, sOpenKeys, prefixCls } = this
      if (hasProp(this, 'openKeys')) {
        this.setState({ sOpenKeys: openKeys })
        return
      }
      if (val) {
        this.switchModeFromInline =
        !!sOpenKeys.length && !!this.$el.querySelectorAll(`.${prefixCls}-submenu-open`).length
        this.inlineOpenKeys = sOpenKeys
        this.setState({ sOpenKeys: [] })
      } else {
        this.setState({ sOpenKeys: this.inlineOpenKeys })
        this.inlineOpenKeys = []
      }
    },

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
      this.$emit('click', e)
    },
    handleSelect (info) {
      this.$emit('select', info)
      this.$emit('selectChange', info.selectedKeys)
    },
    handleDeselect (info) {
      this.$emit('deselect', info)
      this.$emit('selectChange', info.selectedKeys)
    },
    handleOpenChange (openKeys) {
      this.setOpenKeys(openKeys)
      this.$emit('openChange', openKeys)
      this.$emit('update:openKeys', openKeys)
    },
    setOpenKeys (openKeys) {
      if (!hasProp(this, 'openKeys')) {
        this.setState({ sOpenKeys: openKeys })
      }
    },
    getRealMenuMode () {
      const inlineCollapsed = this.getInlineCollapsed()
      if (this.switchModeFromInline && inlineCollapsed) {
        return 'inline'
      }
      const { mode } = this.$props
      return inlineCollapsed ? 'vertical' : mode
    },
    getInlineCollapsed () {
      const { inlineCollapsed } = this.$props
      if (this.layoutContext.siderCollapsed !== undefined) {
        return this.layoutContext.siderCollapsed
      }
      return inlineCollapsed
    },
    getMenuOpenAnimation (menuMode) {
      const { openAnimation, openTransitionName } = this.$props
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
            menuOpenAnimation = { on: {
              ...animation,
              leave: (node, done) => animation.leave(node, () => {
              // Make sure inline menu leave animation finished before mode is switched
                this.switchModeFromInline = false
                // this.setState({})
                this.$forceUpdate()
                // when inlineCollapsed change false to true, all submenu will be unmounted,
                // so that we don't need handle animation leaving.
                if (this.getRealMenuMode() === 'vertical') {
                  return
                }
                done()
              }),
            }}
            break
          default:
        }
      }
      return menuOpenAnimation
    },
  },
  render () {
    const { layoutContext, $slots, $listeners } = this
    const { collapsedWidth, siderCollapsed } = layoutContext
    this.preLayoutContext = {
      siderCollapsed,
      collapsedWidth,
    }
    const { prefixCls, theme } = this.$props
    const menuMode = this.getRealMenuMode()
    const menuOpenAnimation = this.getMenuOpenAnimation(menuMode)

    const menuClassName = {
      [`${prefixCls}-${theme}`]: true,
      [`${prefixCls}-inline-collapsed`]: this.getInlineCollapsed(),
    }

    const menuProps = {
      props: {
        ...omit(this.$props, ['inlineCollapsed']),
        openKeys: this.sOpenKeys,
        mode: menuMode,
      },
      on: {
        ...$listeners,
        select: this.handleSelect,
        deselect: this.handleDeselect,
        openChange: this.handleOpenChange,
      },
    }
    if (!hasProp(this, 'selectedKeys')) {
      delete menuProps.props.selectedKeys
    }

    if (menuMode !== 'inline') {
      // closing vertical popup submenu after click it
      menuProps.on.click = this.handleClick
      menuProps.props.openTransitionName = menuOpenAnimation
    } else {
      menuProps.props.openAnimation = menuOpenAnimation
    }

    // https://github.com/ant-design/ant-design/issues/8587
    if (
      this.getInlineCollapsed() &&
      (collapsedWidth === 0 || collapsedWidth === '0' || collapsedWidth === '0px')
    ) {
      return null
    }

    return <VcMenu {...menuProps} class={menuClassName}>{$slots.default}</VcMenu>
  },
}

