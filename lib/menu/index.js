'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menuProps = exports.MenuMode = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _vcMenu = require('../vc-menu');

var _vcMenu2 = _interopRequireDefault(_vcMenu);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _openAnimation = require('../_util/openAnimation');

var _openAnimation2 = _interopRequireDefault(_openAnimation);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _commonPropsType = require('../vc-menu/commonPropsType');

var _commonPropsType2 = _interopRequireDefault(_commonPropsType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MenuMode = exports.MenuMode = _vueTypes2['default'].oneOf(['vertical', 'vertical-left', 'vertical-right', 'horizontal', 'inline']);

var menuProps = exports.menuProps = (0, _extends3['default'])({}, _commonPropsType2['default'], {
  theme: _vueTypes2['default'].oneOf(['light', 'dark']).def('light'),
  mode: MenuMode.def('vertical'),
  selectable: _vueTypes2['default'].bool,
  selectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  defaultSelectedKeys: _vueTypes2['default'].array,
  openKeys: _vueTypes2['default'].array,
  defaultOpenKeys: _vueTypes2['default'].array,
  openAnimation: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
  openTransitionName: _vueTypes2['default'].string,
  prefixCls: _vueTypes2['default'].string.def('ant-menu'),
  multiple: _vueTypes2['default'].bool,
  inlineIndent: _vueTypes2['default'].number.def(24),
  inlineCollapsed: _vueTypes2['default'].bool,
  isRootMenu: _vueTypes2['default'].bool.def(true)
});

exports['default'] = {
  name: 'AMenu',
  props: menuProps,
  Divider: (0, _extends3['default'])({}, _vcMenu.Divider, { name: 'AMenuDivider' }),
  Item: (0, _extends3['default'])({}, _MenuItem2['default'], { name: 'AMenuItem' }),
  SubMenu: (0, _extends3['default'])({}, _vcMenu.SubMenu, { name: 'ASubMenu' }),
  ItemGroup: (0, _extends3['default'])({}, _vcMenu.ItemGroup, { name: 'AMenuItemGroup' }),
  provide: function provide() {
    return {
      getInlineCollapsed: this.getInlineCollapsed
    };
  },

  mixins: [_BaseMixin2['default']],
  inject: {
    layoutSiderContext: { 'default': {} }
  },
  model: {
    prop: 'selectedKeys',
    event: 'selectChange'
  },
  mounted: function mounted() {
    this.preProps = (0, _extends3['default'])({}, this.$props);
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
        if ((0, _propsUtil.hasProp)(this, 'openKeys')) {
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
        this.preProps = (0, _extends3['default'])({}, nextProps);
      },
      deep: true
    },
    'layoutSiderContext.sCollapsed': function layoutSiderContextSCollapsed(val) {
      var openKeys = this.openKeys,
          _sOpenKeys = this.sOpenKeys,
          sOpenKeys = _sOpenKeys === undefined ? [] : _sOpenKeys,
          prefixCls = this.prefixCls;

      if ((0, _propsUtil.hasProp)(this, 'openKeys')) {
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
    (0, _warning2['default'])(!((0, _propsUtil.hasProp)(this, 'inlineCollapsed') && props.mode !== 'inline'), '`inlineCollapsed` should only be used when Menu\'s `mode` is inline.');
    this.switchModeFromInline = false;
    this.leaveAnimationExecutedWhenInlineCollapsed = false;
    this.inlineOpenKeys = [];
    var sOpenKeys = void 0;
    if ((0, _propsUtil.hasProp)(this, 'defaultOpenKeys')) {
      sOpenKeys = props.defaultOpenKeys;
    } else if ((0, _propsUtil.hasProp)(this, 'openKeys')) {
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
      if (!(0, _propsUtil.hasProp)(this, 'openKeys')) {
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
            menuOpenAnimation = { on: (0, _extends3['default'])({}, _openAnimation2['default'], {
                leave: function leave(node, done) {
                  return _openAnimation2['default'].leave(node, function () {
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

    var menuClassName = (_menuClassName = {}, (0, _defineProperty3['default'])(_menuClassName, prefixCls + '-' + theme, true), (0, _defineProperty3['default'])(_menuClassName, prefixCls + '-inline-collapsed', this.getInlineCollapsed()), _menuClassName);

    var menuProps = {
      props: (0, _extends3['default'])({}, (0, _omit2['default'])(this.$props, ['inlineCollapsed']), {
        openKeys: this.sOpenKeys,
        mode: menuMode
      }),
      on: (0, _extends3['default'])({}, $listeners, {
        select: this.handleSelect,
        deselect: this.handleDeselect,
        openChange: this.handleOpenChange
      })
    };
    if (!(0, _propsUtil.hasProp)(this, 'selectedKeys')) {
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
      _vcMenu2['default'],
      (0, _babelHelperVueJsxMergeProps2['default'])([menuProps, { 'class': menuClassName }]),
      [$slots['default']]
    );
  }
};