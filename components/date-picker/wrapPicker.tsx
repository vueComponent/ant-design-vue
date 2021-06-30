import type { DefineComponent } from 'vue';
import { provide, inject, defineComponent, nextTick } from 'vue';
import TimePickerPanel from '../vc-time-picker/Panel';
import classNames from '../_util/classNames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { generateShowHourMinuteSecond } from '../time-picker';
import enUS from './locale/en_US';
import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import { checkValidate, stringToMoment, momentToString } from '../_util/moment-util';

type PickerType = 'date' | 'week' | 'month';

interface PickerMap {
  [name: string]: string;
}
const DEFAULT_FORMAT: PickerMap = {
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
  week: 'gggg-wo',
  month: 'YYYY-MM',
};

const LOCALE_FORMAT_MAPPING: PickerMap = {
  date: 'dateFormat',
  dateTime: 'dateTimeFormat',
  week: 'weekFormat',
  month: 'monthFormat',
};

function getColumns({ showHour, showMinute, showSecond, use12Hours }: any) {
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

export default function wrapPicker<P>(
  Picker: DefineComponent<P>,
  props: any,
  pickerType: PickerType,
) {
  return defineComponent({
    name: Picker.name,
    inheritAttrs: false,
    props: {
      ...props,
      transitionName: PropTypes.string.def('slide-up'),
      popupStyle: PropTypes.style,
      locale: PropTypes.any.def({}),
    },
    emits: [
      'update:value',
      'openChange',
      'focus',
      'blur',
      'mouseenter',
      'mouseleave',
      'change',
      'ok',
      'calendarChange',
    ],
    setup() {
      return {
        configProvider: inject('configProvider', defaultConfigProvider),
        picker: undefined,
        popupRef: undefined,
      };
    },
    watch: {
      value(val) {
        checkValidate('DatePicker', val, 'value', this.valueFormat);
      },
    },
    created() {
      provide('savePopupRef', this.savePopupRef);
    },
    mounted() {
      const { autofocus, disabled, value, defaultValue, valueFormat } = this.$props;
      checkValidate('DatePicker', defaultValue, 'defaultValue', valueFormat);
      checkValidate('DatePicker', value, 'value', valueFormat);
      if (autofocus && !disabled) {
        nextTick(() => {
          this.focus();
        });
      }
    },
    methods: {
      savePicker(node: any) {
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

      savePopupRef(ref: any) {
        this.popupRef = ref;
      },
      handleOpenChange(open: boolean) {
        this.$emit('openChange', open);
      },

      handleFocus(e: FocusEvent) {
        this.$emit('focus', e);
      },

      handleBlur(e: FocusEvent) {
        this.$emit('blur', e);
      },

      handleMouseEnter(e: MouseEvent) {
        this.$emit('mouseenter', e);
      },

      handleMouseLeave(e: MouseEvent) {
        this.$emit('mouseleave', e);
      },
      handleChange(date: any, dateString: string) {
        const value = this.valueFormat ? momentToString(date, this.valueFormat) : date;
        this.$emit('update:value', value);
        this.$emit('change', value, dateString);
      },
      handleOk(val: any) {
        this.$emit('ok', this.valueFormat ? momentToString(val, this.valueFormat) : val);
      },
      handleCalendarChange(date: any, dateString: string) {
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

      renderPicker(locale: any, localeCode: string) {
        const props: any = { ...getOptionProps(this), ...this.$attrs };
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
        return <Picker {...pickerProps} v-slots={this.$slots} />;
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
  });
}
