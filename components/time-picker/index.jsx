import * as moment from 'moment';
import VcTimePicker from '../vc-time-picker';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from './locale/en_US';
import BaseMixin from '../_util/BaseMixin';
import PropTypes from '../_util/vue-types';
import Icon from '../icon';
import interopDefault from '../_util/interopDefault';
import {
  initDefaultProps,
  hasProp,
  getOptionProps,
  getComponentFromProp,
  isValidElement,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';

export function generateShowHourMinuteSecond(format) {
  // Ref: http://momentjs.com/docs/#/parsing/string-format/
  return {
    showHour: format.indexOf('H') > -1 || format.indexOf('h') > -1 || format.indexOf('k') > -1,
    showMinute: format.indexOf('m') > -1,
    showSecond: format.indexOf('s') > -1,
  };
}
function isMoment(value) {
  if (Array.isArray(value)) {
    return (
      value.length === 0 || value.findIndex(val => val === undefined || moment.isMoment(val)) !== -1
    );
  } else {
    return value === undefined || moment.isMoment(value);
  }
}
const MomentType = PropTypes.custom(isMoment);
export const TimePickerProps = () => ({
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
  suffixIcon: PropTypes.any,
  align: PropTypes.object,
  placement: PropTypes.any,
  transitionName: PropTypes.string,
  autoFocus: PropTypes.bool,
  addon: PropTypes.any,
});

const TimePicker = {
  name: 'ATimePicker',
  mixins: [BaseMixin],
  props: initDefaultProps(TimePickerProps(), {
    prefixCls: 'ant-time-picker',
    align: {
      offset: [0, -2],
    },
    disabled: false,
    disabledHours: undefined,
    disabledMinutes: undefined,
    disabledSeconds: undefined,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    transitionName: 'slide-up',
    focusOnOpen: true,
  }),
  model: {
    prop: 'value',
    event: 'change',
  },
  inject: {
    configProvider: { default: () => ({}) },
  },
  data() {
    const value = this.value || this.defaultValue;
    if (value && !interopDefault(moment).isMoment(value)) {
      throw new Error('The value/defaultValue of TimePicker must be a moment object, ');
    }
    return {
      sValue: value,
    };
  },
  watch: {
    value(val) {
      this.setState({ sValue: val });
    },
  },
  methods: {
    handleChange(value) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      const { format = 'HH:mm:ss' } = this;
      this.$emit('change', value, (value && value.format(format)) || '');
    },

    handleOpenClose({ open }) {
      this.$emit('openChange', open);
      this.$emit('update:open', open);
    },

    focus() {
      this.$refs.timePicker.focus();
    },

    blur() {
      this.$refs.timePicker.blur();
    },

    getDefaultFormat() {
      const { format, use12Hours } = this;
      if (format) {
        return format;
      } else if (use12Hours) {
        return 'h:mm:ss a';
      }
      return 'HH:mm:ss';
    },

    renderTimePicker(locale) {
      const props = getOptionProps(this);
      delete props.defaultValue;

      const format = this.getDefaultFormat();
      const className = {
        [`${props.prefixCls}-${props.size}`]: !!props.size,
      };
      const tempAddon = getComponentFromProp(this, 'addon', {}, false);
      const addon = panel => {
        return tempAddon ? (
          <div class={`${props.prefixCls}-panel-addon`}>
            {typeof tempAddon === 'function' ? tempAddon(panel) : tempAddon}
          </div>
        ) : null;
      };
      const { prefixCls, getPopupContainer } = props;
      let suffixIcon = getComponentFromProp(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      const clockIcon = (suffixIcon &&
        (isValidElement(suffixIcon) ? (
          cloneElement(suffixIcon, {
            class: `${prefixCls}-clock-icon`,
          })
        ) : (
          <span class={`${prefixCls}-clock-icon`}>{suffixIcon}</span>
        ))) || <Icon type="clock-circle" class={`${prefixCls}-clock-icon`} theme="outlined" />;

      const inputIcon = <span class={`${prefixCls}-icon`}>{clockIcon}</span>;

      const clearIcon = (
        <Icon type="close-circle" class={`${prefixCls}-panel-clear-btn-icon`} theme="filled" />
      );
      const { getPopupContainer: getContextPopupContainer } = this.configProvider;
      const timeProps = {
        props: {
          ...generateShowHourMinuteSecond(format),
          ...props,
          getPopupContainer: getPopupContainer || getContextPopupContainer,
          format,
          value: this.sValue,
          placeholder: props.placeholder === undefined ? locale.placeholder : props.placeholder,
          addon,
          inputIcon,
          clearIcon,
        },
        class: className,
        ref: 'timePicker',
        on: {
          ...this.$listeners,
          change: this.handleChange,
          open: this.handleOpenClose,
          close: this.handleOpenClose,
        },
      };
      return <VcTimePicker {...timeProps} />;
    },
  },

  render() {
    return (
      <LocaleReceiver
        componentName="TimePicker"
        defaultLocale={defaultLocale}
        scopedSlots={{ default: this.renderTimePicker }}
      />
    );
  },
};

/* istanbul ignore next */
TimePicker.install = function(Vue) {
  Vue.component(TimePicker.name, TimePicker);
};

export default TimePicker;
