
import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getMonthName } from '../util';

var CalendarHeader = {
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
    headerComponents: PropTypes.array
  },
  methods: {
    onYearChange: function onYearChange(year) {
      var newValue = this.value.clone();
      newValue.year(parseInt(year, 10));
      this.__emit('valueChange', newValue);
    },
    onMonthChange: function onMonthChange(month) {
      var newValue = this.value.clone();
      newValue.month(parseInt(month, 10));
      this.__emit('valueChange', newValue);
    },
    yearSelectElement: function yearSelectElement(year) {
      var h = this.$createElement;
      var yearSelectOffset = this.yearSelectOffset,
          yearSelectTotal = this.yearSelectTotal,
          prefixCls = this.prefixCls,
          Select = this.Select;

      var start = year - yearSelectOffset;
      var end = start + yearSelectTotal;

      var options = [];
      for (var index = start; index < end; index++) {
        options.push(h(
          Select.Option,
          { key: '' + index },
          [index]
        ));
      }
      return h(
        Select,
        {
          'class': prefixCls + '-header-year-select',
          on: {
            'change': this.onYearChange
          },
          attrs: {
            dropdownStyle: { zIndex: 2000 },
            dropdownMenuStyle: { maxHeight: '250px', overflow: 'auto', fontSize: '12px' },
            optionLabelProp: 'children',
            value: String(year),
            showSearch: false
          }
        },
        [options]
      );
    },
    monthSelectElement: function monthSelectElement(month) {
      var h = this.$createElement;
      var value = this.value,
          Select = this.Select,
          prefixCls = this.prefixCls;

      var t = value.clone();
      var options = [];

      for (var index = 0; index < 12; index++) {
        t.month(index);
        options.push(h(
          Select.Option,
          { key: '' + index },
          [getMonthName(t)]
        ));
      }

      return h(
        Select,
        {
          'class': prefixCls + '-header-month-select',
          attrs: { dropdownStyle: { zIndex: 2000 },
            dropdownMenuStyle: { maxHeight: '250px', overflow: 'auto', overflowX: 'hidden', fontSize: '12px' },
            optionLabelProp: 'children',
            value: String(month),
            showSearch: false
          },
          on: {
            'change': this.onMonthChange
          }
        },
        [options]
      );
    },
    changeTypeToDate: function changeTypeToDate() {
      this.__emit('typeChange', 'date');
    },
    changeTypeToMonth: function changeTypeToMonth() {
      this.__emit('typeChange', 'month');
    }
  },

  render: function render() {
    var h = arguments[0];
    var value = this.value,
        locale = this.locale,
        prefixCls = this.prefixCls,
        type = this.type,
        showTypeSwitch = this.showTypeSwitch,
        headerComponents = this.headerComponents;

    var year = value.year();
    var month = value.month();
    var yearSelect = this.yearSelectElement(year);
    var monthSelect = type === 'month' ? null : this.monthSelectElement(month);
    var switchCls = prefixCls + '-header-switcher';
    var typeSwitcher = showTypeSwitch ? h(
      'span',
      { 'class': switchCls },
      [type === 'date' ? h(
        'span',
        { 'class': switchCls + '-focus' },
        [locale.month]
      ) : h(
        'span',
        {
          on: {
            'click': this.changeTypeToDate
          },

          'class': switchCls + '-normal'
        },
        [locale.month]
      ), type === 'month' ? h(
        'span',
        { 'class': switchCls + '-focus' },
        [locale.year]
      ) : h(
        'span',
        {
          on: {
            'click': this.changeTypeToMonth
          },

          'class': switchCls + '-normal'
        },
        [locale.year]
      )]
    ) : null;

    return h(
      'div',
      { 'class': prefixCls + '-header' },
      [typeSwitcher, monthSelect, yearSelect, headerComponents]
    );
  }
};

export default CalendarHeader;