'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

var _vnode = require('../../_util/vnode');

var _KeyCode = require('../../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _DateTable = require('./date/DateTable');

var _DateTable2 = _interopRequireDefault(_DateTable);

var _CalendarHeader = require('./calendar/CalendarHeader');

var _CalendarHeader2 = _interopRequireDefault(_CalendarHeader);

var _CalendarFooter = require('./calendar/CalendarFooter');

var _CalendarFooter2 = _interopRequireDefault(_CalendarFooter);

var _CalendarMixin = require('./mixin/CalendarMixin');

var _CalendarMixin2 = _interopRequireDefault(_CalendarMixin);

var _CommonMixin = require('./mixin/CommonMixin');

var _CommonMixin2 = _interopRequireDefault(_CommonMixin);

var _DateInput = require('./date/DateInput');

var _DateInput2 = _interopRequireDefault(_DateInput);

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _util = require('./util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function goStartMonth() {
  var next = this.sValue.clone();
  next.startOf('month');
  this.setValue(next);
}

function goEndMonth() {
  var next = this.sValue.clone();
  next.endOf('month');
  this.setValue(next);
}

function goTime(direction, unit) {
  var next = this.sValue.clone();
  next.add(direction, unit);
  this.setValue(next);
}

function goMonth(direction) {
  return goTime.call(this, direction, 'months');
}

function goYear(direction) {
  return goTime.call(this, direction, 'years');
}

function goWeek(direction) {
  return goTime.call(this, direction, 'weeks');
}

function goDay(direction) {
  return goTime.call(this, direction, 'days');
}

function isMoment(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.findIndex(function (val) {
      return val === undefined || moment.isMoment(val);
    }) !== -1;
  } else {
    return value === undefined || moment.isMoment(value);
  }
}
var MomentType = _vueTypes2['default'].custom(isMoment);
var Calendar = {
  props: {
    locale: _vueTypes2['default'].object.def(_en_US2['default']),
    format: _vueTypes2['default'].string,
    visible: _vueTypes2['default'].bool.def(true),
    prefixCls: _vueTypes2['default'].string.def('rc-calendar'),
    // prefixCls: PropTypes.string,
    defaultValue: MomentType,
    value: MomentType,
    selectedValue: MomentType,
    mode: _vueTypes2['default'].oneOf(['time', 'date', 'month', 'year', 'decade']),
    // locale: PropTypes.object,
    showDateInput: _vueTypes2['default'].bool.def(true),
    showWeekNumber: _vueTypes2['default'].bool,
    showToday: _vueTypes2['default'].bool.def(true),
    showOk: _vueTypes2['default'].bool,
    // onSelect: PropTypes.func,
    // onOk: PropTypes.func,
    // onKeyDown: PropTypes.func,
    timePicker: _vueTypes2['default'].any,
    dateInputPlaceholder: _vueTypes2['default'].any,
    // onClear: PropTypes.func,
    // onChange: PropTypes.func,
    // onPanelChange: PropTypes.func,
    disabledDate: _vueTypes2['default'].func,
    disabledTime: _vueTypes2['default'].any,
    renderFooter: _vueTypes2['default'].func.def(function () {
      return null;
    }),
    renderSidebar: _vueTypes2['default'].func.def(function () {
      return null;
    }),
    dateRender: _vueTypes2['default'].func
  },

  mixins: [_BaseMixin2['default'], _CommonMixin2['default'], _CalendarMixin2['default']],

  data: function data() {
    return {
      sMode: this.mode || 'date'
    };
  },

  watch: {
    mode: function mode(val) {
      this.setState({ sMode: val });
    }
  },
  methods: {
    onKeyDown: function onKeyDown(event) {
      if (event.target.nodeName.toLowerCase() === 'input') {
        return undefined;
      }
      var keyCode = event.keyCode;
      // mac
      var ctrlKey = event.ctrlKey || event.metaKey;
      var disabledDate = this.disabledDate,
          value = this.sValue;

      switch (keyCode) {
        case _KeyCode2['default'].DOWN:
          goWeek.call(this, 1);
          event.preventDefault();
          return 1;
        case _KeyCode2['default'].UP:
          goWeek.call(this, -1);
          event.preventDefault();
          return 1;
        case _KeyCode2['default'].LEFT:
          if (ctrlKey) {
            goYear.call(this, -1);
          } else {
            goDay.call(this, -1);
          }
          event.preventDefault();
          return 1;
        case _KeyCode2['default'].RIGHT:
          if (ctrlKey) {
            goYear.call(this, 1);
          } else {
            goDay.call(this, 1);
          }
          event.preventDefault();
          return 1;
        case _KeyCode2['default'].HOME:
          goStartMonth.call(this);
          event.preventDefault();
          return 1;
        case _KeyCode2['default'].END:
          goEndMonth.call(this);
          event.preventDefault();
          return 1;
        case _KeyCode2['default'].PAGE_DOWN:
          goMonth.call(this, 1);
          event.preventDefault();
          return 1;
        case _KeyCode2['default'].PAGE_UP:
          goMonth.call(this, -1);
          event.preventDefault();
          return 1;
        case _KeyCode2['default'].ENTER:
          if (!disabledDate || !disabledDate(value)) {
            this.onSelect(value, {
              source: 'keyboard'
            });
          }
          event.preventDefault();
          return 1;
        default:
          this.__emit('keydown', event);
          return 1;
      }
    },
    onClear: function onClear() {
      this.onSelect(null);
      this.__emit('clear');
    },
    onOk: function onOk() {
      var sSelectedValue = this.sSelectedValue;

      if (this.isAllowedDate(sSelectedValue)) {
        this.__emit('ok', sSelectedValue);
      }
    },
    onDateInputChange: function onDateInputChange(value) {
      this.onSelect(value, {
        source: 'dateInput'
      });
    },
    onDateTableSelect: function onDateTableSelect(value) {
      var timePicker = this.timePicker,
          sSelectedValue = this.sSelectedValue;

      if (!sSelectedValue && timePicker) {
        var timePickerProps = (0, _propsUtil.getOptionProps)(timePicker);
        var timePickerDefaultValue = timePickerProps.defaultValue;
        if (timePickerDefaultValue) {
          (0, _util.syncTime)(timePickerDefaultValue, value);
        }
      }
      this.onSelect(value);
    },
    onToday: function onToday() {
      var sValue = this.sValue;

      var now = (0, _util.getTodayTime)(sValue);
      this.onSelect(now, {
        source: 'todayButton'
      });
    },
    onPanelChange: function onPanelChange(value, mode) {
      var sValue = this.sValue;

      if (!(0, _propsUtil.hasProp)(this, 'mode')) {
        this.setState({ sMode: mode });
      }
      this.__emit('panelChange', value || sValue, mode);
    },
    getRootDOMNode: function getRootDOMNode() {
      return this.$el;
    },
    openTimePicker: function openTimePicker() {
      this.onPanelChange(null, 'time');
    },
    closeTimePicker: function closeTimePicker() {
      this.onPanelChange(null, 'date');
    }
  },

  render: function render() {
    var h = arguments[0];
    var locale = this.locale,
        prefixCls = this.prefixCls,
        disabledDate = this.disabledDate,
        dateInputPlaceholder = this.dateInputPlaceholder,
        timePicker = this.timePicker,
        disabledTime = this.disabledTime,
        showDateInput = this.showDateInput,
        renderSidebar = this.renderSidebar,
        sValue = this.sValue,
        sSelectedValue = this.sSelectedValue,
        sMode = this.sMode,
        props = this.$props;

    var showTimePicker = sMode === 'time';
    var disabledTimeConfig = showTimePicker && disabledTime && timePicker ? (0, _util.getTimeConfig)(sSelectedValue, disabledTime) : null;

    var timePickerEle = null;

    if (timePicker && showTimePicker) {
      var timePickerOriginProps = (0, _propsUtil.getOptionProps)(timePicker);
      var timePickerProps = {
        props: (0, _extends3['default'])({
          showHour: true,
          showSecond: true,
          showMinute: true
        }, timePickerOriginProps, disabledTimeConfig, {
          value: sSelectedValue,
          disabledTime: disabledTime
        }),
        on: {
          change: this.onDateInputChange
        }
      };

      if (timePickerOriginProps.defaultValue !== undefined) {
        timePickerProps.props.defaultOpenValue = timePickerOriginProps.defaultValue;
      }
      timePickerEle = (0, _vnode.cloneElement)(timePicker, timePickerProps);
    }

    var dateInputElement = showDateInput ? h(_DateInput2['default'], {
      attrs: {
        format: this.getFormat(),

        value: sValue,
        locale: locale,
        placeholder: dateInputPlaceholder,
        showClear: true,
        disabledTime: disabledTime,
        disabledDate: disabledDate,

        prefixCls: prefixCls,
        selectedValue: sSelectedValue
      },
      key: 'date-input', on: {
        'clear': this.onClear,
        'change': this.onDateInputChange
      }
    }) : null;
    var children = [renderSidebar(), h(
      'div',
      { 'class': prefixCls + '-panel', key: 'panel' },
      [dateInputElement, h(
        'div',
        { 'class': prefixCls + '-date-panel' },
        [h(_CalendarHeader2['default'], {
          attrs: {
            locale: locale,
            mode: sMode,
            value: sValue,

            showTimePicker: showTimePicker,
            prefixCls: prefixCls
          },
          on: {
            'valueChange': this.setValue,
            'panelChange': this.onPanelChange
          }
        }), timePicker && showTimePicker ? h(
          'div',
          { 'class': prefixCls + '-time-picker' },
          [h(
            'div',
            { 'class': prefixCls + '-time-picker-panel' },
            [timePickerEle]
          )]
        ) : null, h(
          'div',
          { 'class': prefixCls + '-body' },
          [h(_DateTable2['default'], {
            attrs: {
              locale: locale,
              value: sValue,
              selectedValue: sSelectedValue,
              prefixCls: prefixCls,
              dateRender: props.dateRender,

              disabledDate: disabledDate,
              showWeekNumber: props.showWeekNumber
            },
            on: {
              'select': this.onDateTableSelect
            }
          })]
        ), h(_CalendarFooter2['default'], {
          attrs: {
            showOk: props.showOk,
            renderFooter: props.renderFooter,
            locale: locale,
            prefixCls: prefixCls,
            showToday: props.showToday,
            disabledTime: disabledTime,
            showTimePicker: showTimePicker,
            showDateInput: props.showDateInput,
            timePicker: timePicker,
            selectedValue: sSelectedValue,
            value: sValue,
            disabledDate: disabledDate,
            okDisabled: !this.isAllowedDate(sSelectedValue)
          },
          on: {
            'ok': this.onOk,
            'select': this.onSelect,
            'today': this.onToday,
            'openTimePicker': this.openTimePicker,
            'closeTimePicker': this.closeTimePicker
          }
        })]
      )]
    )];

    return this.renderRoot({
      children: children,
      'class': props.showWeekNumber ? prefixCls + '-week-number' : ''
    });
  }
};

exports['default'] = Calendar;
module.exports = exports['default'];