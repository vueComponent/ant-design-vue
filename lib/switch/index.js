'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _vcSwitch = require('../vc-switch');

var _vcSwitch2 = _interopRequireDefault(_vcSwitch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ASwitch',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    prefixCls: _vueTypes2['default'].string.def('ant-switch'),
    // size=default and size=large are the same
    size: _vueTypes2['default'].oneOf(['small', 'default', 'large']),
    disabled: _vueTypes2['default'].bool,
    checkedChildren: _vueTypes2['default'].any,
    unCheckedChildren: _vueTypes2['default'].any,
    tabIndex: _vueTypes2['default'].number,
    checked: _vueTypes2['default'].bool,
    defaultChecked: _vueTypes2['default'].bool,
    autoFocus: _vueTypes2['default'].bool,
    loading: _vueTypes2['default'].bool
  },
  methods: {
    focus: function focus() {
      this.$refs.refSwitchNode.focus();
    },
    blur: function blur() {
      this.$refs.refSwitchNode.blur();
    }
  },

  render: function render() {
    var _classes;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        prefixCls = _getOptionProps.prefixCls,
        size = _getOptionProps.size,
        loading = _getOptionProps.loading,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'size', 'loading']);

    var classes = (_classes = {}, (0, _defineProperty3['default'])(_classes, prefixCls + '-small', size === 'small'), (0, _defineProperty3['default'])(_classes, prefixCls + '-loading', loading), _classes);
    var switchProps = {
      props: (0, _extends3['default'])({}, restProps, {
        prefixCls: prefixCls
      }),
      on: this.$listeners,
      'class': classes,
      ref: 'refSwitchNode'
    };
    return h(
      _vcSwitch2['default'],
      switchProps,
      [h(
        'template',
        { slot: 'checkedChildren' },
        [(0, _propsUtil.getComponentFromProp)(this, 'checkedChildren')]
      ), h(
        'template',
        { slot: 'unCheckedChildren' },
        [(0, _propsUtil.getComponentFromProp)(this, 'unCheckedChildren')]
      )]
    );
  }
};
module.exports = exports['default'];