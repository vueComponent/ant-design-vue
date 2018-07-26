import _extends from 'babel-runtime/helpers/extends';

import * as moment from 'moment';
import Calendar from '../vc-calendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import Icon from '../icon';
import { hasProp, getOptionProps, initDefaultProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { WeekPickerProps } from './interface';
import interopDefault from '../_util/interopDefault';

function formatValue(value, format) {
  return value && value.format(format) || '';
}
function noop() {}

export default {
  // static defaultProps = {
  //   format: 'YYYY-wo',
  //   allowClear: true,
  // };

  // private input: any;
  props: initDefaultProps(WeekPickerProps(), {
    format: 'gggg-wo',
    allowClear: true
  }),
  name: 'AWeekPicker',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    var value = this.value || this.defaultValue;
    if (value && !interopDefault(moment).isMoment(value)) {
      throw new Error('The value/defaultValue of DatePicker or MonthPicker must be ' + 'a moment object');
    }
    return {
      sValue: value
    };
  },

  watch: {
    value: function value(val) {
      this.setState({ sValue: val });
    }
  },

  methods: {
    weekDateRender: function weekDateRender(current) {
      var h = this.$createElement;

      var selectedValue = this.sValue;
      var prefixCls = this.prefixCls;

      if (selectedValue && current.year() === selectedValue.year() && current.week() === selectedValue.week()) {
        return h(
          'div',
          { 'class': prefixCls + '-selected-day' },
          [h(
            'div',
            { 'class': prefixCls + '-date' },
            [current.date()]
          )]
        );
      }
      return h(
        'div',
        { 'class': prefixCls + '-calendar-date' },
        [current.date()]
      );
    },
    handleChange: function handleChange(value) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      this.$emit('change', value, formatValue(value, this.format));
    },
    clearSelection: function clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      this.handleChange(null);
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    }
  },

  render: function render() {
    var h = arguments[0];

    var props = getOptionProps(this);
    var prefixCls = this.prefixCls,
        disabled = this.disabled,
        pickerClass = this.pickerClass,
        popupStyle = this.popupStyle,
        pickerInputClass = this.pickerInputClass,
        format = this.format,
        allowClear = this.allowClear,
        locale = this.locale,
        localeCode = this.localeCode,
        disabledDate = this.disabledDate,
        pickerValue = this.sValue,
        $listeners = this.$listeners,
        $scopedSlots = this.$scopedSlots;
    var _$listeners$focus = $listeners.focus,
        focus = _$listeners$focus === undefined ? noop : _$listeners$focus,
        _$listeners$blur = $listeners.blur,
        blur = _$listeners$blur === undefined ? noop : _$listeners$blur;


    if (pickerValue && localeCode) {
      pickerValue.locale(localeCode);
    }

    var placeholder = hasProp(this, 'placeholder') ? this.placeholder : locale.lang.placeholder;
    var weekDateRender = this.dateRender || $scopedSlots.dateRender || this.weekDateRender;
    var calendar = h(Calendar, {
      attrs: {
        showWeekNumber: true,
        dateRender: weekDateRender,
        prefixCls: prefixCls,
        format: format,
        locale: locale.lang,
        showDateInput: false,
        showToday: false,
        disabledDate: disabledDate
      }
    });
    var clearIcon = !disabled && allowClear && this.sValue ? h(Icon, {
      attrs: {
        type: 'cross-circle'
      },
      'class': prefixCls + '-picker-clear',
      on: {
        'click': this.clearSelection
      }
    }) : null;
    var input = function input(_ref) {
      var value = _ref.value;

      return h('span', [h('input', {
        ref: 'input',
        attrs: { disabled: disabled,
          readOnly: true,

          placeholder: placeholder
        },
        domProps: {
          'value': value && value.format(format) || ''
        },
        'class': pickerInputClass,
        on: {
          'focus': focus,
          'blur': blur
        }
      }), clearIcon, h('span', { 'class': prefixCls + '-picker-icon' })]);
    };
    var vcDatePickerProps = {
      props: _extends({}, props, {
        calendar: calendar,
        prefixCls: prefixCls + '-picker-container',
        value: pickerValue
      }),
      on: _extends({}, $listeners, {
        change: this.handleChange
      }),
      style: popupStyle
    };
    return h(
      'span',
      { 'class': pickerClass },
      [h(
        VcDatePicker,
        vcDatePickerProps,
        [input]
      )]
    );
  }
};