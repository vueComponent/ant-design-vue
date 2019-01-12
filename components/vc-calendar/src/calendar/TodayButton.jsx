import { getTodayTimeStr, getTodayTime, isAllowedDate } from '../util/';
function noop() {}
export default {
  functional: true,
  render(createElement, context) {
    const { props, listeners = {} } = context;
    const {
      prefixCls,
      locale,
      value,
      timePicker,
      disabled,
      disabledDate,
      // onToday,
      text,
    } = props;
    const { today = noop } = listeners;
    const localeNow = (!text && timePicker ? locale.now : text) || locale.today;
    const disabledToday = disabledDate && !isAllowedDate(getTodayTime(value), disabledDate);
    const isDisabled = disabledToday || disabled;
    const disabledTodayClass = isDisabled ? `${prefixCls}-today-btn-disabled` : '';
    return (
      <a
        class={`${prefixCls}-today-btn ${disabledTodayClass}`}
        role="button"
        onClick={isDisabled ? noop : today}
        title={getTodayTimeStr(value)}
      >
        {localeNow}
      </a>
    );
  },
};
