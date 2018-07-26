'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Combobox = require('./Combobox');

var _Combobox2 = _interopRequireDefault(_Combobox);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function generateOptions(length, disabledOptions, hideDisabledOptions) {
  var step = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  var arr = [];
  for (var value = 0; value < length; value += step) {
    if (!disabledOptions || disabledOptions.indexOf(value) < 0 || !hideDisabledOptions) {
      arr.push(value);
    }
  }
  return arr;
}
var Panel = {
  mixins: [_BaseMixin2['default']],
  props: {
    clearText: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string.def('rc-time-picker-panel'),
    defaultOpenValue: {
      type: Object,
      'default': function _default() {
        return (0, _moment2['default'])();
      }
    },
    value: _vueTypes2['default'].any,
    defaultValue: _vueTypes2['default'].any,
    placeholder: _vueTypes2['default'].string,
    format: _vueTypes2['default'].string,
    inputReadOnly: _vueTypes2['default'].bool.def(false),
    disabledHours: _vueTypes2['default'].func.def(noop),
    disabledMinutes: _vueTypes2['default'].func.def(noop),
    disabledSeconds: _vueTypes2['default'].func.def(noop),
    hideDisabledOptions: _vueTypes2['default'].bool,
    // onChange: PropTypes.func,
    // onEsc: PropTypes.func,
    allowEmpty: _vueTypes2['default'].bool,
    showHour: _vueTypes2['default'].bool,
    showMinute: _vueTypes2['default'].bool,
    showSecond: _vueTypes2['default'].bool,
    // onClear: PropTypes.func,
    use12Hours: _vueTypes2['default'].bool.def(false),
    hourStep: _vueTypes2['default'].number,
    minuteStep: _vueTypes2['default'].number,
    secondStep: _vueTypes2['default'].number,
    focusOnOpen: _vueTypes2['default'].bool
    // onKeydown: PropTypes.func,
  },
  data: function data() {
    return {
      sValue: this.value,
      selectionRange: [],
      currentSelectPanel: '',
      showStr: true
    };
  },

  watch: {
    value: function value(val) {
      if (val) {
        this.setState({
          sValue: val,
          showStr: true
        });
      } else {
        this.setState({
          showStr: false
        });
      }
    }
  },

  methods: {
    onChange: function onChange(newValue) {
      this.setState({ sValue: newValue });
      this.__emit('change', newValue);
    },
    onCurrentSelectPanelChange: function onCurrentSelectPanelChange(currentSelectPanel) {
      this.setState({ currentSelectPanel: currentSelectPanel });
    },


    // https://github.com/ant-design/ant-design/issues/5829
    close: function close() {
      this.__emit('esc');
    },
    disabledHours2: function disabledHours2() {
      var use12Hours = this.use12Hours,
          disabledHours = this.disabledHours;

      var disabledOptions = disabledHours();
      if (use12Hours && Array.isArray(disabledOptions)) {
        if (this.isAM()) {
          disabledOptions = disabledOptions.filter(function (h) {
            return h < 12;
          }).map(function (h) {
            return h === 0 ? 12 : h;
          });
        } else {
          disabledOptions = disabledOptions.map(function (h) {
            return h === 12 ? 12 : h - 12;
          });
        }
      }
      return disabledOptions;
    },
    isAM: function isAM() {
      var value = this.sValue || this.defaultOpenValue;
      return value.hour() >= 0 && value.hour() < 12;
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        placeholder = this.placeholder,
        disabledMinutes = this.disabledMinutes,
        disabledSeconds = this.disabledSeconds,
        hideDisabledOptions = this.hideDisabledOptions,
        allowEmpty = this.allowEmpty,
        showHour = this.showHour,
        showMinute = this.showMinute,
        showSecond = this.showSecond,
        format = this.format,
        defaultOpenValue = this.defaultOpenValue,
        clearText = this.clearText,
        use12Hours = this.use12Hours,
        focusOnOpen = this.focusOnOpen,
        hourStep = this.hourStep,
        minuteStep = this.minuteStep,
        secondStep = this.secondStep,
        inputReadOnly = this.inputReadOnly,
        sValue = this.sValue,
        currentSelectPanel = this.currentSelectPanel,
        showStr = this.showStr,
        _$listeners = this.$listeners,
        $listeners = _$listeners === undefined ? {} : _$listeners;
    var _$listeners$esc = $listeners.esc,
        esc = _$listeners$esc === undefined ? noop : _$listeners$esc,
        _$listeners$clear = $listeners.clear,
        clear = _$listeners$clear === undefined ? noop : _$listeners$clear,
        _$listeners$keydown = $listeners.keydown,
        keydown = _$listeners$keydown === undefined ? noop : _$listeners$keydown;


    var disabledHourOptions = this.disabledHours2();
    var disabledMinuteOptions = disabledMinutes(sValue ? sValue.hour() : null);
    var disabledSecondOptions = disabledSeconds(sValue ? sValue.hour() : null, sValue ? sValue.minute() : null);
    var hourOptions = generateOptions(24, disabledHourOptions, hideDisabledOptions, hourStep);
    var minuteOptions = generateOptions(60, disabledMinuteOptions, hideDisabledOptions, minuteStep);
    var secondOptions = generateOptions(60, disabledSecondOptions, hideDisabledOptions, secondStep);

    return h(
      'div',
      { 'class': prefixCls + '-inner' },
      [h(_Header2['default'], {
        attrs: {
          clearText: clearText,
          prefixCls: prefixCls,
          defaultOpenValue: defaultOpenValue,
          value: sValue,
          currentSelectPanel: currentSelectPanel,

          format: format,
          placeholder: placeholder,
          hourOptions: hourOptions,
          minuteOptions: minuteOptions,
          secondOptions: secondOptions,
          disabledHours: this.disabledHours2,
          disabledMinutes: disabledMinutes,
          disabledSeconds: disabledSeconds,

          allowEmpty: allowEmpty,
          focusOnOpen: focusOnOpen,

          inputReadOnly: inputReadOnly,
          showStr: showStr
        },
        on: {
          'esc': esc,
          'change': this.onChange,
          'clear': clear,
          'keydown': keydown
        }
      }), h(_Combobox2['default'], {
        attrs: {
          prefixCls: prefixCls,
          value: sValue,
          defaultOpenValue: defaultOpenValue,
          format: format,

          showHour: showHour,
          showMinute: showMinute,
          showSecond: showSecond,
          hourOptions: hourOptions,
          minuteOptions: minuteOptions,
          secondOptions: secondOptions,
          disabledHours: this.disabledHours2,
          disabledMinutes: disabledMinutes,
          disabledSeconds: disabledSeconds,

          use12Hours: use12Hours,
          isAM: this.isAM()
        },
        on: {
          'change': this.onChange,
          'currentSelectPanelChange': this.onCurrentSelectPanelChange
        }
      }), this.$slots['default']]
    );
  }
};

exports['default'] = Panel;
module.exports = exports['default'];