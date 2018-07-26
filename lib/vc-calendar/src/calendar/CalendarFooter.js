'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../../_util/props-util');

var _TodayButton = require('./TodayButton');

var _TodayButton2 = _interopRequireDefault(_TodayButton);

var _OkButton = require('./OkButton');

var _OkButton2 = _interopRequireDefault(_OkButton);

var _TimePickerButton = require('./TimePickerButton');

var _TimePickerButton2 = _interopRequireDefault(_TimePickerButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CalendarFooter = {
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string,
    showDateInput: _vueTypes2['default'].bool,
    disabledTime: _vueTypes2['default'].any,
    timePicker: _vueTypes2['default'].any,
    selectedValue: _vueTypes2['default'].any,
    showOk: _vueTypes2['default'].bool,
    // onSelect: PropTypes.func,
    value: _vueTypes2['default'].object,
    renderFooter: _vueTypes2['default'].func,
    defaultValue: _vueTypes2['default'].object,
    locale: _vueTypes2['default'].object,
    showToday: _vueTypes2['default'].bool,
    disabledDate: _vueTypes2['default'].func,
    showTimePicker: _vueTypes2['default'].bool,
    okDisabled: _vueTypes2['default'].bool
  },
  methods: {
    onSelect: function onSelect(value) {
      this.__emit('select', value);
    },
    getRootDOMNode: function getRootDOMNode() {
      return this.$el;
    }
  },

  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var $listeners = this.$listeners;
    var value = props.value,
        prefixCls = props.prefixCls,
        showOk = props.showOk,
        timePicker = props.timePicker,
        renderFooter = props.renderFooter,
        showToday = props.showToday;

    var footerEl = null;
    var extraFooter = renderFooter();
    if (showToday || timePicker || extraFooter) {
      var _cls;

      var btnProps = {
        props: (0, _extends3['default'])({}, props, {
          value: value
        }),
        on: $listeners
      };
      var nowEl = null;
      if (showToday) {
        nowEl = h(_TodayButton2['default'], btnProps);
      }
      delete btnProps.props.value;
      var okBtn = null;
      if (showOk === true || showOk !== false && !!timePicker) {
        okBtn = h(_OkButton2['default'], btnProps);
      }
      var timePickerBtn = null;
      if (timePicker) {
        timePickerBtn = h(_TimePickerButton2['default'], btnProps);
      }

      var footerBtn = void 0;
      if (nowEl || timePickerBtn || okBtn) {
        footerBtn = h(
          'span',
          { 'class': prefixCls + '-footer-btn' },
          [nowEl, timePickerBtn, okBtn]
        );
      }
      var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls + '-footer', true), (0, _defineProperty3['default'])(_cls, prefixCls + '-footer-show-ok', !!okBtn), _cls);
      footerEl = h(
        'div',
        { 'class': cls },
        [extraFooter, footerBtn]
      );
    }
    return footerEl;
  }
};

exports['default'] = CalendarFooter;
module.exports = exports['default'];