import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getMonthName } from '../util';

const CalendarHeader = {
  mixins: [BaseMixin],
  props: {
    value: PropTypes.object,
    locale: PropTypes.object,
    yearSelectOffset: PropTypes.number.def(10),
    yearSelectTotal: PropTypes.number.def(20),
    // onValueChange: PropTypes.func,
    // onTypeChange: PropTypes.func,
    Select: PropTypes.object,
    prefixCls: PropTypes.string,
    type: PropTypes.string,
    showTypeSwitch: PropTypes.bool,
    headerComponents: PropTypes.array,
  },
  methods: {
    onYearChange(year) {
      const newValue = this.value.clone();
      newValue.year(parseInt(year, 10));
      this.__emit('valueChange', newValue);
    },

    onMonthChange(month) {
      const newValue = this.value.clone();
      newValue.month(parseInt(month, 10));
      this.__emit('valueChange', newValue);
    },

    yearSelectElement(year) {
      const { yearSelectOffset, yearSelectTotal, prefixCls, Select } = this;
      const start = year - yearSelectOffset;
      const end = start + yearSelectTotal;

      const options = [];
      for (let index = start; index < end; index++) {
        options.push(<Select.Option key={`${index}`}>{index}</Select.Option>);
      }
      return (
        <Select
          class={`${prefixCls}-header-year-select`}
          onChange={this.onYearChange}
          dropdownStyle={{ zIndex: 2000 }}
          dropdownMenuStyle={{ maxHeight: '250px', overflow: 'auto', fontSize: '12px' }}
          optionLabelProp="children"
          value={String(year)}
          showSearch={false}
        >
          {options}
        </Select>
      );
    },

    monthSelectElement(month) {
      const { value, Select, prefixCls } = this;
      const t = value.clone();
      const options = [];

      for (let index = 0; index < 12; index++) {
        t.month(index);
        options.push(<Select.Option key={`${index}`}>{getMonthName(t)}</Select.Option>);
      }

      return (
        <Select
          class={`${prefixCls}-header-month-select`}
          dropdownStyle={{ zIndex: 2000 }}
          dropdownMenuStyle={{
            maxHeight: '250px',
            overflow: 'auto',
            overflowX: 'hidden',
            fontSize: '12px',
          }}
          optionLabelProp="children"
          value={String(month)}
          showSearch={false}
          onChange={this.onMonthChange}
        >
          {options}
        </Select>
      );
    },

    changeTypeToDate() {
      this.__emit('typeChange', 'date');
    },

    changeTypeToMonth() {
      this.__emit('typeChange', 'month');
    },
  },

  render() {
    const { value, locale, prefixCls, type, showTypeSwitch, headerComponents } = this;
    const year = value.year();
    const month = value.month();
    const yearSelect = this.yearSelectElement(year);
    const monthSelect = type === 'month' ? null : this.monthSelectElement(month);
    const switchCls = `${prefixCls}-header-switcher`;
    const typeSwitcher = showTypeSwitch ? (
      <span class={switchCls}>
        {type === 'date' ? (
          <span class={`${switchCls}-focus`}>{locale.month}</span>
        ) : (
          <span onClick={this.changeTypeToDate} class={`${switchCls}-normal`}>
            {locale.month}
          </span>
        )}
        {type === 'month' ? (
          <span class={`${switchCls}-focus`}>{locale.year}</span>
        ) : (
          <span onClick={this.changeTypeToMonth} class={`${switchCls}-normal`}>
            {locale.year}
          </span>
        )}
      </span>
    ) : null;

    return (
      <div class={`${prefixCls}-header`}>
        {typeSwitcher}
        {monthSelect}
        {yearSelect}
        {headerComponents}
      </div>
    );
  },
};

export default CalendarHeader;
