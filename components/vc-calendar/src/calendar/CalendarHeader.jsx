import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getOptionProps, getListeners } from '../../../_util/props-util';
import MonthPanel from '../month/MonthPanel';
import YearPanel from '../year/YearPanel';
import DecadePanel from '../decade/DecadePanel';
function noop() {}
function goMonth(direction) {
  const next = this.value.clone();
  next.add(direction, 'months');
  this.__emit('valueChange', next);
}

function goYear(direction) {
  const next = this.value.clone();
  next.add(direction, 'years');
  this.__emit('valueChange', next);
}

function showIf(condition, el) {
  return condition ? el : null;
}

const CalendarHeader = {
  name: 'CalendarHeader',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    // onValueChange: PropTypes.func,
    showTimePicker: PropTypes.bool,
    // onPanelChange: PropTypes.func,
    locale: PropTypes.object,
    enablePrev: PropTypes.any.def(1),
    enableNext: PropTypes.any.def(1),
    disabledMonth: PropTypes.func,
    mode: PropTypes.any,
    monthCellRender: PropTypes.func,
    monthCellContentRender: PropTypes.func,
    renderFooter: PropTypes.func,
  },
  data() {
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return {
      yearPanelReferer: null,
    };
  },
  methods: {
    onMonthSelect(value) {
      this.__emit('panelChange', value, 'date');
      if (getListeners(this).monthSelect) {
        this.__emit('monthSelect', value);
      } else {
        this.__emit('valueChange', value);
      }
    },

    onYearSelect(value) {
      const referer = this.yearPanelReferer;
      this.setState({ yearPanelReferer: null });
      this.__emit('panelChange', value, referer);
      this.__emit('valueChange', value);
    },

    onDecadeSelect(value) {
      this.__emit('panelChange', value, 'year');
      this.__emit('valueChange', value);
    },

    changeYear(direction) {
      if (direction > 0) {
        this.nextYear();
      } else {
        this.previousYear();
      }
    },

    monthYearElement(showTimePicker) {
      const props = this.$props;
      const prefixCls = props.prefixCls;
      const locale = props.locale;
      const value = props.value;
      const localeData = value.localeData();
      const monthBeforeYear = locale.monthBeforeYear;
      const selectClassName = `${prefixCls}-${monthBeforeYear ? 'my-select' : 'ym-select'}`;
      const timeClassName = showTimePicker ? ` ${prefixCls}-time-status` : '';
      const year = (
        <a
          class={`${prefixCls}-year-select${timeClassName}`}
          role="button"
          onClick={showTimePicker ? noop : () => this.showYearPanel('date')}
          title={showTimePicker ? null : locale.yearSelect}
        >
          {value.format(locale.yearFormat)}
        </a>
      );
      const month = (
        <a
          class={`${prefixCls}-month-select${timeClassName}`}
          role="button"
          onClick={showTimePicker ? noop : this.showMonthPanel}
          title={showTimePicker ? null : locale.monthSelect}
        >
          {locale.monthFormat ? value.format(locale.monthFormat) : localeData.monthsShort(value)}
        </a>
      );
      let day;
      if (showTimePicker) {
        day = (
          <a class={`${prefixCls}-day-select${timeClassName}`} role="button">
            {value.format(locale.dayFormat)}
          </a>
        );
      }
      let my = [];
      if (monthBeforeYear) {
        my = [month, day, year];
      } else {
        my = [year, month, day];
      }
      return <span class={selectClassName}>{my}</span>;
    },

    showMonthPanel() {
      // null means that users' interaction doesn't change value
      this.__emit('panelChange', null, 'month');
    },

    showYearPanel(referer) {
      this.setState({ yearPanelReferer: referer });
      this.__emit('panelChange', null, 'year');
    },

    showDecadePanel() {
      this.__emit('panelChange', null, 'decade');
    },
  },

  render() {
    const props = getOptionProps(this);
    const {
      prefixCls,
      locale,
      mode,
      value,
      showTimePicker,
      enableNext,
      enablePrev,
      disabledMonth,
      renderFooter,
    } = props;

    let panel = null;
    if (mode === 'month') {
      panel = (
        <MonthPanel
          locale={locale}
          value={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onMonthSelect}
          onYearPanelShow={() => this.showYearPanel('month')}
          disabledDate={disabledMonth}
          cellRender={props.monthCellRender}
          contentRender={props.monthCellContentRender}
          renderFooter={renderFooter}
          changeYear={this.changeYear}
        />
      );
    }
    if (mode === 'year') {
      panel = (
        <YearPanel
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onYearSelect}
          onDecadePanelShow={this.showDecadePanel}
          renderFooter={renderFooter}
        />
      );
    }
    if (mode === 'decade') {
      panel = (
        <DecadePanel
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onDecadeSelect}
          renderFooter={renderFooter}
        />
      );
    }

    return (
      <div class={`${prefixCls}-header`}>
        <div style={{ position: 'relative' }}>
          {showIf(
            enablePrev && !showTimePicker,
            <a
              class={`${prefixCls}-prev-year-btn`}
              role="button"
              onClick={this.previousYear}
              title={locale.previousYear}
            />,
          )}
          {showIf(
            enablePrev && !showTimePicker,
            <a
              class={`${prefixCls}-prev-month-btn`}
              role="button"
              onClick={this.previousMonth}
              title={locale.previousMonth}
            />,
          )}
          {this.monthYearElement(showTimePicker)}
          {showIf(
            enableNext && !showTimePicker,
            <a
              class={`${prefixCls}-next-month-btn`}
              onClick={this.nextMonth}
              title={locale.nextMonth}
            />,
          )}
          {showIf(
            enableNext && !showTimePicker,
            <a
              class={`${prefixCls}-next-year-btn`}
              onClick={this.nextYear}
              title={locale.nextYear}
            />,
          )}
        </div>
        {panel}
      </div>
    );
  },
};

export default CalendarHeader;
