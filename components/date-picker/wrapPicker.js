import { provide, inject } from 'vue';
import TimePickerPanel from '../vc-time-picker/Panel';
import classNames from '../_util/classNames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { generateShowHourMinuteSecond } from '../time-picker';
import enUS from './locale/en_US';
import { getOptionProps, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import { checkValidate, stringToMoment, momentToString } from '../_util/moment-util';

const DEFAULT_FORMAT = {
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
  week: 'gggg-wo',
  month: 'YYYY-MM',
};

const LOCALE_FORMAT_MAPPING = {
  date: 'dateFormat',
  dateTime: 'dateTimeFormat',
  week: 'weekFormat',
  month: 'monthFormat',
};

function getColumns({ showHour, showMinute, showSecond, use12Hours }) {
  let column = 0;
  if (showHour) {
    column += 1;
  }
  if (showMinute) {
    column += 1;
  }
  if (showSecond) {
    column += 1;
  }
  if (use12Hours) {
    column += 1;
  }
  return column;
}

export default function wrapPicker(Picker, props, pickerType) {
  return {
    name: Picker.name,
    inheritAttrs: false,
    props: initDefaultProps(props, {
      transitionName: 'slide-up',
      popupStyle: {},
      locale: {},
    }),
    // model: {
    //   prop: 'value',
    //   event: 'change',
    // },
    setup() {
      return {
        configProvider: inject('configProvider', ConfigConsumerProps),
      };
    },
    created() {
      provide('savePopupRef', this.savePopupRef);
    },
    mounted() {
      const { autofocus, disabled, value, defaultValue, valueFormat } = this;
      checkValidate('DatePicker', defaultValue, 'defaultValue', valueFormat);
      checkValidate('DatePicker', value, 'value', valueFormat);
      if (autofocus && !disabled) {
        this.$nextTick(() => {
          this.focus();
        });
      }
    },
    watch: {
      value(val) {
        checkValidate('DatePicker', val, 'value', this.valueFormat);
      },
    },
    methods: {
      savePicker(node) {
        this.picker = node;
      },
      getDefaultLocale() {
        const result = {
          ...enUS,
          ...this.locale,
        };
        result.lang = {
          ...result.lang,
          ...(this.locale || {}).lang,
        };
        return result;
      },

      savePopupRef(ref) {
        this.popupRef = ref;
      },
      handleOpenChange(open) {
        this.$emit('openChange', open);
      },

      handleFocus(e) {
        this.$emit('focus', e);
      },

      handleBlur(e) {
        this.$emit('blur', e);
      },

      handleMouseEnter(e) {
        this.$emit('mouseenter', e);
      },

      handleMouseLeave(e) {
        this.$emit('mouseleave', e);
      },
      handleChange(date, dateString) {
        const value = this.valueFormat ? momentToString(date, this.valueFormat) : date;
        this.$emit('update:value', value);
        this.$emit('change', value, dateString);
      },
      handleOk(val) {
        this.$emit('ok', this.valueFormat ? momentToString(val, this.valueFormat) : val);
      },
      handleCalendarChange(date, dateString) {
        this.$emit(
          'calendarChange',
          this.valueFormat ? momentToString(date, this.valueFormat) : date,
          dateString,
        );
      },
      focus() {
        this.picker.focus();
      },

      blur() {
        this.picker.blur();
      },

      transformValue(props) {
        if ('value' in props) {
          props.value = stringToMoment(props.value, this.valueFormat);
        }
        if ('defaultValue' in props) {
          props.defaultValue = stringToMoment(props.defaultValue, this.valueFormat);
        }
        if ('defaultPickerValue' in props) {
          props.defaultPickerValue = stringToMoment(props.defaultPickerValue, this.valueFormat);
        }
      },

      renderPicker(locale, localeCode) {
        const props = { ...getOptionProps(this), ...this.$attrs };
        this.transformValue(props);
        const {
          prefixCls: customizePrefixCls,
          inputPrefixCls: customizeInputPrefixCls,
          getCalendarContainer,
          size,
          showTime,
          disabled,
          format,
        } = props;
        const mergedPickerType = showTime ? `${pickerType}Time` : pickerType;
        const mergedFormat =
          format ||
          locale[LOCALE_FORMAT_MAPPING[mergedPickerType]] ||
          DEFAULT_FORMAT[mergedPickerType];

        const { getPrefixCls, getPopupContainer: getContextPopupContainer } = this.configProvider;
        const getPopupContainer = getCalendarContainer || getContextPopupContainer;
        const prefixCls = getPrefixCls('calendar', customizePrefixCls);
        const inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

        const pickerClass = classNames(`${prefixCls}-picker`, {
          [`${prefixCls}-picker-${size}`]: !!size,
        });
        const pickerInputClass = classNames(`${prefixCls}-picker-input`, inputPrefixCls, {
          [`${inputPrefixCls}-lg`]: size === 'large',
          [`${inputPrefixCls}-sm`]: size === 'small',
          [`${inputPrefixCls}-disabled`]: disabled,
        });

        const timeFormat = (showTime && showTime.format) || 'HH:mm:ss';
        const vcTimePickerProps = {
          ...generateShowHourMinuteSecond(timeFormat),
          format: timeFormat,
          use12Hours: showTime && showTime.use12Hours,
        };
        const columns = getColumns(vcTimePickerProps);
        const timePickerCls = `${prefixCls}-time-picker-column-${columns}`;
        const timePickerPanelProps = {
          ...vcTimePickerProps,
          ...showTime,
          prefixCls: `${prefixCls}-time-picker`,
          placeholder: locale.timePickerLocale.placeholder,
          transitionName: 'slide-up',
          class: timePickerCls,
          onEsc: () => {},
        };
        const timePicker = showTime ? <TimePickerPanel {...timePickerPanelProps} /> : null;
        const pickerProps = {
          ...props,
          getCalendarContainer: getPopupContainer,
          format: mergedFormat,
          pickerClass,
          pickerInputClass,
          locale,
          localeCode,
          timePicker,
          onOpenChange: this.handleOpenChange,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          onMouseenter: this.handleMouseEnter,
          onMouseleave: this.handleMouseLeave,
          onChange: this.handleChange,
          onOk: this.handleOk,
          onCalendarChange: this.handleCalendarChange,
          ref: this.savePicker,
        };
        return <Picker {...pickerProps} vSlots={this.$slots} />;
      },
    },

    render() {
      return (
        <LocaleReceiver
          componentName="DatePicker"
          defaultLocale={this.getDefaultLocale}
          children={this.renderPicker}
        />
      );
    },
  };
}
