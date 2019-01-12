import { PREFIX_CLS } from './Constants';
import Select from '../select';
import { Group, Button } from '../radio';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
const Option = Select.Option;

export const HeaderProps = {
  prefixCls: PropTypes.string,
  locale: PropTypes.any,
  fullscreen: PropTypes.boolean,
  yearSelectOffset: PropTypes.number,
  yearSelectTotal: PropTypes.number,
  type: PropTypes.string,
  // onValueChange: PropTypes.(value: moment.Moment) => void,
  // onTypeChange: PropTypes.(type: string) => void,
  value: PropTypes.any,
  validRange: PropTypes.array,
};

export default {
  props: initDefaultProps(HeaderProps, {
    prefixCls: `${PREFIX_CLS}-header`,
    yearSelectOffset: 10,
    yearSelectTotal: 20,
  }),

  // private calenderHeaderNode: HTMLDivElement;
  methods: {
    getYearSelectElement(year) {
      const { yearSelectOffset, yearSelectTotal, locale, prefixCls, fullscreen, validRange } = this;
      let start = year - yearSelectOffset;
      let end = start + yearSelectTotal;
      if (validRange) {
        start = validRange[0].get('year');
        end = validRange[1].get('year') + 1;
      }
      const suffix = locale.year === '年' ? '年' : '';

      const options = [];
      for (let index = start; index < end; index++) {
        options.push(<Option key={`${index}`}>{index + suffix}</Option>);
      }
      return (
        <Select
          size={fullscreen ? 'default' : 'small'}
          dropdownMatchSelectWidth={false}
          class={`${prefixCls}-year-select`}
          onChange={this.onYearChange}
          value={String(year)}
          getPopupContainer={() => this.getCalenderHeaderNode()}
        >
          {options}
        </Select>
      );
    },

    getMonthsLocale(value) {
      const current = value.clone();
      const localeData = value.localeData();
      const months = [];
      for (let i = 0; i < 12; i++) {
        current.month(i);
        months.push(localeData.monthsShort(current));
      }
      return months;
    },

    getMonthSelectElement(month, months) {
      const { prefixCls, fullscreen, validRange, value } = this;
      const options = [];
      let start = 0;
      let end = 12;
      if (validRange) {
        const [rangeStart, rangeEnd] = validRange;
        const currentYear = value.get('year');
        if (rangeEnd.get('year') === currentYear) {
          end = rangeEnd.get('month') + 1;
        } else if (rangeStart.get('year') === currentYear) {
          start = rangeStart.get('month');
        }
      }
      for (let index = start; index < end; index++) {
        options.push(<Option key={`${index}`}>{months[index]}</Option>);
      }

      return (
        <Select
          size={fullscreen ? 'default' : 'small'}
          dropdownMatchSelectWidth={false}
          class={`${prefixCls}-month-select`}
          value={String(month)}
          onChange={this.onMonthChange}
          getPopupContainer={() => this.getCalenderHeaderNode()}
        >
          {options}
        </Select>
      );
    },

    onYearChange(year) {
      const { value, validRange } = this;
      const newValue = value.clone();
      newValue.year(parseInt(year, 10));
      // switch the month so that it remains within range when year changes
      if (validRange) {
        const [start, end] = validRange;
        const newYear = newValue.get('year');
        const newMonth = newValue.get('month');
        if (newYear === end.get('year') && newMonth > end.get('month')) {
          newValue.month(end.get('month'));
        }
        if (newYear === start.get('year') && newMonth < start.get('month')) {
          newValue.month(start.get('month'));
        }
      }
      this.$emit('valueChange', newValue);
    },

    onMonthChange(month) {
      const newValue = this.value.clone();
      newValue.month(parseInt(month, 10));
      this.$emit('valueChange', newValue);
    },

    onTypeChange(e) {
      this.$emit('typeChange', e.target.value);
    },

    getCalenderHeaderNode() {
      return this.$refs.calenderHeaderNode;
    },
  },

  render() {
    const { type, value, prefixCls, locale, fullscreen } = this;
    const yearSelect = this.getYearSelectElement(value.year());
    const monthSelect =
      type === 'date'
        ? this.getMonthSelectElement(value.month(), this.getMonthsLocale(value))
        : null;
    const size = fullscreen ? 'default' : 'small';
    const typeSwitch = (
      <Group onChange={this.onTypeChange} value={type} size={size}>
        <Button value="date">{locale.month}</Button>
        <Button value="month">{locale.year}</Button>
      </Group>
    );

    return (
      <div class={`${prefixCls}-header`} ref="calenderHeaderNode">
        {yearSelect}
        {monthSelect}
        {typeSwitch}
      </div>
    );
  },
};
