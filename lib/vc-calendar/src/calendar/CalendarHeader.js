'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../../_util/props-util');

var _MonthPanel = require('../month/MonthPanel');

var _MonthPanel2 = _interopRequireDefault(_MonthPanel);

var _YearPanel = require('../year/YearPanel');

var _YearPanel2 = _interopRequireDefault(_YearPanel);

var _DecadePanel = require('../decade/DecadePanel');

var _DecadePanel2 = _interopRequireDefault(_DecadePanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
function goMonth(direction) {
  var next = this.value.clone();
  next.add(direction, 'months');
  this.__emit('valueChange', next);
}

function goYear(direction) {
  var next = this.value.clone();
  next.add(direction, 'years');
  this.__emit('valueChange', next);
}

function showIf(condition, el) {
  return condition ? el : null;
}

var CalendarHeader = {
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string,
    value: _vueTypes2['default'].object,
    // onValueChange: PropTypes.func,
    showTimePicker: _vueTypes2['default'].bool,
    // onPanelChange: PropTypes.func,
    locale: _vueTypes2['default'].object,
    enablePrev: _vueTypes2['default'].any.def(1),
    enableNext: _vueTypes2['default'].any.def(1),
    disabledMonth: _vueTypes2['default'].func,
    mode: _vueTypes2['default'].any,
    monthCellRender: _vueTypes2['default'].func,
    monthCellContentRender: _vueTypes2['default'].func
  },
  data: function data() {
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return {
      yearPanelReferer: null
    };
  },

  methods: {
    onMonthSelect: function onMonthSelect(value) {
      this.__emit('panelChange', value, 'date');
      if (this.$listeners.monthSelect) {
        this.__emit('monthSelect', value);
      } else {
        this.__emit('valueChange', value);
      }
    },
    onYearSelect: function onYearSelect(value) {
      var referer = this.yearPanelReferer;
      this.setState({ yearPanelReferer: null });
      this.__emit('panelChange', value, referer);
      this.__emit('valueChange', value);
    },
    onDecadeSelect: function onDecadeSelect(value) {
      this.__emit('panelChange', value, 'year');
      this.__emit('valueChange', value);
    },
    monthYearElement: function monthYearElement(showTimePicker) {
      var _this = this;

      var h = this.$createElement;

      var props = this.$props;
      var prefixCls = props.prefixCls;
      var locale = props.locale;
      var value = props.value;
      var localeData = value.localeData();
      var monthBeforeYear = locale.monthBeforeYear;
      var selectClassName = prefixCls + '-' + (monthBeforeYear ? 'my-select' : 'ym-select');
      var year = h(
        'a',
        {
          'class': prefixCls + '-year-select',
          attrs: { role: 'button',

            title: locale.yearSelect
          },
          on: {
            'click': showTimePicker ? noop : function () {
              return _this.showYearPanel('date');
            }
          }
        },
        [value.format(locale.yearFormat)]
      );
      var month = h(
        'a',
        {
          'class': prefixCls + '-month-select',
          attrs: { role: 'button',

            title: locale.monthSelect
          },
          on: {
            'click': showTimePicker ? noop : this.showMonthPanel
          }
        },
        [locale.monthFormat ? value.format(locale.monthFormat) : localeData.monthsShort(value)]
      );
      var day = void 0;
      if (showTimePicker) {
        day = h(
          'a',
          {
            'class': prefixCls + '-day-select',
            attrs: { role: 'button'
            }
          },
          [value.format(locale.dayFormat)]
        );
      }
      var my = [];
      if (monthBeforeYear) {
        my = [month, day, year];
      } else {
        my = [year, month, day];
      }
      return h(
        'span',
        { 'class': selectClassName },
        [my]
      );
    },
    showMonthPanel: function showMonthPanel() {
      // null means that users' interaction doesn't change value
      this.__emit('panelChange', null, 'month');
    },
    showYearPanel: function showYearPanel(referer) {
      this.setState({ yearPanelReferer: referer });
      this.__emit('panelChange', null, 'year');
    },
    showDecadePanel: function showDecadePanel() {
      this.__emit('panelChange', null, 'decade');
    }
  },

  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var prefixCls = props.prefixCls,
        locale = props.locale,
        mode = props.mode,
        value = props.value,
        showTimePicker = props.showTimePicker,
        enableNext = props.enableNext,
        enablePrev = props.enablePrev,
        disabledMonth = props.disabledMonth;


    var panel = null;
    if (mode === 'month') {
      panel = h(_MonthPanel2['default'], {
        attrs: {
          locale: locale,
          defaultValue: value,
          rootPrefixCls: prefixCls,

          disabledDate: disabledMonth,
          cellRender: props.monthCellRender,
          contentRender: props.monthCellContentRender
        },
        on: {
          'select': this.onMonthSelect,
          'yearPanelShow': function yearPanelShow() {
            return _this2.showYearPanel('month');
          }
        }
      });
    }
    if (mode === 'year') {
      panel = h(_YearPanel2['default'], {
        attrs: {
          locale: locale,
          defaultValue: value,
          rootPrefixCls: prefixCls
        },
        on: {
          'select': this.onYearSelect,
          'decadePanelShow': this.showDecadePanel
        }
      });
    }
    if (mode === 'decade') {
      panel = h(_DecadePanel2['default'], {
        attrs: {
          locale: locale,
          defaultValue: value,
          rootPrefixCls: prefixCls
        },
        on: {
          'select': this.onDecadeSelect
        }
      });
    }

    return h(
      'div',
      { 'class': prefixCls + '-header' },
      [h(
        'div',
        { style: { position: 'relative' } },
        [showIf(enablePrev && !showTimePicker, h('a', {
          'class': prefixCls + '-prev-year-btn',
          attrs: { role: 'button',

            title: locale.previousYear
          },
          on: {
            'click': this.previousYear
          }
        })), showIf(enablePrev && !showTimePicker, h('a', {
          'class': prefixCls + '-prev-month-btn',
          attrs: { role: 'button',

            title: locale.previousMonth
          },
          on: {
            'click': this.previousMonth
          }
        })), this.monthYearElement(showTimePicker), showIf(enableNext && !showTimePicker, h('a', {
          'class': prefixCls + '-next-month-btn',
          on: {
            'click': this.nextMonth
          },
          attrs: {
            title: locale.nextMonth
          }
        })), showIf(enableNext && !showTimePicker, h('a', {
          'class': prefixCls + '-next-year-btn',
          on: {
            'click': this.nextYear
          },
          attrs: {
            title: locale.nextYear
          }
        }))]
      ), panel]
    );
  }
};

exports['default'] = CalendarHeader;
module.exports = exports['default'];