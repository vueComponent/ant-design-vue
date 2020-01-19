import PropTypes from '../../../_util/vue-types';
import { getOptionProps, getListeners } from '../../../_util/props-util';
import cx from 'classnames';
import DateConstants from './DateConstants';
import { getTitleString, getTodayTime } from '../util/';
function noop() {}
function isSameDay(one, two) {
  return one && two && one.isSame(two, 'day');
}

function beforeCurrentMonthYear(current, today) {
  if (current.year() < today.year()) {
    return 1;
  }
  return current.year() === today.year() && current.month() < today.month();
}

function afterCurrentMonthYear(current, today) {
  if (current.year() > today.year()) {
    return 1;
  }
  return current.year() === today.year() && current.month() > today.month();
}

function getIdFromDate(date) {
  return `rc-calendar-${date.year()}-${date.month()}-${date.date()}`;
}

const DateTBody = {
  props: {
    contentRender: PropTypes.func,
    dateRender: PropTypes.func,
    disabledDate: PropTypes.func,
    prefixCls: PropTypes.string,
    selectedValue: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.any)]),
    value: PropTypes.object,
    hoverValue: PropTypes.any.def([]),
    showWeekNumber: PropTypes.bool,
  },

  render() {
    const props = getOptionProps(this);
    const {
      contentRender,
      prefixCls,
      selectedValue,
      value,
      showWeekNumber,
      dateRender,
      disabledDate,
      hoverValue,
    } = props;
    const { select = noop, dayHover = noop } = getListeners(this);
    let iIndex;
    let jIndex;
    let current;
    const dateTable = [];
    const today = getTodayTime(value);
    const cellClass = `${prefixCls}-cell`;
    const weekNumberCellClass = `${prefixCls}-week-number-cell`;
    const dateClass = `${prefixCls}-date`;
    const todayClass = `${prefixCls}-today`;
    const selectedClass = `${prefixCls}-selected-day`;
    const selectedDateClass = `${prefixCls}-selected-date`; // do not move with mouse operation
    const selectedStartDateClass = `${prefixCls}-selected-start-date`;
    const selectedEndDateClass = `${prefixCls}-selected-end-date`;
    const inRangeClass = `${prefixCls}-in-range-cell`;
    const lastMonthDayClass = `${prefixCls}-last-month-cell`;
    const nextMonthDayClass = `${prefixCls}-next-month-btn-day`;
    const disabledClass = `${prefixCls}-disabled-cell`;
    const firstDisableClass = `${prefixCls}-disabled-cell-first-of-row`;
    const lastDisableClass = `${prefixCls}-disabled-cell-last-of-row`;
    const lastDayOfMonthClass = `${prefixCls}-last-day-of-month`;
    const month1 = value.clone();
    month1.date(1);
    const day = month1.day();
    const lastMonthDiffDay = (day + 7 - value.localeData().firstDayOfWeek()) % 7;
    // calculate last month
    const lastMonth1 = month1.clone();
    lastMonth1.add(0 - lastMonthDiffDay, 'days');
    let passed = 0;
    for (iIndex = 0; iIndex < DateConstants.DATE_ROW_COUNT; iIndex++) {
      for (jIndex = 0; jIndex < DateConstants.DATE_COL_COUNT; jIndex++) {
        current = lastMonth1;
        if (passed) {
          current = current.clone();
          current.add(passed, 'days');
        }
        dateTable.push(current);
        passed++;
      }
    }
    const tableHtml = [];
    passed = 0;

    for (iIndex = 0; iIndex < DateConstants.DATE_ROW_COUNT; iIndex++) {
      let isCurrentWeek;
      let weekNumberCell;
      let isActiveWeek = false;
      const dateCells = [];
      if (showWeekNumber) {
        weekNumberCell = (
          <td key={`week-${dateTable[passed].week()}`} role="gridcell" class={weekNumberCellClass}>
            {dateTable[passed].week()}
          </td>
        );
      }
      for (jIndex = 0; jIndex < DateConstants.DATE_COL_COUNT; jIndex++) {
        let next = null;
        let last = null;
        current = dateTable[passed];
        if (jIndex < DateConstants.DATE_COL_COUNT - 1) {
          next = dateTable[passed + 1];
        }
        if (jIndex > 0) {
          last = dateTable[passed - 1];
        }
        let cls = cellClass;
        let disabled = false;
        let selected = false;

        if (isSameDay(current, today)) {
          cls += ` ${todayClass}`;
          isCurrentWeek = true;
        }

        const isBeforeCurrentMonthYear = beforeCurrentMonthYear(current, value);
        const isAfterCurrentMonthYear = afterCurrentMonthYear(current, value);

        if (selectedValue && Array.isArray(selectedValue)) {
          const rangeValue = hoverValue.length ? hoverValue : selectedValue;
          if (!isBeforeCurrentMonthYear && !isAfterCurrentMonthYear) {
            const startValue = rangeValue[0];
            const endValue = rangeValue[1];
            if (startValue) {
              if (isSameDay(current, startValue)) {
                selected = true;
                isActiveWeek = true;
                cls += ` ${selectedStartDateClass}`;
              }
            }
            if (startValue && endValue) {
              if (isSameDay(current, endValue)) {
                selected = true;
                isActiveWeek = true;
                cls += ` ${selectedEndDateClass}`;
              } else if (current.isAfter(startValue, 'day') && current.isBefore(endValue, 'day')) {
                cls += ` ${inRangeClass}`;
              }
            }
          }
        } else if (isSameDay(current, value)) {
          // keyboard change value, highlight works
          selected = true;
          isActiveWeek = true;
        }

        if (isSameDay(current, selectedValue)) {
          cls += ` ${selectedDateClass}`;
        }

        if (isBeforeCurrentMonthYear) {
          cls += ` ${lastMonthDayClass}`;
        }
        if (isAfterCurrentMonthYear) {
          cls += ` ${nextMonthDayClass}`;
        }

        if (
          current
            .clone()
            .endOf('month')
            .date() === current.date()
        ) {
          cls += ` ${lastDayOfMonthClass}`;
        }

        if (disabledDate) {
          if (disabledDate(current, value)) {
            disabled = true;

            if (!last || !disabledDate(last, value)) {
              cls += ` ${firstDisableClass}`;
            }

            if (!next || !disabledDate(next, value)) {
              cls += ` ${lastDisableClass}`;
            }
          }
        }

        if (selected) {
          cls += ` ${selectedClass}`;
        }

        if (disabled) {
          cls += ` ${disabledClass}`;
        }

        let dateHtml;
        if (dateRender) {
          dateHtml = dateRender(current, value);
        } else {
          const content = contentRender ? contentRender(current, value) : current.date();
          dateHtml = (
            <div
              key={getIdFromDate(current)}
              class={dateClass}
              aria-selected={selected}
              aria-disabled={disabled}
            >
              {content}
            </div>
          );
        }

        dateCells.push(
          <td
            key={passed}
            onClick={disabled ? noop : select.bind(null, current)}
            onMouseenter={disabled ? noop : dayHover.bind(null, current)}
            role="gridcell"
            title={getTitleString(current)}
            class={cls}
          >
            {dateHtml}
          </td>,
        );

        passed++;
      }

      tableHtml.push(
        <tr
          key={iIndex}
          role="row"
          class={cx({
            [`${prefixCls}-current-week`]: isCurrentWeek,
            [`${prefixCls}-active-week`]: isActiveWeek,
          })}
        >
          {weekNumberCell}
          {dateCells}
        </tr>,
      );
    }
    return <tbody class={`${prefixCls}-tbody`}>{tableHtml}</tbody>;
  },
};

export default DateTBody;
