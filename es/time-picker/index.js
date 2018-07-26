import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

import * as moment from 'moment';
import VcTimePicker from '../vc-time-picker';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from './locale/en_US';
import BaseMixin from '../_util/BaseMixin';
import PropTypes from '../_util/vue-types';
import interopDefault from '../_util/interopDefault';
import { initDefaultProps, hasProp, getOptionProps, getComponentFromProp } from '../_util/props-util';

export function generateShowHourMinuteSecond(format) {
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
var MomentType = PropTypes.custom(isMoment);
export var TimePickerProps = function TimePickerProps() {
  return {
    size: PropTypes.oneOf(['large', 'default', 'small']),
    value: MomentType,
    defaultValue: MomentType,
    open: PropTypes.bool,
    format: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    prefixCls: PropTypes.string,
    hideDisabledOptions: PropTypes.bool,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    getPopupContainer: PropTypes.func,
    use12Hours: PropTypes.bool,
    focusOnOpen: PropTypes.bool,
    hourStep: PropTypes.number,
    minuteStep: PropTypes.number,
    secondStep: PropTypes.number,
    allowEmpty: PropTypes.bool,
    inputReadOnly: PropTypes.bool,
    clearText: PropTypes.string,
    defaultOpenValue: PropTypes.object,
    popupClassName: PropTypes.string,
    align: PropTypes.object,
    placement: PropTypes.any,
    transitionName: PropTypes.string,
    autoFocus: PropTypes.bool,
    addon: PropTypes.any
  };
};

export default {
  name: 'ATimePicker',
  mixins: [BaseMixin],
  props: initDefaultProps(TimePickerProps(), {
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
    if (value && !interopDefault(moment).isMoment(value)) {
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
      if (!hasProp(this, 'value')) {
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

      var props = getOptionProps(this);
      delete props.defaultValue;

      var format = this.getDefaultFormat();
      var className = _defineProperty({}, props.prefixCls + '-' + props.size, !!props.size);
      var tempAddon = getComponentFromProp(this, 'addon');
      var timeProps = {
        props: _extends({}, generateShowHourMinuteSecond(format), props, {
          format: format,
          value: this.sValue,
          placeholder: props.placeholder === undefined ? locale.placeholder : props.placeholder
        }),
        'class': className,
        ref: 'timePicker',
        on: _extends({}, this.$listeners, {
          change: this.handleChange,
          open: this.handleOpenClose,
          close: this.handleOpenClose
        })
      };
      return h(
        VcTimePicker,
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

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'TimePicker',
        defaultLocale: defaultLocale,
        children: this.renderTimePicker
      }
    });
  }
};