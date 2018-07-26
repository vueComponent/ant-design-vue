'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _RangeCalendar = require('../vc-calendar/src/RangeCalendar');

var _RangeCalendar2 = _interopRequireDefault(_RangeCalendar);

var _Picker = require('../vc-calendar/src/Picker');

var _Picker2 = _interopRequireDefault(_Picker);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _interface = require('./interface');

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
function getShowDateFromValue(value) {
  var _value = (0, _slicedToArray3['default'])(value, 2),
      start = _value[0],
      end = _value[1];
  // value could be an empty array, then we should not reset showDate


  if (!start && !end) {
    return;
  }
  var newEnd = end && end.isSame(start, 'month') ? end.clone().add(1, 'month') : end;
  return [start, newEnd];
}

function formatValue(value, format) {
  return value && value.format(format) || '';
}

function pickerValueAdapter(value) {
  if (!value) {
    return;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value, value.clone().add(1, 'month')];
}

function isEmptyArray(arr) {
  if (Array.isArray(arr)) {
    return arr.length === 0 || arr.every(function (i) {
      return !i;
    });
  }
  return false;
}

function fixLocale(value, localeCode) {
  if (!localeCode) {
    return;
  }
  if (!value || value.length === 0) {
    return;
  }
  if (value[0]) {
    value[0].locale(localeCode);
  }
  if (value[1]) {
    value[1].locale(localeCode);
  }
}

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  name: 'ARangePicker',
  props: (0, _propsUtil.initDefaultProps)((0, _interface.RangePickerProps)(), {
    prefixCls: 'ant-calendar',
    allowClear: true,
    showToday: false
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    var value = this.value || this.defaultValue || [];
    if (value[0] && !(0, _interopDefault2['default'])(moment).isMoment(value[0]) || value[1] && !(0, _interopDefault2['default'])(moment).isMoment(value[1])) {
      throw new Error('The value/defaultValue of RangePicker must be a moment object array after `antd@2.0`, ' + 'see: https://u.ant.design/date-picker-value');
    }
    var pickerValue = !value || isEmptyArray(value) ? this.defaultPickerValue : value;
    return {
      sValue: value,
      sShowDate: pickerValueAdapter(pickerValue || (0, _interopDefault2['default'])(moment)()),
      sOpen: this.open,
      sHoverValue: []
    };
  },

  watch: {
    value: function value(val) {
      var value = val || [];
      this.setState({
        sValue: value,
        sShowDate: getShowDateFromValue(value) || this.sShowDate
      });
    },
    open: function open(val) {
      this.setState({
        sOpen: val
      });
    }
  },
  methods: {
    clearSelection: function clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ sValue: [] });
      this.handleChange([]);
    },
    clearHoverValue: function clearHoverValue() {
      this.setState({ sHoverValue: [] });
    },
    handleChange: function handleChange(value) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState(function (_ref) {
          var sShowDate = _ref.sShowDate;
          return {
            sValue: value,
            sShowDate: getShowDateFromValue(value) || sShowDate
          };
        });
      }
      this.$emit('change', value, [formatValue(value[0], this.format), formatValue(value[1], this.format)]);
    },
    handleOpenChange: function handleOpenChange(open) {
      if (!(0, _propsUtil.hasProp)(this, 'open')) {
        this.setState({ sOpen: open });
      }

      if (open === false) {
        this.clearHoverValue();
      }
      this.$emit('openChange', open);
    },
    handleShowDateChange: function handleShowDateChange(showDate) {
      this.setState({ sShowDate: showDate });
    },
    handleHoverChange: function handleHoverChange(hoverValue) {
      this.setState({ sHoverValue: hoverValue });
    },
    handleRangeMouseLeave: function handleRangeMouseLeave() {
      if (this.sOpen) {
        this.clearHoverValue();
      }
    },
    handleCalendarInputSelect: function handleCalendarInputSelect(value) {
      if (!value[0]) {
        return;
      }
      this.setState(function (_ref2) {
        var sShowDate = _ref2.sShowDate;
        return {
          sValue: value,
          sShowDate: getShowDateFromValue(value) || sShowDate
        };
      });
    },
    handleRangeClick: function handleRangeClick(value) {
      if (typeof value === 'function') {
        value = value();
      }

      this.setValue(value, true);
      this.$emit('ok', value);
    },
    setValue: function setValue(value, hidePanel) {
      this.handleChange(value);
      if ((hidePanel || !this.showTime) && !(0, _propsUtil.hasProp)(this, 'open')) {
        this.setState({ sOpen: false });
      }
    },
    focus: function focus() {
      this.$refs.picker.focus();
    },
    blur: function blur() {
      this.$refs.picker.blur();
    },
    renderFooter: function renderFooter() {
      var _this = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          ranges = this.ranges,
          $scopedSlots = this.$scopedSlots,
          $slots = this.$slots;

      var renderExtraFooter = this.renderExtraFooter || $scopedSlots.renderExtraFooter || $slots.renderExtraFooter;
      if (!ranges && !renderExtraFooter) {
        return null;
      }
      var customFooter = renderExtraFooter ? h(
        'div',
        { 'class': prefixCls + '-footer-extra', key: 'extra' },
        [typeof renderExtraFooter === 'function' ? renderExtraFooter.apply(undefined, arguments) : renderExtraFooter]
      ) : null;
      var operations = Object.keys(ranges || {}).map(function (range) {
        var value = ranges[range];
        return h(
          'a',
          {
            key: range,
            on: {
              'click': function click() {
                return _this.handleRangeClick(value);
              },
              'mouseenter': function mouseenter() {
                return _this.setState({ sHoverValue: value });
              },
              'mouseleave': _this.handleRangeMouseLeave
            }
          },
          [range]
        );
      });
      var rangeNode = h(
        'div',
        { 'class': prefixCls + '-footer-extra ' + prefixCls + '-range-quick-selector', key: 'range' },
        [operations]
      );
      return [rangeNode, customFooter];
    }
  },

  render: function render() {
    var _classNames,
        _this2 = this;

    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var value = this.sValue,
        showDate = this.sShowDate,
        hoverValue = this.sHoverValue,
        open = this.sOpen,
        $listeners = this.$listeners,
        $scopedSlots = this.$scopedSlots;
    var _$listeners$calendarC = $listeners.calendarChange,
        calendarChange = _$listeners$calendarC === undefined ? noop : _$listeners$calendarC,
        _$listeners$ok = $listeners.ok,
        ok = _$listeners$ok === undefined ? noop : _$listeners$ok,
        _$listeners$focus = $listeners.focus,
        focus = _$listeners$focus === undefined ? noop : _$listeners$focus,
        _$listeners$blur = $listeners.blur,
        blur = _$listeners$blur === undefined ? noop : _$listeners$blur,
        _$listeners$panelChan = $listeners.panelChange,
        panelChange = _$listeners$panelChan === undefined ? noop : _$listeners$panelChan;
    var prefixCls = props.prefixCls,
        popupStyle = props.popupStyle,
        disabledDate = props.disabledDate,
        disabledTime = props.disabledTime,
        showTime = props.showTime,
        showToday = props.showToday,
        ranges = props.ranges,
        locale = props.locale,
        localeCode = props.localeCode,
        format = props.format;

    var dateRender = props.dateRender || $scopedSlots.dateRender;
    fixLocale(value, localeCode);
    fixLocale(showDate, localeCode);

    var calendarClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-time', showTime), (0, _defineProperty3['default'])(_classNames, prefixCls + '-range-with-ranges', ranges), _classNames));

    // 需要选择时间时，点击 ok 时才触发 onChange
    var pickerChangeHandler = {
      on: {
        change: this.handleChange
      }
    };
    var calendarProps = {
      on: {
        ok: this.handleChange
      }, props: {}
    };
    if (props.timePicker) {
      pickerChangeHandler.on.change = function (changedValue) {
        return _this2.handleChange(changedValue);
      };
    } else {
      calendarProps = { on: {}, props: {} };
    }
    if ('mode' in props) {
      calendarProps.props.mode = props.mode;
    }

    var startPlaceholder = 'placeholder' in props ? props.placeholder[0] : locale.lang.rangePlaceholder[0];
    var endPlaceholder = 'placeholder' in props ? props.placeholder[1] : locale.lang.rangePlaceholder[1];
    var rangeCalendarProps = (0, _propsUtil.mergeProps)(calendarProps, {
      props: {
        format: format,
        prefixCls: prefixCls,
        renderFooter: this.renderFooter,
        timePicker: props.timePicker,
        disabledDate: disabledDate,
        disabledTime: disabledTime,
        dateInputPlaceholder: [startPlaceholder, endPlaceholder],
        locale: locale.lang,
        dateRender: dateRender,
        value: showDate,
        hoverValue: hoverValue,
        showToday: showToday
      },
      on: {
        change: calendarChange,
        ok: ok,
        valueChange: this.handleShowDateChange,
        hoverChange: this.handleHoverChange,
        panelChange: panelChange,
        inputSelect: this.handleCalendarInputSelect
      },
      'class': calendarClassName,
      scopedSlots: $scopedSlots
    });
    var calendar = h(_RangeCalendar2['default'], rangeCalendarProps);

    // default width for showTime
    var pickerStyle = {};
    if (props.showTime) {
      pickerStyle.width = '350px';
    }

    var clearIcon = !props.disabled && props.allowClear && value && (value[0] || value[1]) ? h(_icon2['default'], {
      attrs: {
        type: 'cross-circle'
      },
      'class': prefixCls + '-picker-clear',
      on: {
        'click': this.clearSelection
      }
    }) : null;

    var input = function input(_ref3) {
      var inputValue = _ref3.value;

      var start = inputValue[0];
      var end = inputValue[1];
      return h(
        'span',
        { 'class': props.pickerInputClass },
        [h('input', {
          attrs: {
            disabled: props.disabled,
            readOnly: true,

            placeholder: startPlaceholder,

            tabIndex: -1
          },
          domProps: {
            'value': start && start.format(props.format) || ''
          },
          'class': prefixCls + '-range-picker-input' }), h(
          'span',
          { 'class': prefixCls + '-range-picker-separator' },
          [' ~ ']
        ), h('input', {
          attrs: {
            disabled: props.disabled,
            readOnly: true,

            placeholder: endPlaceholder,

            tabIndex: -1
          },
          domProps: {
            'value': end && end.format(props.format) || ''
          },
          'class': prefixCls + '-range-picker-input' }), clearIcon, h('span', { 'class': prefixCls + '-picker-icon' })]
      );
    };
    var vcDatePickerProps = (0, _propsUtil.mergeProps)({
      props: props,
      on: $listeners
    }, pickerChangeHandler, {
      props: {
        calendar: calendar,
        value: value,
        open: open,
        prefixCls: prefixCls + '-picker-container'
      },
      on: {
        openChange: this.handleOpenChange
      },
      style: popupStyle
    });
    return h(
      'span',
      {
        ref: 'picker',
        'class': props.pickerClass,
        style: pickerStyle,
        attrs: { tabIndex: props.disabled ? -1 : 0
        },
        on: {
          'focus': focus,
          'blur': blur
        }
      },
      [h(
        _Picker2['default'],
        vcDatePickerProps,
        [input]
      )]
    );
  }
};
module.exports = exports['default'];