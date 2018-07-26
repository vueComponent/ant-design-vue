import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';

import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, hasProp, mergeProps } from '../../_util/props-util';
import moment from 'moment';
import CalendarPart from './range-calendar/CalendarPart';
import TodayButton from './calendar/TodayButton';
import OkButton from './calendar/OkButton';
import TimePickerButton from './calendar/TimePickerButton';
import CommonMixin from './mixin/CommonMixin';
import enUs from './locale/en_US';
import { syncTime, getTodayTime, isAllowedDate } from './util/';

function noop() {}

function isEmptyArray(arr) {
  return Array.isArray(arr) && (arr.length === 0 || arr.every(function (i) {
    return !i;
  }));
}

function isArraysEqual(a, b) {
  if (a === b) return true;
  if (a === null || typeof a === 'undefined' || b === null || typeof b === 'undefined') {
    return false;
  }
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function getValueFromSelectedValue(selectedValue) {
  var _selectedValue = _slicedToArray(selectedValue, 2),
      start = _selectedValue[0],
      end = _selectedValue[1];

  var newEnd = end && end.isSame(start, 'month') ? end.clone().add(1, 'month') : end;
  return [start, newEnd];
}

function normalizeAnchor(props, init) {
  var selectedValue = props.selectedValue || init && props.defaultSelectedValue;
  var value = props.value || init && props.defaultValue;
  var normalizedValue = value ? getValueFromSelectedValue(value) : getValueFromSelectedValue(selectedValue);
  return !isEmptyArray(normalizedValue) ? normalizedValue : init && [moment(), moment().add(1, 'months')];
}

function generateOptions(length, extraOptionGen) {
  var arr = extraOptionGen ? extraOptionGen().concat() : [];
  for (var value = 0; value < length; value++) {
    if (arr.indexOf(value) === -1) {
      arr.push(value);
    }
  }
  return arr;
}

function onInputSelect(direction, value) {
  if (!value) {
    return;
  }
  var originalValue = this.sSelectedValue;
  var selectedValue = originalValue.concat();
  var index = direction === 'left' ? 0 : 1;
  selectedValue[index] = value;
  if (selectedValue[0] && this.compare(selectedValue[0], selectedValue[1]) > 0) {
    selectedValue[1 - index] = this.showTimePicker ? selectedValue[index] : undefined;
  }
  this.__emit('inputSelect', selectedValue);
  this.fireSelectValueChange(selectedValue);
}

var RangeCalendar = {
  props: {
    locale: PropTypes.object.def(enUs),
    visible: PropTypes.bool.def(true),
    prefixCls: PropTypes.string.def('rc-calendar'),
    dateInputPlaceholder: PropTypes.any,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    hoverValue: PropTypes.any,
    mode: PropTypes.arrayOf(PropTypes.oneOf(['date', 'month', 'year', 'decade'])),
    showDateInput: PropTypes.bool.def(true),
    timePicker: PropTypes.any,
    showOk: PropTypes.bool,
    showToday: PropTypes.bool.def(true),
    defaultSelectedValue: PropTypes.array.def([]),
    selectedValue: PropTypes.array,
    showClear: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
    // locale: PropTypes.object,
    // onChange: PropTypes.func,
    // onSelect: PropTypes.func,
    // onValueChange: PropTypes.func,
    // onHoverChange: PropTypes.func,
    // onPanelChange: PropTypes.func,
    format: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    // onClear: PropTypes.func,
    type: PropTypes.any.def('both'),
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.func.def(noop),
    renderFooter: PropTypes.func.def(function () {
      return null;
    }),
    renderSidebar: PropTypes.func.def(function () {
      return null;
    }),
    dateRender: PropTypes.func
  },

  mixins: [BaseMixin, CommonMixin],

  data: function data() {
    var props = this.$props;
    var selectedValue = props.selectedValue || props.defaultSelectedValue;
    var value = normalizeAnchor(props, 1);
    return {
      sSelectedValue: selectedValue,
      prevSelectedValue: selectedValue,
      firstSelectedValue: null,
      sHoverValue: props.hoverValue || [],
      sValue: value,
      showTimePicker: false,
      sMode: props.mode || ['date', 'date']
    };
  },

  watch: {
    value: function value(val) {
      var newState = {};
      newState.sValue = normalizeAnchor(this.$props, 0);
      this.setState(newState);
    },
    hoverValue: function hoverValue(val) {
      if (!isArraysEqual(this.sHoverValue, val)) {
        this.setState({ sHoverValue: val });
      }
    },
    selectedValue: function selectedValue(val) {
      var newState = {};
      newState.sSelectedValue = val;
      newState.prevSelectedValue = val;
      this.setState(newState);
    },
    mode: function mode(val) {
      if (!isArraysEqual(this.sMode, val)) {
        this.setState({ sMode: val });
      }
    }
  },

  methods: {
    onDatePanelEnter: function onDatePanelEnter() {
      if (this.hasSelectedValue()) {
        this.fireHoverValueChange(this.sSelectedValue.concat());
      }
    },
    onDatePanelLeave: function onDatePanelLeave() {
      if (this.hasSelectedValue()) {
        this.fireHoverValueChange([]);
      }
    },
    onSelect: function onSelect(value) {
      var type = this.type,
          sSelectedValue = this.sSelectedValue,
          prevSelectedValue = this.prevSelectedValue,
          firstSelectedValue = this.firstSelectedValue;

      var nextSelectedValue = void 0;
      if (type === 'both') {
        if (!firstSelectedValue) {
          syncTime(prevSelectedValue[0], value);
          nextSelectedValue = [value];
        } else if (this.compare(firstSelectedValue, value) < 0) {
          syncTime(prevSelectedValue[1], value);
          nextSelectedValue = [firstSelectedValue, value];
        } else {
          syncTime(prevSelectedValue[0], value);
          syncTime(prevSelectedValue[1], firstSelectedValue);
          nextSelectedValue = [value, firstSelectedValue];
        }
      } else if (type === 'start') {
        syncTime(prevSelectedValue[0], value);
        var endValue = sSelectedValue[1];
        nextSelectedValue = endValue && this.compare(endValue, value) > 0 ? [value, endValue] : [value];
      } else {
        // type === 'end'
        var startValue = sSelectedValue[0];
        if (startValue && this.compare(startValue, value) <= 0) {
          syncTime(prevSelectedValue[1], value);
          nextSelectedValue = [startValue, value];
        } else {
          syncTime(prevSelectedValue[0], value);
          nextSelectedValue = [value];
        }
      }

      this.fireSelectValueChange(nextSelectedValue);
    },
    onDayHover: function onDayHover(value) {
      var hoverValue = [];
      var sSelectedValue = this.sSelectedValue,
          firstSelectedValue = this.firstSelectedValue,
          type = this.type;

      if (type === 'start' && sSelectedValue[1]) {
        hoverValue = this.compare(value, sSelectedValue[1]) < 0 ? [value, sSelectedValue[1]] : [value];
      } else if (type === 'end' && sSelectedValue[0]) {
        hoverValue = this.compare(value, sSelectedValue[0]) > 0 ? [sSelectedValue[0], value] : [];
      } else {
        if (!firstSelectedValue) {
          return;
        }
        hoverValue = this.compare(value, firstSelectedValue) < 0 ? [value, firstSelectedValue] : [firstSelectedValue, value];
      }
      this.fireHoverValueChange(hoverValue);
    },
    onToday: function onToday() {
      var startValue = getTodayTime(this.sValue[0]);
      var endValue = startValue.clone().add(1, 'months');
      this.setState({ sValue: [startValue, endValue] });
    },
    onOpenTimePicker: function onOpenTimePicker() {
      this.setState({
        showTimePicker: true
      });
    },
    onCloseTimePicker: function onCloseTimePicker() {
      this.setState({
        showTimePicker: false
      });
    },
    onOk: function onOk() {
      var sSelectedValue = this.sSelectedValue;

      if (this.isAllowedDateAndTime(sSelectedValue)) {
        this.__emit('ok', sSelectedValue);
      }
    },
    onStartInputSelect: function onStartInputSelect() {
      for (var _len = arguments.length, oargs = Array(_len), _key = 0; _key < _len; _key++) {
        oargs[_key] = arguments[_key];
      }

      var args = ['left'].concat(oargs);
      return onInputSelect.apply(this, args);
    },
    onEndInputSelect: function onEndInputSelect() {
      for (var _len2 = arguments.length, oargs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        oargs[_key2] = arguments[_key2];
      }

      var args = ['right'].concat(oargs);
      return onInputSelect.apply(this, args);
    },
    onStartValueChange: function onStartValueChange(leftValue) {
      var value = [].concat(_toConsumableArray(this.sValue));
      value[0] = leftValue;
      return this.fireValueChange(value);
    },
    onEndValueChange: function onEndValueChange(rightValue) {
      var value = [].concat(_toConsumableArray(this.sValue));
      value[1] = rightValue;
      return this.fireValueChange(value);
    },
    onStartPanelChange: function onStartPanelChange(value, mode) {
      var sMode = this.sMode,
          sValue = this.sValue;

      var newMode = [mode, sMode[1]];
      var newValue = [value || sValue[0], sValue[1]];
      this.__emit('panelChange', newValue, newMode);
      if (!hasProp(this, 'mode')) {
        this.setState({
          sMode: newMode
        });
      }
    },
    onEndPanelChange: function onEndPanelChange(value, mode) {
      var sMode = this.sMode,
          sValue = this.sValue;

      var newMode = [sMode[0], mode];
      var newValue = [sValue[0], value || sValue[1]];
      this.__emit('panelChange', newValue, newMode);
      if (!hasProp(this, 'mode')) {
        this.setState({
          sMode: newMode
        });
      }
    },
    getStartValue: function getStartValue() {
      var value = this.sValue[0];
      var selectedValue = this.sSelectedValue;
      // keep selectedTime when select date
      if (selectedValue[0] && this.timePicker) {
        value = value.clone();
        syncTime(selectedValue[0], value);
      }
      if (this.showTimePicker && selectedValue[0]) {
        return selectedValue[0];
      }
      return value;
    },
    getEndValue: function getEndValue() {
      var sValue = this.sValue,
          sSelectedValue = this.sSelectedValue,
          showTimePicker = this.showTimePicker;

      var endValue = sValue[1] ? sValue[1].clone() : sValue[0].clone().add(1, 'month');
      // keep selectedTime when select date
      if (sSelectedValue[1] && this.timePicker) {
        syncTime(sSelectedValue[1], endValue);
      }
      if (showTimePicker) {
        return sSelectedValue[1] ? sSelectedValue[1] : this.getStartValue();
      }
      return endValue;
    },

    // get disabled hours for second picker
    getEndDisableTime: function getEndDisableTime() {
      var sSelectedValue = this.sSelectedValue,
          sValue = this.sValue,
          disabledTime = this.disabledTime;

      var userSettingDisabledTime = disabledTime(sSelectedValue, 'end') || {};
      var startValue = sSelectedValue && sSelectedValue[0] || sValue[0].clone();
      // if startTime and endTime is same day..
      // the second time picker will not able to pick time before first time picker
      if (!sSelectedValue[1] || startValue.isSame(sSelectedValue[1], 'day')) {
        var hours = startValue.hour();
        var minutes = startValue.minute();
        var second = startValue.second();
        var _disabledHours = userSettingDisabledTime.disabledHours,
            _disabledMinutes = userSettingDisabledTime.disabledMinutes,
            _disabledSeconds = userSettingDisabledTime.disabledSeconds;

        var oldDisabledMinutes = _disabledMinutes ? _disabledMinutes() : [];
        var olddisabledSeconds = _disabledSeconds ? _disabledSeconds() : [];
        _disabledHours = generateOptions(hours, _disabledHours);
        _disabledMinutes = generateOptions(minutes, _disabledMinutes);
        _disabledSeconds = generateOptions(second, _disabledSeconds);
        return {
          disabledHours: function disabledHours() {
            return _disabledHours;
          },
          disabledMinutes: function disabledMinutes(hour) {
            if (hour === hours) {
              return _disabledMinutes;
            }
            return oldDisabledMinutes;
          },
          disabledSeconds: function disabledSeconds(hour, minute) {
            if (hour === hours && minute === minutes) {
              return _disabledSeconds;
            }
            return olddisabledSeconds;
          }
        };
      }
      return userSettingDisabledTime;
    },
    isAllowedDateAndTime: function isAllowedDateAndTime(selectedValue) {
      return isAllowedDate(selectedValue[0], this.disabledDate, this.disabledStartTime) && isAllowedDate(selectedValue[1], this.disabledDate, this.disabledEndTime);
    },
    isMonthYearPanelShow: function isMonthYearPanelShow(mode) {
      return ['month', 'year', 'decade'].indexOf(mode) > -1;
    },
    hasSelectedValue: function hasSelectedValue() {
      var sSelectedValue = this.sSelectedValue;

      return !!sSelectedValue[1] && !!sSelectedValue[0];
    },
    compare: function compare(v1, v2) {
      if (this.timePicker) {
        return v1.diff(v2);
      }
      return v1.diff(v2, 'days');
    },
    fireSelectValueChange: function fireSelectValueChange(selectedValue, direct) {
      var timePicker = this.timePicker,
          prevSelectedValue = this.prevSelectedValue;

      if (timePicker) {
        var timePickerProps = getOptionProps(timePicker);
        if (timePickerProps.defaultValue) {
          var timePickerDefaultValue = timePickerProps.defaultValue;
          if (!prevSelectedValue[0] && selectedValue[0]) {
            syncTime(timePickerDefaultValue[0], selectedValue[0]);
          }
          if (!prevSelectedValue[1] && selectedValue[1]) {
            syncTime(timePickerDefaultValue[1], selectedValue[1]);
          }
        }
      }
      // 尚未选择过时间，直接输入的话
      if (!this.sSelectedValue[0] || !this.sSelectedValue[1]) {
        var startValue = selectedValue[0] || moment();
        var endValue = selectedValue[1] || startValue.clone().add(1, 'months');
        this.setState({
          sSelectedValue: selectedValue,
          sValue: selectedValue && selectedValue.length === 2 ? getValueFromSelectedValue([startValue, endValue]) : this.sValue
        });
      }

      if (selectedValue[0] && !selectedValue[1]) {
        this.setState({ firstSelectedValue: selectedValue[0] });
        this.fireHoverValueChange(selectedValue.concat());
      }
      this.__emit('change', selectedValue);
      if (direct || selectedValue[0] && selectedValue[1]) {
        this.setState({
          prevSelectedValue: selectedValue,
          firstSelectedValue: null
        });
        this.fireHoverValueChange([]);
        this.__emit('select', selectedValue);
      }
      if (!hasProp(this, 'selectedValue')) {
        this.setState({
          sSelectedValue: selectedValue
        });
      }
    },
    fireValueChange: function fireValueChange(value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value
        });
      }
      this.__emit('valueChange', value);
    },
    fireHoverValueChange: function fireHoverValueChange(hoverValue) {
      if (!hasProp(this, 'hoverValue')) {
        this.setState({ sHoverValue: hoverValue });
      }
      this.__emit('hoverChange', hoverValue);
    },
    clear: function clear() {
      this.fireSelectValueChange([], true);
      this.__emit('clear');
    },
    disabledStartTime: function disabledStartTime(time) {
      return this.disabledTime(time, 'start');
    },
    disabledEndTime: function disabledEndTime(time) {
      return this.disabledTime(time, 'end');
    },
    disabledStartMonth: function disabledStartMonth(month) {
      var sValue = this.sValue;

      return month.isSameOrAfter(sValue[1], 'month');
    },
    disabledEndMonth: function disabledEndMonth(month) {
      var sValue = this.sValue;

      return month.isSameOrBefore(sValue[0], 'month');
    }
  },

  render: function render() {
    var _className, _cls;

    var h = arguments[0];

    var props = getOptionProps(this);
    var prefixCls = props.prefixCls,
        dateInputPlaceholder = props.dateInputPlaceholder,
        timePicker = props.timePicker,
        showOk = props.showOk,
        locale = props.locale,
        showClear = props.showClear,
        showToday = props.showToday,
        type = props.type;
    var sHoverValue = this.sHoverValue,
        sSelectedValue = this.sSelectedValue,
        sMode = this.sMode,
        showTimePicker = this.showTimePicker,
        sValue = this.sValue,
        $listeners = this.$listeners;

    var className = (_className = {}, _defineProperty(_className, prefixCls, 1), _defineProperty(_className, prefixCls + '-hidden', !props.visible), _defineProperty(_className, prefixCls + '-range', 1), _defineProperty(_className, prefixCls + '-show-time-picker', showTimePicker), _defineProperty(_className, prefixCls + '-week-number', props.showWeekNumber), _className);
    var baseProps = {
      props: props,
      on: $listeners
    };
    var newProps = {
      props: {
        selectedValue: sSelectedValue
      },
      on: {
        select: this.onSelect,
        dayHover: type === 'start' && sSelectedValue[1] || type === 'end' && sSelectedValue[0] || !!sHoverValue.length ? this.onDayHover : noop
      }
    };

    var placeholder1 = void 0;
    var placeholder2 = void 0;

    if (dateInputPlaceholder) {
      if (Array.isArray(dateInputPlaceholder)) {
        var _dateInputPlaceholder = _slicedToArray(dateInputPlaceholder, 2);

        placeholder1 = _dateInputPlaceholder[0];
        placeholder2 = _dateInputPlaceholder[1];
      } else {
        placeholder1 = placeholder2 = dateInputPlaceholder;
      }
    }
    var showOkButton = showOk === true || showOk !== false && !!timePicker;
    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-footer', true), _defineProperty(_cls, prefixCls + '-range-bottom', true), _defineProperty(_cls, prefixCls + '-footer-show-ok', showOkButton), _cls);

    var startValue = this.getStartValue();
    var endValue = this.getEndValue();
    var todayTime = getTodayTime(startValue);
    var thisMonth = todayTime.month();
    var thisYear = todayTime.year();
    var isTodayInView = startValue.year() === thisYear && startValue.month() === thisMonth || endValue.year() === thisYear && endValue.month() === thisMonth;
    var nextMonthOfStart = startValue.clone().add(1, 'months');
    var isClosestMonths = nextMonthOfStart.year() === endValue.year() && nextMonthOfStart.month() === endValue.month();
    var leftPartProps = mergeProps(baseProps, newProps, {
      props: {
        hoverValue: sHoverValue,
        direction: 'left',
        disabledTime: this.disabledStartTime,
        disabledMonth: this.disabledStartMonth,
        format: this.getFormat(),
        value: startValue,
        mode: sMode[0],
        placeholder: placeholder1,
        showDateInput: this.showDateInput,
        timePicker: timePicker,
        showTimePicker: showTimePicker,
        enablePrev: true,
        enableNext: !isClosestMonths || this.isMonthYearPanelShow(sMode[1])
      },
      on: {
        inputSelect: this.onStartInputSelect,
        valueChange: this.onStartValueChange,
        panelChange: this.onStartPanelChange
      }
    });
    var rightPartProps = mergeProps(baseProps, newProps, {
      props: {
        hoverValue: sHoverValue,
        direction: 'right',
        format: this.getFormat(),
        timePickerDisabledTime: this.getEndDisableTime(),
        placeholder: placeholder2,
        value: endValue,
        mode: sMode[1],
        showDateInput: this.showDateInput,
        timePicker: timePicker,
        showTimePicker: showTimePicker,
        disabledTime: this.disabledEndTime,
        disabledMonth: this.disabledEndMonth,
        enablePrev: !isClosestMonths || this.isMonthYearPanelShow(sMode[0]),
        enableNext: true
      },
      on: {
        inputSelect: this.onEndInputSelect,
        valueChange: this.onEndValueChange,
        panelChange: this.onEndPanelChange
      }
    });
    var TodayButtonNode = null;
    if (showToday) {
      var todayButtonProps = mergeProps(baseProps, {
        props: {
          disabled: isTodayInView,
          value: sValue[0],
          text: locale.backToToday
        },
        on: {
          today: this.onToday
        }
      });
      TodayButtonNode = h(TodayButton, todayButtonProps);
    }

    var TimePickerButtonNode = null;
    if (props.timePicker) {
      var timePickerButtonProps = mergeProps(baseProps, {
        props: {
          showTimePicker: showTimePicker,
          timePickerDisabled: !this.hasSelectedValue() || sHoverValue.length
        },
        on: {
          openTimePicker: this.onOpenTimePicker,
          closeTimePicker: this.onCloseTimePicker
        }
      });
      TimePickerButtonNode = h(TimePickerButton, timePickerButtonProps);
    }

    var OkButtonNode = null;
    if (showOkButton) {
      var okButtonProps = mergeProps(baseProps, {
        props: {
          okDisabled: !this.isAllowedDateAndTime(sSelectedValue) || !this.hasSelectedValue() || sHoverValue.length
        },
        on: {
          ok: this.onOk
        }
      });
      OkButtonNode = h(OkButton, okButtonProps);
    }

    return h(
      'div',
      {
        ref: 'rootInstance',
        'class': className,
        attrs: { tabIndex: '0'
        }
      },
      [props.renderSidebar(), h(
        'div',
        { 'class': prefixCls + '-panel' },
        [showClear && sSelectedValue[0] && sSelectedValue[1] ? h('a', {
          'class': prefixCls + '-clear-btn',
          attrs: { role: 'button',
            title: locale.clear
          },
          on: {
            'click': this.clear
          }
        }) : null, h(
          'div',
          {
            'class': prefixCls + '-date-panel',
            on: {
              'mouseleave': type !== 'both' ? this.onDatePanelLeave : noop,
              'mouseenter': type !== 'both' ? this.onDatePanelEnter : noop
            }
          },
          [h(CalendarPart, leftPartProps), h(
            'span',
            { 'class': prefixCls + '-range-middle' },
            ['~']
          ), h(CalendarPart, rightPartProps)]
        ), h(
          'div',
          { 'class': cls },
          [props.renderFooter(), showToday || props.timePicker || showOkButton ? h(
            'div',
            { 'class': prefixCls + '-footer-btn' },
            [TodayButtonNode, TimePickerButtonNode, OkButtonNode]
          ) : null]
        )]
      )]
    );
  }
};

export default RangeCalendar;