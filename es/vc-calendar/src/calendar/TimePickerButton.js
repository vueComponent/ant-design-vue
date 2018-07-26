import _defineProperty from 'babel-runtime/helpers/defineProperty';

function noop() {}
export default {
  functional: true,
  render: function render(h, context) {
    var _className;

    var props = context.props,
        _context$listeners = context.listeners,
        listeners = _context$listeners === undefined ? {} : _context$listeners;
    var prefixCls = props.prefixCls,
        locale = props.locale,
        showTimePicker = props.showTimePicker,
        timePickerDisabled = props.timePickerDisabled;
    var _listeners$closeTimeP = listeners.closeTimePicker,
        closeTimePicker = _listeners$closeTimeP === undefined ? noop : _listeners$closeTimeP,
        _listeners$openTimePi = listeners.openTimePicker,
        openTimePicker = _listeners$openTimePi === undefined ? noop : _listeners$openTimePi;

    var className = (_className = {}, _defineProperty(_className, prefixCls + '-time-picker-btn', true), _defineProperty(_className, prefixCls + '-time-picker-btn-disabled', timePickerDisabled), _className);
    var onClick = noop;
    if (!timePickerDisabled) {
      onClick = showTimePicker ? closeTimePicker : openTimePicker;
    }
    return h(
      'a',
      { 'class': className, attrs: { role: 'button' },
        on: {
          'click': onClick
        }
      },
      [showTimePicker ? locale.dateSelect : locale.timeSelect]
    );
  }
};