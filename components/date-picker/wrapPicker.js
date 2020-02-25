import TimePickerPanel from '../vc-time-picker/Panel';
import classNames from 'classnames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { generateShowHourMinuteSecond } from '../time-picker';
import enUS from './locale/en_US';
import { getOptionProps, initDefaultProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

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
    props: initDefaultProps(props, {
      transitionName: 'slide-up',
      popupStyle: {},
      locale: {},
    }),
    model: {
      prop: 'value',
      event: 'change',
    },
    inject: {
      configProvider: { default: () => ConfigConsumerProps },
    },
    provide() {
      return {
        savePopupRef: this.savePopupRef,
      };
    },
    mounted() {
      const { autoFocus, disabled } = this;
      if (autoFocus && !disabled) {
        this.$nextTick(() => {
          this.focus();
        });
      }
    },
    methods: {
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

      focus() {
        this.$refs.picker.focus();
      },

      blur() {
        this.$refs.picker.blur();
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

      renderPicker(locale, localeCode) {
        const props = getOptionProps(this);
        const {
          prefixCls: customizePrefixCls,
          inputPrefixCls: customizeInputPrefixCls,
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

        const getPrefixCls = this.configProvider.getPrefixCls;
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
          props: {
            ...vcTimePickerProps,
            ...showTime,
            prefixCls: `${prefixCls}-time-picker`,
            placeholder: locale.timePickerLocale.placeholder,
            transitionName: 'slide-up',
          },
          class: timePickerCls,
        };
        const timePicker = showTime ? <TimePickerPanel {...timePickerPanelProps} /> : null;
        const pickerProps = {
          props: {
            ...props,
            format: mergedFormat,
            pickerClass,
            pickerInputClass,
            locale,
            localeCode,
            timePicker,
          },
          on: {
            ...getListeners(this),
            openChange: this.handleOpenChange,
            focus: this.handleFocus,
            blur: this.handleBlur,
            mouseenter: this.handleMouseEnter,
            mouseleave: this.handleMouseLeave,
          },
          ref: 'picker',
          scopedSlots: this.$scopedSlots || {},
        };
        return (
          <Picker {...pickerProps}>
            {this.$slots &&
              Object.keys(this.$slots).map(key => (
                <template slot={key} key={key}>
                  {this.$slots[key]}
                </template>
              ))}
          </Picker>
        );
      },
    },

    render() {
      return (
        <LocaleReceiver
          componentName="DatePicker"
          defaultLocale={this.getDefaultLocale}
          scopedSlots={{ default: this.renderPicker }}
        />
      );
    },
  };
}
