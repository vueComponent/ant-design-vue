import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

import * as moment from 'moment';
import omit from 'lodash/omit';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import classNames from 'classnames';
import Icon from '../icon';
import interopDefault from '../_util/interopDefault';
import BaseMixin from '../_util/BaseMixin';
import { hasProp, getOptionProps, initDefaultProps, mergeProps } from '../_util/props-util';

// export const PickerProps = {
//   value?: moment.Moment;
//   prefixCls: string;
// }
function noop() {}
export default function createPicker(TheCalendar, props) {
  return {
    // static defaultProps = {
    //   prefixCls: 'ant-calendar',
    //   allowClear: true,
    //   showToday: true,
    // };

    // private input: any;
    props: initDefaultProps(props, {
      prefixCls: 'ant-calendar',
      allowClear: true,
      showToday: true
    }),
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
        sValue: value,
        showDate: value
      };
    },

    watch: {
      value: function value(val) {
        this.setState({
          sValue: val,
          showDate: val
        });
      }
    },
    methods: {
      renderFooter: function renderFooter() {
        var h = this.$createElement;
        var prefixCls = this.prefixCls,
            $scopedSlots = this.$scopedSlots,
            $slots = this.$slots;

        var renderExtraFooter = this.renderExtraFooter || $scopedSlots.renderExtraFooter || $slots.renderExtraFooter;
        return renderExtraFooter ? h(
          'div',
          { 'class': prefixCls + '-footer-extra' },
          [typeof renderExtraFooter === 'function' ? renderExtraFooter.apply(undefined, arguments) : renderExtraFooter]
        ) : null;
      },
      clearSelection: function clearSelection(e) {
        e.preventDefault();
        e.stopPropagation();
        this.handleChange(null);
      },
      handleChange: function handleChange(value) {
        if (!hasProp(this, 'value')) {
          this.setState({
            sValue: value,
            showDate: value
          });
        }
        this.$emit('change', value, value && value.format(this.format) || '');
      },
      handleCalendarChange: function handleCalendarChange(value) {
        this.setState({ showDate: value });
      },
      focus: function focus() {
        this.$refs.input.focus();
      },
      blur: function blur() {
        this.$refs.input.blur();
      }
    },

    render: function render() {
      var _classNames;

      var h = arguments[0];
      var value = this.sValue,
          showDate = this.showDate,
          $listeners = this.$listeners,
          $scopedSlots = this.$scopedSlots;
      var _$listeners$panelChan = $listeners.panelChange,
          panelChange = _$listeners$panelChan === undefined ? noop : _$listeners$panelChan,
          _$listeners$focus = $listeners.focus,
          focus = _$listeners$focus === undefined ? noop : _$listeners$focus,
          _$listeners$blur = $listeners.blur,
          blur = _$listeners$blur === undefined ? noop : _$listeners$blur,
          _$listeners$ok = $listeners.ok,
          ok = _$listeners$ok === undefined ? noop : _$listeners$ok;

      var props = getOptionProps(this);
      var prefixCls = props.prefixCls,
          locale = props.locale,
          localeCode = props.localeCode;

      var dateRender = props.dateRender || $scopedSlots.dateRender;
      var monthCellContentRender = props.monthCellContentRender || $scopedSlots.monthCellContentRender;
      var placeholder = 'placeholder' in props ? props.placeholder : locale.lang.placeholder;

      var disabledTime = props.showTime ? props.disabledTime : null;

      var calendarClassName = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-time', props.showTime), _defineProperty(_classNames, prefixCls + '-month', MonthCalendar === TheCalendar), _classNames));

      if (value && localeCode) {
        value.locale(localeCode);
      }

      var pickerProps = { props: {}, on: {} };
      var calendarProps = { props: {}, on: {} };
      if (props.showTime) {
        // fix https://github.com/ant-design/ant-design/issues/1902
        calendarProps.on.select = this.handleChange;
      } else {
        pickerProps.on.change = this.handleChange;
      }
      if ('mode' in props) {
        calendarProps.props.mode = props.mode;
      }
      var theCalendarProps = mergeProps(calendarProps, {
        props: {
          disabledDate: props.disabledDate,
          disabledTime: disabledTime,
          locale: locale.lang,
          timePicker: props.timePicker,
          defaultValue: props.defaultPickerValue || interopDefault(moment)(),
          dateInputPlaceholder: placeholder,
          prefixCls: prefixCls,
          dateRender: dateRender,
          format: props.format,
          showToday: props.showToday,
          monthCellContentRender: monthCellContentRender,
          renderFooter: this.renderFooter,
          value: showDate
        },
        on: {
          ok: ok,
          panelChange: panelChange,
          change: this.handleCalendarChange
        },
        'class': calendarClassName,
        scopedSlots: $scopedSlots
      });
      var calendar = h(TheCalendar, theCalendarProps);

      var clearIcon = !props.disabled && props.allowClear && value ? h(Icon, {
        attrs: {
          type: 'cross-circle'
        },
        'class': prefixCls + '-picker-clear',
        on: {
          'click': this.clearSelection
        }
      }) : null;

      var input = function input(_ref) {
        var inputValue = _ref.value;
        return h('div', [h('input', {
          ref: 'input',
          attrs: { disabled: props.disabled,

            readOnly: true,

            placeholder: placeholder
          },
          on: {
            'focus': focus,
            'blur': blur
          },
          domProps: {
            'value': inputValue && inputValue.format(props.format) || ''
          },
          'class': props.pickerInputClass
        }), clearIcon, h('span', { 'class': prefixCls + '-picker-icon' })]);
      };
      var vcDatePickerProps = {
        props: _extends({}, props, pickerProps.props, {
          calendar: calendar,
          value: value,
          prefixCls: prefixCls + '-picker-container'
        }),
        on: _extends({}, omit($listeners, 'change'), pickerProps.on),
        style: props.popupStyle
      };
      return h(
        'span',
        {
          'class': props.pickerClass
          // tabIndex={props.disabled ? -1 : 0}
          // onFocus={focus}
          // onBlur={blur}
        },
        [h(
          VcDatePicker,
          vcDatePickerProps,
          [input]
        )]
      );
    }
  };
}