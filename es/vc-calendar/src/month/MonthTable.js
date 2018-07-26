import _defineProperty from 'babel-runtime/helpers/defineProperty';

import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getTodayTime, getMonthName } from '../util/index';

var ROW = 4;
var COL = 3;

function chooseMonth(month) {
  var next = this.sValue.clone();
  next.month(month);
  this.setAndSelectValue(next);
}

function noop() {}

var MonthTable = {
  mixins: [BaseMixin],
  props: {
    cellRender: PropTypes.func,
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    locale: PropTypes.any,
    contentRender: PropTypes.any,
    disabledDate: PropTypes.func
  },
  data: function data() {
    return {
      sValue: this.value
    };
  },

  watch: {
    value: function value(val) {
      this.setState({
        sValue: val
      });
    }
  },
  methods: {
    setAndSelectValue: function setAndSelectValue(value) {
      this.setState({
        sValue: value
      });
      this.__emit('select', value);
    },
    months: function months() {
      var value = this.sValue;
      var current = value.clone();
      var months = [];
      var index = 0;
      for (var rowIndex = 0; rowIndex < ROW; rowIndex++) {
        months[rowIndex] = [];
        for (var colIndex = 0; colIndex < COL; colIndex++) {
          current.month(index);
          var content = getMonthName(current);
          months[rowIndex][colIndex] = {
            value: index,
            content: content,
            title: content
          };
          index++;
        }
      }
      return months;
    }
  },

  render: function render() {
    var _this = this;

    var h = arguments[0];

    var props = this.$props;
    var value = this.sValue;
    var today = getTodayTime(value);
    var months = this.months();
    var currentMonth = value.month();
    var prefixCls = props.prefixCls,
        locale = props.locale,
        contentRender = props.contentRender,
        cellRender = props.cellRender,
        disabledDate = props.disabledDate;

    var monthsEls = months.map(function (month, index) {
      var tds = month.map(function (monthData) {
        var _classNameMap;

        var disabled = false;
        if (disabledDate) {
          var testValue = value.clone();
          testValue.month(monthData.value);
          disabled = disabledDate(testValue);
        }
        var classNameMap = (_classNameMap = {}, _defineProperty(_classNameMap, prefixCls + '-cell', 1), _defineProperty(_classNameMap, prefixCls + '-cell-disabled', disabled), _defineProperty(_classNameMap, prefixCls + '-selected-cell', monthData.value === currentMonth), _defineProperty(_classNameMap, prefixCls + '-current-cell', today.year() === value.year() && monthData.value === today.month()), _classNameMap);
        var cellEl = void 0;
        if (cellRender) {
          var currentValue = value.clone();
          currentValue.month(monthData.value);
          cellEl = cellRender(currentValue, locale);
        } else {
          var content = void 0;
          if (contentRender) {
            var _currentValue = value.clone();
            _currentValue.month(monthData.value);
            content = contentRender(_currentValue, locale);
          } else {
            content = monthData.content;
          }
          cellEl = h(
            'a',
            { 'class': prefixCls + '-month' },
            [content]
          );
        }
        return h(
          'td',
          {
            attrs: {
              role: 'gridcell',

              title: monthData.title
            },
            key: monthData.value,
            on: {
              'click': disabled ? noop : chooseMonth.bind(_this, monthData.value)
            },
            'class': classNameMap
          },
          [cellEl]
        );
      });
      return h(
        'tr',
        { key: index, attrs: { role: 'row' }
        },
        [tds]
      );
    });

    return h(
      'table',
      { 'class': prefixCls + '-table', attrs: { cellSpacing: '0', role: 'grid' }
      },
      [h(
        'tbody',
        { 'class': prefixCls + '-tbody' },
        [monthsEls]
      )]
    );
  }
};

export default MonthTable;