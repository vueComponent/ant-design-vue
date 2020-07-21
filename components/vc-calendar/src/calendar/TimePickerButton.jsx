function noop() {}
const TimePickerButton = (_, { attrs }) => {
  const {
    prefixCls,
    locale,
    showTimePicker,
    timePickerDisabled,
    onCloseTimePicker = noop,
    onOpenTimePicker = noop,
  } = attrs;
  const className = {
    [`${prefixCls}-time-picker-btn`]: true,
    [`${prefixCls}-time-picker-btn-disabled`]: timePickerDisabled,
  };
  let onClick = noop;
  if (!timePickerDisabled) {
    onClick = showTimePicker ? onCloseTimePicker : onOpenTimePicker;
  }
  return (
    <a class={className} role="button" onClick={onClick}>
      {showTimePicker ? locale.dateSelect : locale.timeSelect}
    </a>
  );
};

TimePickerButton.inheritAttrs = false;
export default TimePickerButton;
