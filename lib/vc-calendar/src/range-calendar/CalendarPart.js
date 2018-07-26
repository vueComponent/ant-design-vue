'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../../_util/props-util');

var _vnode = require('../../../_util/vnode');

var _CalendarHeader = require('../calendar/CalendarHeader');

var _CalendarHeader2 = _interopRequireDefault(_CalendarHeader);

var _DateTable = require('../date/DateTable');

var _DateTable2 = _interopRequireDefault(_DateTable);

var _DateInput = require('../date/DateInput');

var _DateInput2 = _interopRequireDefault(_DateInput);

var _index = require('../util/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
var CalendarPart = {
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string,
    value: _vueTypes2['default'].any,
    hoverValue: _vueTypes2['default'].any,
    selectedValue: _vueTypes2['default'].any,
    direction: _vueTypes2['default'].any,
    locale: _vueTypes2['default'].any,
    showDateInput: _vueTypes2['default'].bool,
    showTimePicker: _vueTypes2['default'].bool,
    showWeekNumber: _vueTypes2['default'].bool,
    format: _vueTypes2['default'].any,
    placeholder: _vueTypes2['default'].any,
    disabledDate: _vueTypes2['default'].any,
    timePicker: _vueTypes2['default'].any,
    disabledTime: _vueTypes2['default'].any,
    mode: _vueTypes2['default'].any,
    // onInputSelect: PropTypes.func,
    timePickerDisabledTime: _vueTypes2['default'].object,
    enableNext: _vueTypes2['default'].any,
    enablePrev: _vueTypes2['default'].any,
    dateRender: _vueTypes2['default'].func
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
    var disabledTimeConfig = shouldShowTimePicker && disabledTime ? (0, _index.getTimeConfig)(selectedValue, disabledTime) : null;
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
      var timePickerProps = (0, _propsUtil.getOptionProps)(timePicker);
      timePickerEle = (0, _vnode.cloneElement)(timePicker, {
        props: (0, _extends3['default'])({
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

    var dateInputElement = showDateInput && h(_DateInput2['default'], {
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
      props: (0, _extends3['default'])({}, newProps, {
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
      props: (0, _extends3['default'])({}, newProps, {
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
        [h(_CalendarHeader2['default'], headerProps), showTimePicker ? h(
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
          [h(_DateTable2['default'], tableProps)]
        )]
      )]
    );
  }
};

exports['default'] = CalendarPart;
module.exports = exports['default'];