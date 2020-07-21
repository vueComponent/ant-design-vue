import { getTodayTimeStr, getTodayTime, isAllowedDate } from '../util/';
function noop() {}
const TodayButton = (_, { attrs }) => {
  const { prefixCls, locale, value, timePicker, disabled, disabledDate, onToday, text } = attrs;
  const localeNow = (!text && timePicker ? locale.now : text) || locale.today;
  const disabledToday = disabledDate && !isAllowedDate(getTodayTime(value), disabledDate);
  const isDisabled = disabledToday || disabled;
  const disabledTodayClass = isDisabled ? `${prefixCls}-today-btn-disabled` : '';
  return (
    <a
      class={`${prefixCls}-today-btn ${disabledTodayClass}`}
      role="button"
      onClick={isDisabled ? noop : onToday}
      title={getTodayTimeStr(value)}
    >
      {localeNow}
    </a>
  );
};

TodayButton.inheritAttrs = false;

export default TodayButton;
