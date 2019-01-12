import TimePickerPanel from '../vc-time-picker/Panel';
import classNames from 'classnames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { generateShowHourMinuteSecond } from '../time-picker';
import enUS from './locale/en_US';
import { getOptionProps, initDefaultProps } from '../_util/props-util';

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

export default function wrapPicker(Picker, props, defaultFormat) {
  return {
    name: Picker.name,
    props: initDefaultProps(props, {
      format: defaultFormat || 'YYYY-MM-DD',
      transitionName: 'slide-up',
      popupStyle: {},
      locale: {},
      prefixCls: 'ant-calendar',
      inputPrefixCls: 'ant-input',
    }),
    model: {
      prop: 'value',
      event: 'change',
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
        const { prefixCls, inputPrefixCls, size, showTime, disabled } = props;
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
            pickerClass,
            pickerInputClass,
            locale,
            localeCode,
            timePicker,
          },
          on: {
            ...this.$listeners,
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
