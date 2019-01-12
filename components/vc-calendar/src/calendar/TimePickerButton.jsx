function noop() {}
export default {
  functional: true,
  render(h, context) {
    const { props, listeners = {} } = context;
    const { prefixCls, locale, showTimePicker, timePickerDisabled } = props;
    const { closeTimePicker = noop, openTimePicker = noop } = listeners;
    const className = {
      [`${prefixCls}-time-picker-btn`]: true,
      [`${prefixCls}-time-picker-btn-disabled`]: timePickerDisabled,
    };
    let onClick = noop;
    if (!timePickerDisabled) {
      onClick = showTimePicker ? closeTimePicker : openTimePicker;
    }
    return (
      <a class={className} role="button" onClick={onClick}>
        {showTimePicker ? locale.dateSelect : locale.timeSelect}
      </a>
    );
  },
};
