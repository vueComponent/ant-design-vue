import omit from 'omit.js';
import VcTimePicker from '../vc-time-picker';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import BaseMixin from '../_util/BaseMixin';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import Icon from '../icon';
import enUS from './locale/en_US';
import {
  initDefaultProps,
  hasProp,
  getOptionProps,
  getComponentFromProp,
  isValidElement,
  getListeners,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';
import {
  checkValidate,
  stringToMoment,
  momentToString,
  TimeOrTimesType,
} from '../_util/moment-util';

export function generateShowHourMinuteSecond(format) {
  // Ref: http://momentjs.com/docs/#/parsing/string-format/
  return {
    showHour: format.indexOf('H') > -1 || format.indexOf('h') > -1 || format.indexOf('k') > -1,
    showMinute: format.indexOf('m') > -1,
    showSecond: format.indexOf('s') > -1,
  };
}

export const TimePickerProps = () => ({
  size: PropTypes.oneOf(['large', 'default', 'small']),
  value: TimeOrTimesType,
  defaultValue: TimeOrTimesType,
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
  allowClear: PropTypes.bool,
  inputReadOnly: PropTypes.bool,
  clearText: PropTypes.string,
  defaultOpenValue: PropTypes.object,
  popupClassName: PropTypes.string,
  popupStyle: PropTypes.object,
  suffixIcon: PropTypes.any,
  align: PropTypes.object,
  placement: PropTypes.any,
  transitionName: PropTypes.string,
  autoFocus: PropTypes.bool,
  addon: PropTypes.any,
  clearIcon: PropTypes.any,
  locale: PropTypes.object,
  valueFormat: PropTypes.string,
});

const TimePicker = {
  name: 'ATimePicker',
  mixins: [BaseMixin],
  props: initDefaultProps(TimePickerProps(), {
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
    allowClear: true,
  }),
  model: {
    prop: 'value',
    event: 'change',
  },
  provide() {
    return {
      savePopupRef: this.savePopupRef,
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const { value, defaultValue, valueFormat } = this;

    checkValidate('TimePicker', defaultValue, 'defaultValue', valueFormat);
    checkValidate('TimePicker', value, 'value', valueFormat);
    warning(
      !hasProp(this, 'allowEmpty'),
      'TimePicker',
      '`allowEmpty` is deprecated. Please use `allowClear` instead.',
    );
    return {
      sValue: stringToMoment(value || defaultValue, valueFormat),
    };
  },
  watch: {
    value(val) {
      checkValidate('TimePicker', val, 'value', this.valueFormat);
      this.setState({ sValue: stringToMoment(val, this.valueFormat) });
    },
  },
  methods: {
    getDefaultFormat() {
      const { format, use12Hours } = this;
      if (format) {
        return format;
      } else if (use12Hours) {
        return 'h:mm:ss a';
      }
      return 'HH:mm:ss';
    },

    getAllowClear() {
      const { allowClear, allowEmpty } = this.$props;
      if (hasProp(this, 'allowClear')) {
        return allowClear;
      }
      return allowEmpty;
    },
    getDefaultLocale() {
      const defaultLocale = {
        ...enUS,
        ...this.$props.locale,
      };
      return defaultLocale;
    },
    savePopupRef(ref) {
      this.popupRef = ref;
    },
    handleChange(value) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      const { format = 'HH:mm:ss' } = this;
      this.$emit(
        'change',
        this.valueFormat ? momentToString(value, this.valueFormat) : value,
        (value && value.format(format)) || '',
      );
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

    renderInputIcon(prefixCls) {
      let suffixIcon = getComponentFromProp(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      const clockIcon = (suffixIcon &&
        isValidElement(suffixIcon) &&
        cloneElement(suffixIcon, {
          class: `${prefixCls}-clock-icon`,
        })) || <Icon type="clock-circle" class={`${prefixCls}-clock-icon`} />;

      return <span class={`${prefixCls}-icon`}>{clockIcon}</span>;
    },

    renderClearIcon(prefixCls) {
      const clearIcon = getComponentFromProp(this, 'clearIcon');
      const clearIconPrefixCls = `${prefixCls}-clear`;

      if (clearIcon && isValidElement(clearIcon)) {
        return cloneElement(clearIcon, {
          class: clearIconPrefixCls,
        });
      }

      return <Icon type="close-circle" class={clearIconPrefixCls} theme="filled" />;
    },

    renderTimePicker(locale) {
      let props = getOptionProps(this);
      props = omit(props, ['defaultValue', 'suffixIcon', 'allowEmpty', 'allowClear']);

      const { prefixCls: customizePrefixCls, getPopupContainer, placeholder, size } = props;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('time-picker', customizePrefixCls);

      const format = this.getDefaultFormat();
      const pickerClassName = {
        [`${prefixCls}-${size}`]: !!size,
      };
      const tempAddon = getComponentFromProp(this, 'addon', {}, false);
      const pickerAddon = panel => {
        return tempAddon ? (
          <div class={`${prefixCls}-panel-addon`}>
            {typeof tempAddon === 'function' ? tempAddon(panel) : tempAddon}
          </div>
        ) : null;
      };
      const inputIcon = this.renderInputIcon(prefixCls);
      const clearIcon = this.renderClearIcon(prefixCls);
      const { getPopupContainer: getContextPopupContainer } = this.configProvider;
      const timeProps = {
        props: {
          ...generateShowHourMinuteSecond(format),
          ...props,
          allowEmpty: this.getAllowClear(),
          prefixCls,
          getPopupContainer: getPopupContainer || getContextPopupContainer,
          format,
          value: this.sValue,
          placeholder: placeholder === undefined ? locale.placeholder : placeholder,
          addon: pickerAddon,
          inputIcon,
          clearIcon,
        },
        class: pickerClassName,
        ref: 'timePicker',
        on: {
          ...getListeners(this),
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
        defaultLocale={this.getDefaultLocale()}
        scopedSlots={{ default: this.renderTimePicker }}
      />
    );
  },
};

/* istanbul ignore next */
TimePicker.install = function(Vue) {
  Vue.use(Base);
  Vue.component(TimePicker.name, TimePicker);
};

export default TimePicker;
