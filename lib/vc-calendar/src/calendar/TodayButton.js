'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util/');

function noop() {}
exports['default'] = {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props,
        _context$listeners = context.listeners,
        listeners = _context$listeners === undefined ? {} : _context$listeners;
    var prefixCls = props.prefixCls,
        locale = props.locale,
        value = props.value,
        timePicker = props.timePicker,
        disabled = props.disabled,
        disabledDate = props.disabledDate,
        text = props.text;
    var _listeners$today = listeners.today,
        today = _listeners$today === undefined ? noop : _listeners$today;

    var localeNow = (!text && timePicker ? locale.now : text) || locale.today;
    var disabledToday = disabledDate && !(0, _util.isAllowedDate)((0, _util.getTodayTime)(value), disabledDate);
    var isDisabled = disabledToday || disabled;
    var disabledTodayClass = isDisabled ? prefixCls + '-today-btn-disabled' : '';
    return h(
      'a',
      {
        'class': prefixCls + '-today-btn ' + disabledTodayClass,
        attrs: { role: 'button',

          title: (0, _util.getTodayTimeStr)(value)
        },
        on: {
          'click': isDisabled ? noop : today
        }
      },
      [localeNow]
    );
  }
};
module.exports = exports['default'];