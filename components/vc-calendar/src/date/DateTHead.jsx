import DateConstants from './DateConstants';
import moment from 'moment';

const DateTHead = (_, { attrs }) => {
  const value = attrs.value;
  const localeData = value.localeData();
  const prefixCls = attrs.prefixCls;
  const veryShortWeekdays = [];
  const weekDays = [];
  const firstDayOfWeek = localeData.firstDayOfWeek();
  let showWeekNumberEl;
  const now = moment();
  for (let dateColIndex = 0; dateColIndex < DateConstants.DATE_COL_COUNT; dateColIndex++) {
    const index = (firstDayOfWeek + dateColIndex) % DateConstants.DATE_COL_COUNT;
    now.day(index);
    veryShortWeekdays[dateColIndex] = localeData.weekdaysMin(now);
    weekDays[dateColIndex] = localeData.weekdaysShort(now);
  }

  if (attrs.showWeekNumber) {
    showWeekNumberEl = (
      <th role="columnheader" class={`${prefixCls}-column-header ${prefixCls}-week-number-header`}>
        <span class={`${prefixCls}-column-header-inner`}>x</span>
      </th>
    );
  }
  const weekDaysEls = weekDays.map((day, xindex) => {
    return (
      <th key={xindex} role="columnheader" title={day} class={`${prefixCls}-column-header`}>
        <span class={`${prefixCls}-column-header-inner`}>{veryShortWeekdays[xindex]}</span>
      </th>
    );
  });
  return (
    <thead>
      <tr role="row">
        {showWeekNumberEl}
        {weekDaysEls}
      </tr>
    </thead>
  );
};

DateTHead.inheritAttrs = false;

export default DateTHead;
