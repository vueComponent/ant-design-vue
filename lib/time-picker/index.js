'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimePickerProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.generateShowHourMinuteSecond = generateShowHourMinuteSecond;

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _vcTimePicker = require('../vc-time-picker');

var _vcTimePicker2 = _interopRequireDefault(_vcTimePicker);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _propsUtil = require('../_util/props-util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function generateShowHourMinuteSecond(format) {
  // Ref: http://momentjs.com/docs/#/parsing/string-format/
  return {
    showHour: format.indexOf('H') > -1 || format.indexOf('h') > -1 || format.indexOf('k') > -1,
    showMinute: format.indexOf('m') > -1,
    showSecond: format.indexOf('s') > -1
  };
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
var TimePickerProps = exports.TimePickerProps = function TimePickerProps() {
  return {
    size: _vueTypes2['default'].oneOf(['large', 'default', 'small']),
    value: MomentType,
    defaultValue: MomentType,
    open: _vueTypes2['default'].bool,
    format: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool,
    placeholder: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    hideDisabledOptions: _vueTypes2['default'].bool,
    disabledHours: _vueTypes2['default'].func,
    disabledMinutes: _vueTypes2['default'].func,
    disabledSeconds: _vueTypes2['default'].func,
    getPopupContainer: _vueTypes2['default'].func,
    use12Hours: _vueTypes2['default'].bool,
    focusOnOpen: _vueTypes2['default'].bool,
    hourStep: _vueTypes2['default'].number,
    minuteStep: _vueTypes2['default'].number,
    secondStep: _vueTypes2['default'].number,
    allowEmpty: _vueTypes2['default'].bool,
    inputReadOnly: _vueTypes2['default'].bool,
    clearText: _vueTypes2['default'].string,
    defaultOpenValue: _vueTypes2['default'].object,
    popupClassName: _vueTypes2['default'].string,
    align: _vueTypes2['default'].object,
    placement: _vueTypes2['default'].any,
    transitionName: _vueTypes2['default'].string,
    autoFocus: _vueTypes2['default'].bool,
    addon: _vueTypes2['default'].any
  };
};

exports['default'] = {
  name: 'ATimePicker',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(TimePickerProps(), {
    prefixCls: 'ant-time-picker',
    align: {
      offset: [0, -2]
    },
    disabled: false,
    disabledHours: undefined,
    disabledMinutes: undefined,
    disabledSeconds: undefined,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    transitionName: 'slide-up',
    focusOnOpen: true
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    var value = this.value || this.defaultValue;
    if (value && !(0, _interopDefault2['default'])(moment).isMoment(value)) {
      throw new Error('The value/defaultValue of TimePicker must be a moment object, ');
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
    handleChange: function handleChange(value) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({ sValue: value });
      }
      var _format = this.format,
          format = _format === undefined ? 'HH:mm:ss' : _format;

      this.$emit('change', value, value && value.format(format) || '');
    },
    handleOpenClose: function handleOpenClose(_ref) {
      var open = _ref.open;

      this.$emit('openChange', open);
      this.$emit('update:open', open);
    },
    focus: function focus() {
      this.$refs.timePicker.focus();
    },
    blur: function blur() {
      this.$refs.timePicker.blur();
    },
    getDefaultFormat: function getDefaultFormat() {
      var format = this.format,
          use12Hours = this.use12Hours;

      if (format) {
        return format;
      } else if (use12Hours) {
        return 'h:mm:ss a';
      }
      return 'HH:mm:ss';
    },
    renderTimePicker: function renderTimePicker(locale) {
      var h = this.$createElement;

      var props = (0, _propsUtil.getOptionProps)(this);
      delete props.defaultValue;

      var format = this.getDefaultFormat();
      var className = (0, _defineProperty3['default'])({}, props.prefixCls + '-' + props.size, !!props.size);
      var tempAddon = (0, _propsUtil.getComponentFromProp)(this, 'addon');
      var timeProps = {
        props: (0, _extends3['default'])({}, generateShowHourMinuteSecond(format), props, {
          format: format,
          value: this.sValue,
          placeholder: props.placeholder === undefined ? locale.placeholder : props.placeholder
        }),
        'class': className,
        ref: 'timePicker',
        on: (0, _extends3['default'])({}, this.$listeners, {
          change: this.handleChange,
          open: this.handleOpenClose,
          close: this.handleOpenClose
        })
      };
      return h(
        _vcTimePicker2['default'],
        timeProps,
        [tempAddon ? h(
          'template',
          { slot: 'addon' },
          [h(
            'div',
            { 'class': props.prefixCls + '-panel-addon' },
            [tempAddon]
          )]
        ) : null]
      );
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'TimePicker',
        defaultLocale: _en_US2['default'],
        children: this.renderTimePicker
      }
    });
  }
};