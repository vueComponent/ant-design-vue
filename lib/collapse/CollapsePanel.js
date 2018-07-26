'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _src = require('./src');

var _src2 = _interopRequireDefault(_src);

var _commonProps = require('./src/commonProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ACollapsePanel',
  props: (0, _extends3['default'])({
    name: _vueTypes2['default'].string
  }, _commonProps.panelProps),
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        _showArrow = this.showArrow,
        showArrow = _showArrow === undefined ? true : _showArrow,
        $listeners = this.$listeners;

    var collapsePanelClassName = (0, _defineProperty3['default'])({}, prefixCls + '-no-arrow', !showArrow);
    var rcCollapePanelProps = {
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this)),
      'class': collapsePanelClassName,
      on: $listeners
    };
    var _$slots = this.$slots,
        defaultSlots = _$slots['default'],
        header = _$slots.header;

    return h(
      _src2['default'].Panel,
      rcCollapePanelProps,
      [defaultSlots, header ? h(
        'template',
        { slot: 'header' },
        [header]
      ) : null]
    );
  }
};
module.exports = exports['default'];