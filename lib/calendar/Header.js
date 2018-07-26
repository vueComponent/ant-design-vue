'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderProps = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _Constants = require('./Constants');

var _select = require('../select');

var _select2 = _interopRequireDefault(_select);

var _radio = require('../radio');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Option = _select2['default'].Option;

var HeaderProps = exports.HeaderProps = {
  prefixCls: _vueTypes2['default'].string,
  locale: _vueTypes2['default'].any,
  fullscreen: _vueTypes2['default'].boolean,
  yearSelectOffset: _vueTypes2['default'].number,
  yearSelectTotal: _vueTypes2['default'].number,
  type: _vueTypes2['default'].string,
  // onValueChange: PropTypes.(value: moment.Moment) => void,
  // onTypeChange: PropTypes.(type: string) => void,
  value: _vueTypes2['default'].any,
  validRange: _vueTypes2['default'].array
};

exports['default'] = {
  props: (0, _propsUtil.initDefaultProps)(HeaderProps, {
    prefixCls: _Constants.PREFIX_CLS + '-header',
    yearSelectOffset: 10,
    yearSelectTotal: 20
  }),

  // private calenderHeaderNode: HTMLDivElement;
  methods: {
    getYearSelectElement: function getYearSelectElement(year) {
      var _this = this;

      var h = this.$createElement;
      var yearSelectOffset = this.yearSelectOffset,
          yearSelectTotal = this.yearSelectTotal,
          locale = this.locale,
          prefixCls = this.prefixCls,
          fullscreen = this.fullscreen,
          validRange = this.validRange;

      var start = year - yearSelectOffset;
      var end = start + yearSelectTotal;
      if (validRange) {
        start = validRange[0].get('year');
        end = validRange[1].get('year') + 1;
      }
      var suffix = locale.year === '年' ? '年' : '';

      var options = [];
      for (var index = start; index <= end; index++) {
        options.push(h(
          Option,
          { key: '' + index },
          [index + suffix]
        ));
      }
      return h(
        _select2['default'],
        {
          attrs: {
            size: fullscreen ? 'default' : 'small',
            dropdownMatchSelectWidth: false,

            value: String(year),
            getPopupContainer: function getPopupContainer() {
              return _this.getCalenderHeaderNode();
            }
          },
          'class': prefixCls + '-year-select',
          on: {
            'change': this.onYearChange
          }
        },
        [options]
      );
    },
    getMonthsLocale: function getMonthsLocale(value) {
      var current = value.clone();
      var localeData = value.localeData();
      var months = [];
      for (var i = 0; i < 12; i++) {
        current.month(i);
        months.push(localeData.monthsShort(current));
      }
      return months;
    },
    getMonthSelectElement: function getMonthSelectElement(month, months) {
      var _this2 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          fullscreen = this.fullscreen,
          validRange = this.validRange,
          value = this.value;

      var options = [];
      var start = 0;
      var end = 12;
      if (validRange) {
        var _validRange = (0, _slicedToArray3['default'])(validRange, 2),
            rangeStart = _validRange[0],
            rangeEnd = _validRange[1];

        var currentYear = value.get('year');
        if (rangeEnd.get('year') === currentYear) {
          end = rangeEnd.get('month') + 1;
        } else {
          start = rangeStart.get('month');
        }
      }
      for (var index = start; index < end; index++) {
        options.push(h(
          Option,
          { key: '' + index },
          [months[index]]
        ));
      }

      return h(
        _select2['default'],
        {
          attrs: {
            size: fullscreen ? 'default' : 'small',
            dropdownMatchSelectWidth: false,

            value: String(month),

            getPopupContainer: function getPopupContainer() {
              return _this2.getCalenderHeaderNode();
            }
          },
          'class': prefixCls + '-month-select', on: {
            'change': this.onMonthChange
          }
        },
        [options]
      );
    },
    onYearChange: function onYearChange(year) {
      var value = this.value,
          validRange = this.validRange;

      var newValue = value.clone();
      newValue.year(parseInt(year, 10));
      // switch the month so that it remains within range when year changes
      if (validRange) {
        var _validRange2 = (0, _slicedToArray3['default'])(validRange, 2),
            start = _validRange2[0],
            end = _validRange2[1];

        var newYear = newValue.get('year');
        var newMonth = newValue.get('month');
        if (newYear === end.get('year') && newMonth > end.get('month')) {
          newValue.month(end.get('month'));
        }
        if (newYear === start.get('year') && newMonth < start.get('month')) {
          newValue.month(start.get('month'));
        }
      }
      this.$emit('valueChange', newValue);
    },
    onMonthChange: function onMonthChange(month) {
      var newValue = this.value.clone();
      newValue.month(parseInt(month, 10));
      this.$emit('valueChange', newValue);
    },
    onTypeChange: function onTypeChange(e) {
      this.$emit('typeChange', e.target.value);
    },
    getCalenderHeaderNode: function getCalenderHeaderNode() {
      return this.$refs.calenderHeaderNode;
    }
  },

  render: function render() {
    var h = arguments[0];
    var type = this.type,
        value = this.value,
        prefixCls = this.prefixCls,
        locale = this.locale,
        fullscreen = this.fullscreen;

    var yearSelect = this.getYearSelectElement(value.year());
    var monthSelect = type === 'date' ? this.getMonthSelectElement(value.month(), this.getMonthsLocale(value)) : null;
    var size = fullscreen ? 'default' : 'small';
    var typeSwitch = h(
      _radio.Group,
      {
        on: {
          'change': this.onTypeChange
        },
        attrs: { value: type, size: size }
      },
      [h(
        _radio.Button,
        {
          attrs: { value: 'date' }
        },
        [locale.month]
      ), h(
        _radio.Button,
        {
          attrs: { value: 'month' }
        },
        [locale.year]
      )]
    );

    return h(
      'div',
      { 'class': prefixCls + '-header', ref: 'calenderHeaderNode' },
      [yearSelect, monthSelect, typeSwitch]
    );
  }
};