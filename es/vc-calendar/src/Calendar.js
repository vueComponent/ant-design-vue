import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, hasProp } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import KeyCode from '../../_util/KeyCode';
import * as moment from 'moment';
import DateTable from './date/DateTable';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import CalendarMixin from './mixin/CalendarMixin';
import CommonMixin from './mixin/CommonMixin';
import DateInput from './date/DateInput';
import enUs from './locale/en_US';
import { getTimeConfig, getTodayTime, syncTime } from './util';
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
var MomentType = PropTypes.custom(isMoment);
var Calendar = {
  props: {
    locale: PropTypes.object.def(enUs),
    format: PropTypes.string,
    visible: PropTypes.bool.def(true),
    prefixCls: PropTypes.string.def('rc-calendar'),
    // prefixCls: PropTypes.string,
    defaultValue: MomentType,
    value: MomentType,
    selectedValue: MomentType,
    mode: PropTypes.oneOf(['time', 'date', 'month', 'year', 'decade']),
    // locale: PropTypes.object,
    showDateInput: PropTypes.bool.def(true),
    showWeekNumber: PropTypes.bool,
    showToday: PropTypes.bool.def(true),
    showOk: PropTypes.bool,
    // onSelect: PropTypes.func,
    // onOk: PropTypes.func,
    // onKeyDown: PropTypes.func,
    timePicker: PropTypes.any,
    dateInputPlaceholder: PropTypes.any,
    // onClear: PropTypes.func,
    // onChange: PropTypes.func,
    // onPanelChange: PropTypes.func,
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.any,
    renderFooter: PropTypes.func.def(function () {
      return null;
    }),
    renderSidebar: PropTypes.func.def(function () {
      return null;
    }),
    dateRender: PropTypes.func
  },

  mixins: [BaseMixin, CommonMixin, CalendarMixin],

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
        case KeyCode.DOWN:
          goWeek.call(this, 1);
          event.preventDefault();
          return 1;
        case KeyCode.UP:
          goWeek.call(this, -1);
          event.preventDefault();
          return 1;
        case KeyCode.LEFT:
          if (ctrlKey) {
            goYear.call(this, -1);
          } else {
            goDay.call(this, -1);
          }
          event.preventDefault();
          return 1;
        case KeyCode.RIGHT:
          if (ctrlKey) {
            goYear.call(this, 1);
          } else {
            goDay.call(this, 1);
          }
          event.preventDefault();
          return 1;
        case KeyCode.HOME:
          goStartMonth.call(this);
          event.preventDefault();
          return 1;
        case KeyCode.END:
          goEndMonth.call(this);
          event.preventDefault();
          return 1;
        case KeyCode.PAGE_DOWN:
          goMonth.call(this, 1);
          event.preventDefault();
          return 1;
        case KeyCode.PAGE_UP:
          goMonth.call(this, -1);
          event.preventDefault();
          return 1;
        case KeyCode.ENTER:
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
        var timePickerProps = getOptionProps(timePicker);
        var timePickerDefaultValue = timePickerProps.defaultValue;
        if (timePickerDefaultValue) {
          syncTime(timePickerDefaultValue, value);
        }
      }
      this.onSelect(value);
    },
    onToday: function onToday() {
      var sValue = this.sValue;

      var now = getTodayTime(sValue);
      this.onSelect(now, {
        source: 'todayButton'
      });
    },
    onPanelChange: function onPanelChange(value, mode) {
      var sValue = this.sValue;

      if (!hasProp(this, 'mode')) {
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
    var disabledTimeConfig = showTimePicker && disabledTime && timePicker ? getTimeConfig(sSelectedValue, disabledTime) : null;

    var timePickerEle = null;

    if (timePicker && showTimePicker) {
      var timePickerOriginProps = getOptionProps(timePicker);
      var timePickerProps = {
        props: _extends({
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
      timePickerEle = cloneElement(timePicker, timePickerProps);
    }

    var dateInputElement = showDateInput ? h(DateInput, {
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
        [h(CalendarHeader, {
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
          [h(DateTable, {
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
        ), h(CalendarFooter, {
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

export default Calendar;