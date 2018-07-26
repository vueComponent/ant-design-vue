'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Header = {
  mixins: [_BaseMixin2['default']],
  props: {
    format: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    disabledDate: _vueTypes2['default'].func,
    placeholder: _vueTypes2['default'].string,
    clearText: _vueTypes2['default'].string,
    value: _vueTypes2['default'].object,
    inputReadOnly: _vueTypes2['default'].bool.def(false),
    hourOptions: _vueTypes2['default'].array,
    minuteOptions: _vueTypes2['default'].array,
    secondOptions: _vueTypes2['default'].array,
    disabledHours: _vueTypes2['default'].func,
    disabledMinutes: _vueTypes2['default'].func,
    disabledSeconds: _vueTypes2['default'].func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    // onEsc: PropTypes.func,
    allowEmpty: _vueTypes2['default'].bool,
    defaultOpenValue: _vueTypes2['default'].object,
    currentSelectPanel: _vueTypes2['default'].string,
    focusOnOpen: _vueTypes2['default'].bool,
    // onKeyDown: PropTypes.func,
    showStr: _vueTypes2['default'].bool.def(true)
  },
  data: function data() {
    var value = this.value,
        format = this.format;

    return {
      str: value && value.format(format) || '',
      invalid: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (this.focusOnOpen) {
      // Wait one frame for the panel to be positioned before focusing
      var requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
      requestAnimationFrame(function () {
        _this.$refs.input.focus();
        _this.$refs.input.select();
      });
    }
  },

  watch: {
    '$props': {
      handler: function handler(nextProps) {
        var value = nextProps.value,
            format = nextProps.format;

        this.setState({
          str: value && value.format(format) || '',
          invalid: false
        });
      },
      deep: true
    }
  },

  methods: {
    onInputChange: function onInputChange(event) {
      var str = event.target.value;
      this.showStr = true;
      this.setState({
        str: str
      });
      var format = this.format,
          hourOptions = this.hourOptions,
          minuteOptions = this.minuteOptions,
          secondOptions = this.secondOptions,
          disabledHours = this.disabledHours,
          disabledMinutes = this.disabledMinutes,
          disabledSeconds = this.disabledSeconds,
          allowEmpty = this.allowEmpty,
          originalValue = this.value;


      if (str) {
        var value = this.getProtoValue().clone();
        var parsed = (0, _moment2['default'])(str, format, true);
        if (!parsed.isValid()) {
          this.setState({
            invalid: true
          });
          return;
        }
        value.hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

        // if time value not allowed, response warning.
        if (hourOptions.indexOf(value.hour()) < 0 || minuteOptions.indexOf(value.minute()) < 0 || secondOptions.indexOf(value.second()) < 0) {
          this.setState({
            invalid: true
          });
          return;
        }

        // if time value is disabled, response warning.
        var disabledHourOptions = disabledHours();
        var disabledMinuteOptions = disabledMinutes(value.hour());
        var disabledSecondOptions = disabledSeconds(value.hour(), value.minute());
        if (disabledHourOptions && disabledHourOptions.indexOf(value.hour()) >= 0 || disabledMinuteOptions && disabledMinuteOptions.indexOf(value.minute()) >= 0 || disabledSecondOptions && disabledSecondOptions.indexOf(value.second()) >= 0) {
          this.setState({
            invalid: true
          });
          return;
        }

        if (originalValue) {
          if (originalValue.hour() !== value.hour() || originalValue.minute() !== value.minute() || originalValue.second() !== value.second()) {
            // keep other fields for rc-calendar
            var changedValue = originalValue.clone();
            changedValue.hour(value.hour());
            changedValue.minute(value.minute());
            changedValue.second(value.second());
            this.__emit('change', changedValue);
          }
        } else if (originalValue !== value) {
          this.__emit('change', value);
        }
      } else if (allowEmpty) {
        this.__emit('change', null);
      } else {
        this.setState({
          invalid: true
        });
        return;
      }

      this.setState({
        invalid: false
      });
    },
    onKeyDown: function onKeyDown(e) {
      if (e.keyCode === 27) {
        this.__emit('esc');
      }
      this.__emit('keydown', e);
    },
    onClear: function onClear() {
      this.__emit('clear');
      this.setState({ str: '' });
    },
    getClearButton: function getClearButton() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          allowEmpty = this.allowEmpty,
          clearText = this.clearText;

      if (!allowEmpty) {
        return null;
      }
      return h('a', {
        'class': prefixCls + '-clear-btn',
        attrs: { role: 'button',
          title: clearText
        },
        on: {
          'mousedown': this.onClear
        }
      });
    },
    getProtoValue: function getProtoValue() {
      return this.value || this.defaultOpenValue;
    },
    getInput: function getInput() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          placeholder = this.placeholder,
          inputReadOnly = this.inputReadOnly,
          invalid = this.invalid,
          str = this.str,
          showStr = this.showStr;

      var invalidClass = invalid ? prefixCls + '-input-invalid' : '';
      return h('input', {
        'class': prefixCls + '-input  ' + invalidClass,
        ref: 'input',
        on: {
          'keydown': this.onKeyDown,
          'input': this.onInputChange
        },
        domProps: {
          'value': showStr ? str : ''
        },
        attrs: {
          placeholder: placeholder,

          readOnly: !!inputReadOnly
        }
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls;

    return h(
      'div',
      { 'class': prefixCls + '-input-wrap' },
      [this.getInput(), this.getClearButton()]
    );
  }
};

exports['default'] = Header;
module.exports = exports['default'];