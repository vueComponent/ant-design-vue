'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _index = require('./src/index');

var _index2 = _interopRequireDefault(_index);

var _dropdownButton = require('./dropdown-button');

var _dropdownButton2 = _interopRequireDefault(_dropdownButton);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vnode = require('../_util/vnode');

var _propsUtil = require('../_util/props-util');

var _getDropdownProps = require('./getDropdownProps');

var _getDropdownProps2 = _interopRequireDefault(_getDropdownProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// import warning from '../_util/warning'
var DropdownProps = (0, _getDropdownProps2['default'])();
var Dropdown = {
  name: 'ADropdown',
  props: (0, _extends3['default'])({}, DropdownProps, {
    prefixCls: _vueTypes2['default'].string.def('ant-dropdown'),
    mouseEnterDelay: _vueTypes2['default'].number.def(0.15),
    mouseLeaveDelay: _vueTypes2['default'].number.def(0.1),
    placement: DropdownProps.placement.def('bottomLeft')
  }),
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  methods: {
    getTransitionName: function getTransitionName() {
      var _$props = this.$props,
          _$props$placement = _$props.placement,
          placement = _$props$placement === undefined ? '' : _$props$placement,
          transitionName = _$props.transitionName;

      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.indexOf('top') >= 0) {
        return 'slide-down';
      }
      return 'slide-up';
    }
  },

  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots,
        prefixCls = this.prefixCls,
        trigger = this.trigger,
        disabled = this.disabled,
        $listeners = this.$listeners;

    var dropdownTrigger = (0, _vnode.cloneElement)($slots['default'], {
      'class': prefixCls + '-trigger',
      disabled: disabled
    });
    var overlay = this.overlay || $slots.overlay && $slots.overlay[0];
    // menu cannot be selectable in dropdown defaultly, but multiple type can be selectable
    var overlayProps = overlay && (0, _propsUtil.getPropsData)(overlay);
    var selectable = false;
    if (overlayProps) {
      selectable = !!overlayProps.selectable || overlayProps.multiple;
    }
    var fixedModeOverlay = overlay && (0, _vnode.cloneElement)(overlay, {
      props: {
        mode: 'vertical',
        selectable: selectable,
        isRootMenu: false
      }
    });
    var dropdownProps = {
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this), {
        transitionName: this.getTransitionName(),
        trigger: disabled ? [] : trigger
      }),
      on: $listeners
    };
    return h(
      _index2['default'],
      dropdownProps,
      [dropdownTrigger, h(
        'template',
        { slot: 'overlay' },
        [fixedModeOverlay]
      )]
    );
  }
};

Dropdown.Button = _dropdownButton2['default'];
exports['default'] = Dropdown;
exports.DropdownProps = DropdownProps;