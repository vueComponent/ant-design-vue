import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getOptionProps } from '../../../_util/props-util';
import { cloneElement } from '../../../_util/vnode';
import CalendarHeader from '../calendar/CalendarHeader';
import DateTable from '../date/DateTable';
import DateInput from '../date/DateInput';
import { getTimeConfig } from '../util/index';
function noop() {}
var CalendarPart = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    value: PropTypes.any,
    hoverValue: PropTypes.any,
    selectedValue: PropTypes.any,
    direction: PropTypes.any,
    locale: PropTypes.any,
    showDateInput: PropTypes.bool,
    showTimePicker: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
    format: PropTypes.any,
    placeholder: PropTypes.any,
    disabledDate: PropTypes.any,
    timePicker: PropTypes.any,
    disabledTime: PropTypes.any,
    mode: PropTypes.any,
    // onInputSelect: PropTypes.func,
    timePickerDisabledTime: PropTypes.object,
    enableNext: PropTypes.any,
    enablePrev: PropTypes.any,
    dateRender: PropTypes.func
  },
  render: function render() {
    var h = arguments[0];
    var props = this.$props,
        _$listeners = this.$listeners,
        $listeners = _$listeners === undefined ? {} : _$listeners;
    var prefixCls = props.prefixCls,
        value = props.value,
        hoverValue = props.hoverValue,
        selectedValue = props.selectedValue,
        mode = props.mode,
        direction = props.direction,
        locale = props.locale,
        format = props.format,
        placeholder = props.placeholder,
        disabledDate = props.disabledDate,
        timePicker = props.timePicker,
        disabledTime = props.disabledTime,
        timePickerDisabledTime = props.timePickerDisabledTime,
        showTimePicker = props.showTimePicker,
        enablePrev = props.enablePrev,
        enableNext = props.enableNext,
        disabledMonth = props.disabledMonth,
        showDateInput = props.showDateInput,
        dateRender = props.dateRender,
        showWeekNumber = props.showWeekNumber;
    var _$listeners$inputSele = $listeners.inputSelect,
        inputSelect = _$listeners$inputSele === undefined ? noop : _$listeners$inputSele,
        _$listeners$valueChan = $listeners.valueChange,
        valueChange = _$listeners$valueChan === undefined ? noop : _$listeners$valueChan,
        _$listeners$panelChan = $listeners.panelChange,
        panelChange = _$listeners$panelChan === undefined ? noop : _$listeners$panelChan,
        _$listeners$select = $listeners.select,
        select = _$listeners$select === undefined ? noop : _$listeners$select,
        _$listeners$dayHover = $listeners.dayHover,
        dayHover = _$listeners$dayHover === undefined ? noop : _$listeners$dayHover;

    var shouldShowTimePicker = showTimePicker && timePicker;
    var disabledTimeConfig = shouldShowTimePicker && disabledTime ? getTimeConfig(selectedValue, disabledTime) : null;
    var rangeClassName = prefixCls + '-range';
    var newProps = {
      locale: locale,
      value: value,
      prefixCls: prefixCls,
      showTimePicker: showTimePicker
    };
    var index = direction === 'left' ? 0 : 1;
    var timePickerEle = null;
    if (shouldShowTimePicker) {
      var timePickerProps = getOptionProps(timePicker);
      timePickerEle = cloneElement(timePicker, {
        props: _extends({
          showHour: true,
          showMinute: true,
          showSecond: true
        }, timePickerProps, disabledTimeConfig, timePickerDisabledTime, {
          defaultOpenValue: value,
          value: selectedValue[index]
        }),
        on: {
          change: inputSelect
        }

      });
    }

    var dateInputElement = showDateInput && h(DateInput, {
      attrs: {
        format: format,
        locale: locale,
        prefixCls: prefixCls,
        timePicker: timePicker,
        disabledDate: disabledDate,
        placeholder: placeholder,
        disabledTime: disabledTime,
        value: value,
        showClear: false,
        selectedValue: selectedValue[index]
      },
      on: {
        'change': inputSelect
      }
    });
    var headerProps = {
      props: _extends({}, newProps, {
        mode: mode,
        enableNext: enableNext,
        enablePrev: enablePrev,
        disabledMonth: disabledMonth
      }),
      on: {
        valueChange: valueChange,
        panelChange: panelChange
      }
    };
    var tableProps = {
      props: _extends({}, newProps, {
        hoverValue: hoverValue,
        selectedValue: selectedValue,
        dateRender: dateRender,
        disabledDate: disabledDate,
        showWeekNumber: showWeekNumber
      }),
      on: {
        select: select,
        dayHover: dayHover
      }
    };
    return h(
      'div',
      { 'class': rangeClassName + '-part ' + rangeClassName + '-' + direction },
      [dateInputElement, h(
        'div',
        { style: { outline: 'none' } },
        [h(CalendarHeader, headerProps), showTimePicker ? h(
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
          [h(DateTable, tableProps)]
        )]
      )]
    );
  }
};

export default CalendarPart;