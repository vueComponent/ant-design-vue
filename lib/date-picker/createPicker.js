'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports['default'] = createPicker;

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _MonthCalendar = require('../vc-calendar/src/MonthCalendar');

var _MonthCalendar2 = _interopRequireDefault(_MonthCalendar);

var _Picker = require('../vc-calendar/src/Picker');

var _Picker2 = _interopRequireDefault(_Picker);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export const PickerProps = {
//   value?: moment.Moment;
//   prefixCls: string;
// }
function noop() {}
function createPicker(TheCalendar, props) {
  return {
    // static defaultProps = {
    //   prefixCls: 'ant-calendar',
    //   allowClear: true,
    //   showToday: true,
    // };

    // private input: any;
    props: (0, _propsUtil.initDefaultProps)(props, {
      prefixCls: 'ant-calendar',
      allowClear: true,
      showToday: true
    }),
    mixins: [_BaseMixin2['default']],
    model: {
      prop: 'value',
      event: 'change'
    },
    data: function data() {
      var value = this.value || this.defaultValue;
      if (value && !(0, _interopDefault2['default'])(moment).isMoment(value)) {
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
        if (!(0, _propsUtil.hasProp)(this, 'value')) {
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

      var props = (0, _propsUtil.getOptionProps)(this);
      var prefixCls = props.prefixCls,
          locale = props.locale,
          localeCode = props.localeCode;

      var dateRender = props.dateRender || $scopedSlots.dateRender;
      var monthCellContentRender = props.monthCellContentRender || $scopedSlots.monthCellContentRender;
      var placeholder = 'placeholder' in props ? props.placeholder : locale.lang.placeholder;

      var disabledTime = props.showTime ? props.disabledTime : null;

      var calendarClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-time', props.showTime), (0, _defineProperty3['default'])(_classNames, prefixCls + '-month', _MonthCalendar2['default'] === TheCalendar), _classNames));

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
      var theCalendarProps = (0, _propsUtil.mergeProps)(calendarProps, {
        props: {
          disabledDate: props.disabledDate,
          disabledTime: disabledTime,
          locale: locale.lang,
          timePicker: props.timePicker,
          defaultValue: props.defaultPickerValue || (0, _interopDefault2['default'])(moment)(),
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

      var clearIcon = !props.disabled && props.allowClear && value ? h(_icon2['default'], {
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
        props: (0, _extends3['default'])({}, props, pickerProps.props, {
          calendar: calendar,
          value: value,
          prefixCls: prefixCls + '-picker-container'
        }),
        on: (0, _extends3['default'])({}, (0, _omit2['default'])($listeners, 'change'), pickerProps.on),
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
          _Picker2['default'],
          vcDatePickerProps,
          [input]
        )]
      );
    }
  };
}
module.exports = exports['default'];