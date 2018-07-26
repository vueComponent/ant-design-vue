'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var formatOption = function formatOption(option, disabledOptions) {
  var value = '' + option;
  if (option < 10) {
    value = '0' + option;
  }

  var disabled = false;
  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
    disabled = true;
  }

  return {
    value: value,
    disabled: disabled
  };
};

var Combobox = {
  mixins: [_BaseMixin2['default']],
  name: 'Combobox',
  props: {
    format: _vueTypes2['default'].string,
    defaultOpenValue: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    value: _vueTypes2['default'].object,
    // onChange: PropTypes.func,
    showHour: _vueTypes2['default'].bool,
    showMinute: _vueTypes2['default'].bool,
    showSecond: _vueTypes2['default'].bool,
    hourOptions: _vueTypes2['default'].array,
    minuteOptions: _vueTypes2['default'].array,
    secondOptions: _vueTypes2['default'].array,
    disabledHours: _vueTypes2['default'].func,
    disabledMinutes: _vueTypes2['default'].func,
    disabledSeconds: _vueTypes2['default'].func,
    // onCurrentSelectPanelChange: PropTypes.func,
    use12Hours: _vueTypes2['default'].bool,
    isAM: _vueTypes2['default'].bool
  },
  methods: {
    onItemChange: function onItemChange(type, itemValue) {
      var defaultOpenValue = this.defaultOpenValue,
          use12Hours = this.use12Hours,
          isAM = this.isAM;

      var value = (this.value || defaultOpenValue).clone();

      if (type === 'hour') {
        if (use12Hours) {
          if (isAM) {
            value.hour(+itemValue % 12);
          } else {
            value.hour(+itemValue % 12 + 12);
          }
        } else {
          value.hour(+itemValue);
        }
      } else if (type === 'minute') {
        value.minute(+itemValue);
      } else if (type === 'ampm') {
        var ampm = itemValue.toUpperCase();
        if (use12Hours) {
          if (ampm === 'PM' && value.hour() < 12) {
            value.hour(value.hour() % 12 + 12);
          }

          if (ampm === 'AM') {
            if (value.hour() >= 12) {
              value.hour(value.hour() - 12);
            }
          }
        }
      } else {
        value.second(+itemValue);
      }
      this.__emit('change', value);
    },
    onEnterSelectPanel: function onEnterSelectPanel(range) {
      this.__emit('currentSelectPanelChange', range);
    },
    getHourSelect: function getHourSelect(hour) {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          hourOptions = this.hourOptions,
          disabledHours = this.disabledHours,
          showHour = this.showHour,
          use12Hours = this.use12Hours;

      if (!showHour) {
        return null;
      }
      var disabledOptions = disabledHours();
      var hourOptionsAdj = void 0;
      var hourAdj = void 0;
      if (use12Hours) {
        hourOptionsAdj = [12].concat(hourOptions.filter(function (h) {
          return h < 12 && h > 0;
        }));
        hourAdj = hour % 12 || 12;
      } else {
        hourOptionsAdj = hourOptions;
        hourAdj = hour;
      }

      return h(_Select2['default'], {
        attrs: {
          prefixCls: prefixCls,
          options: hourOptionsAdj.map(function (option) {
            return formatOption(option, disabledOptions);
          }),
          selectedIndex: hourOptionsAdj.indexOf(hourAdj),
          type: 'hour'
        },
        on: {
          'select': this.onItemChange,
          'mouseenter': this.onEnterSelectPanel.bind(this, 'hour')
        }
      });
    },
    getMinuteSelect: function getMinuteSelect(minute) {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          minuteOptions = this.minuteOptions,
          disabledMinutes = this.disabledMinutes,
          defaultOpenValue = this.defaultOpenValue,
          showMinute = this.showMinute;

      if (!showMinute) {
        return null;
      }
      var value = this.value || defaultOpenValue;
      var disabledOptions = disabledMinutes(value.hour());

      return h(_Select2['default'], {
        attrs: {
          prefixCls: prefixCls,
          options: minuteOptions.map(function (option) {
            return formatOption(option, disabledOptions);
          }),
          selectedIndex: minuteOptions.indexOf(minute),
          type: 'minute'
        },
        on: {
          'select': this.onItemChange,
          'mouseenter': this.onEnterSelectPanel.bind(this, 'minute')
        }
      });
    },
    getSecondSelect: function getSecondSelect(second) {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          secondOptions = this.secondOptions,
          disabledSeconds = this.disabledSeconds,
          showSecond = this.showSecond,
          defaultOpenValue = this.defaultOpenValue;

      if (!showSecond) {
        return null;
      }
      var value = this.value || defaultOpenValue;
      var disabledOptions = disabledSeconds(value.hour(), value.minute());

      return h(_Select2['default'], {
        attrs: {
          prefixCls: prefixCls,
          options: secondOptions.map(function (option) {
            return formatOption(option, disabledOptions);
          }),
          selectedIndex: secondOptions.indexOf(second),
          type: 'second'
        },
        on: {
          'select': this.onItemChange,
          'mouseenter': this.onEnterSelectPanel.bind(this, 'second')
        }
      });
    },
    getAMPMSelect: function getAMPMSelect() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          use12Hours = this.use12Hours,
          format = this.format,
          isAM = this.isAM;

      if (!use12Hours) {
        return null;
      }

      var AMPMOptions = ['am', 'pm'] // If format has A char, then we should uppercase AM/PM
      .map(function (c) {
        return format.match(/\sA/) ? c.toUpperCase() : c;
      }).map(function (c) {
        return { value: c };
      });

      var selected = isAM ? 0 : 1;

      return h(_Select2['default'], {
        attrs: {
          prefixCls: prefixCls,
          options: AMPMOptions,
          selectedIndex: selected,
          type: 'ampm'
        },
        on: {
          'select': this.onItemChange,
          'mouseenter': this.onEnterSelectPanel.bind(this, 'ampm')
        }
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        defaultOpenValue = this.defaultOpenValue;

    var value = this.value || defaultOpenValue;
    return h(
      'div',
      { 'class': prefixCls + '-combobox' },
      [this.getHourSelect(value.hour()), this.getMinuteSelect(value.minute()), this.getSecondSelect(value.second()), this.getAMPMSelect(value.hour())]
    );
  }
};

exports['default'] = Combobox;
module.exports = exports['default'];