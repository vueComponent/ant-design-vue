import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import omit from 'omit.js';
import VcMenu, { Divider, ItemGroup, SubMenu } from '../vc-menu';
import PropTypes from '../_util/vue-types';
import animation from '../_util/openAnimation';
import warning from '../_util/warning';
import Item from './MenuItem';
import { hasProp } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import commonPropsType from '../vc-menu/commonPropsType';

export var MenuMode = PropTypes.oneOf(['vertical', 'vertical-left', 'vertical-right', 'horizontal', 'inline']);

export var menuProps = _extends({}, commonPropsType, {
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
  isRootMenu: PropTypes.bool.def(true)
});

export default {
  name: 'AMenu',
  props: menuProps,
  Divider: _extends({}, Divider, { name: 'AMenuDivider' }),
  Item: _extends({}, Item, { name: 'AMenuItem' }),
  SubMenu: _extends({}, SubMenu, { name: 'ASubMenu' }),
  ItemGroup: _extends({}, ItemGroup, { name: 'AMenuItemGroup' }),
  provide: function provide() {
    return {
      getInlineCollapsed: this.getInlineCollapsed
    };
  },

  mixins: [BaseMixin],
  inject: {
    layoutSiderContext: { 'default': {} }
  },
  model: {
    prop: 'selectedKeys',
    event: 'selectChange'
  },
  mounted: function mounted() {
    this.preProps = _extends({}, this.$props);
  },

  watch: {
    '$props': {
      handler: function handler(nextProps) {
        var preProps = this.preProps,
            sOpenKeys = this.sOpenKeys;
        var prefixCls = preProps.prefixCls;

        if (preProps.mode === 'inline' && nextProps.mode !== 'inline') {
          this.switchModeFromInline = true;
        }
        if (hasProp(this, 'openKeys')) {
          this.setState({ sOpenKeys: nextProps.openKeys });
          return;
        }
        if (nextProps.inlineCollapsed && !preProps.inlineCollapsed) {
          this.switchModeFromInline = !!sOpenKeys.length && !!this.$el.querySelectorAll('.' + prefixCls + '-submenu-open').length;
          this.inlineOpenKeys = sOpenKeys;
          this.setState({ sOpenKeys: [] });
        }

        if (!nextProps.inlineCollapsed && preProps.inlineCollapsed) {
          this.setState({ sOpenKeys: this.inlineOpenKeys });
          this.inlineOpenKeys = [];
        }
        this.preProps = _extends({}, nextProps);
      },
      deep: true
    },
    'layoutSiderContext.sCollapsed': function layoutSiderContextSCollapsed(val) {
      var openKeys = this.openKeys,
          _sOpenKeys = this.sOpenKeys,
          sOpenKeys = _sOpenKeys === undefined ? [] : _sOpenKeys,
          prefixCls = this.prefixCls;

      if (hasProp(this, 'openKeys')) {
        this.setState({ sOpenKeys: openKeys });
        return;
      }
      if (val) {
        this.switchModeFromInline = !!sOpenKeys.length && !!this.$el.querySelectorAll('.' + prefixCls + '-submenu-open').length;
        this.inlineOpenKeys = sOpenKeys;
        this.setState({ sOpenKeys: [] });
      } else {
        this.setState({ sOpenKeys: this.inlineOpenKeys });
        this.inlineOpenKeys = [];
      }
    }

  },
  data: function data() {
    var props = this.$props;
    warning(!(hasProp(this, 'inlineCollapsed') && props.mode !== 'inline'), '`inlineCollapsed` should only be used when Menu\'s `mode` is inline.');
    this.switchModeFromInline = false;
    this.leaveAnimationExecutedWhenInlineCollapsed = false;
    this.inlineOpenKeys = [];
    var sOpenKeys = void 0;
    if (hasProp(this, 'defaultOpenKeys')) {
      sOpenKeys = props.defaultOpenKeys;
    } else if (hasProp(this, 'openKeys')) {
      sOpenKeys = props.openKeys;
    }
    return {
      sOpenKeys: sOpenKeys
    };
  },

  methods: {
    handleClick: function handleClick(e) {
      this.handleOpenChange([]);
      this.$emit('click', e);
    },
    handleSelect: function handleSelect(info) {
      this.$emit('select', info);
      this.$emit('selectChange', info.selectedKeys);
    },
    handleDeselect: function handleDeselect(info) {
      this.$emit('deselect', info);
      this.$emit('selectChange', info.selectedKeys);
    },
    handleOpenChange: function handleOpenChange(openKeys) {
      this.setOpenKeys(openKeys);
      this.$emit('openChange', openKeys);
      this.$emit('update:openKeys', openKeys);
    },
    setOpenKeys: function setOpenKeys(openKeys) {
      if (!hasProp(this, 'openKeys')) {
        this.setState({ sOpenKeys: openKeys });
      }
    },
    getRealMenuMode: function getRealMenuMode() {
      var inlineCollapsed = this.getInlineCollapsed();
      if (this.switchModeFromInline && inlineCollapsed) {
        return 'inline';
      }
      var mode = this.$props.mode;

      return inlineCollapsed ? 'vertical' : mode;
    },
    getInlineCollapsed: function getInlineCollapsed() {
      var inlineCollapsed = this.$props.inlineCollapsed;

      if (this.layoutSiderContext.sCollapsed !== undefined) {
        return this.layoutSiderContext.sCollapsed;
      }
      return inlineCollapsed;
    },
    getMenuOpenAnimation: function getMenuOpenAnimation(menuMode) {
      var _this = this;

      var _$props = this.$props,
          openAnimation = _$props.openAnimation,
          openTransitionName = _$props.openTransitionName;

      var menuOpenAnimation = openAnimation || openTransitionName;
      if (openAnimation === undefined && openTransitionName === undefined) {
        switch (menuMode) {
          case 'horizontal':
            menuOpenAnimation = 'slide-up';
            break;
          case 'vertical':
          case 'vertical-left':
          case 'vertical-right':
            // When mode switch from inline
            // submenu should hide without animation
            if (this.switchModeFromInline) {
              menuOpenAnimation = '';
              this.switchModeFromInline = false;
            } else {
              menuOpenAnimation = 'zoom-big';
            }
            break;
          case 'inline':
            menuOpenAnimation = { on: _extends({}, animation, {
                leave: function leave(node, done) {
                  return animation.leave(node, function () {
                    // Make sure inline menu leave animation finished before mode is switched
                    _this.switchModeFromInline = false;
                    // this.setState({})
                    _this.$forceUpdate();
                    // when inlineCollapsed change false to true, all submenu will be unmounted,
                    // so that we don't need handle animation leaving.
                    if (_this.getRealMenuMode() === 'vertical') {
                      return;
                    }
                    done();
                  });
                }
              }) };
            break;
          default:
        }
      }
      return menuOpenAnimation;
    }
  },
  render: function render() {
    var _menuClassName,
        _this2 = this;

    var h = arguments[0];
    var layoutSiderContext = this.layoutSiderContext,
        $slots = this.$slots,
        $listeners = this.$listeners;
    var collapsedWidth = layoutSiderContext.collapsedWidth;
    var _$props2 = this.$props,
        prefixCls = _$props2.prefixCls,
        theme = _$props2.theme;

    var menuMode = this.getRealMenuMode();
    var menuOpenAnimation = this.getMenuOpenAnimation(menuMode);

    var menuClassName = (_menuClassName = {}, _defineProperty(_menuClassName, prefixCls + '-' + theme, true), _defineProperty(_menuClassName, prefixCls + '-inline-collapsed', this.getInlineCollapsed()), _menuClassName);

    var menuProps = {
      props: _extends({}, omit(this.$props, ['inlineCollapsed']), {
        openKeys: this.sOpenKeys,
        mode: menuMode
      }),
      on: _extends({}, $listeners, {
        select: this.handleSelect,
        deselect: this.handleDeselect,
        openChange: this.handleOpenChange
      })
    };
    if (!hasProp(this, 'selectedKeys')) {
      delete menuProps.props.selectedKeys;
    }

    if (menuMode !== 'inline') {
      // closing vertical popup submenu after click it
      menuProps.on.click = this.handleClick;
      menuProps.props.openTransitionName = menuOpenAnimation;
    } else {
      menuProps.on.click = function (e) {
        _this2.$emit('click', e);
      };
      menuProps.props.openAnimation = menuOpenAnimation;
    }

    // https://github.com/ant-design/ant-design/issues/8587
    if (this.getInlineCollapsed() && (collapsedWidth === 0 || collapsedWidth === '0' || collapsedWidth === '0px')) {
      return null;
    }

    return h(
      VcMenu,
      _mergeJSXProps([menuProps, { 'class': menuClassName }]),
      [$slots['default']]
    );
  }
};