import * as moment from 'moment';
import Calendar from '../vc-calendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider';
import {
  hasProp,
  getOptionProps,
  initDefaultProps,
  getComponentFromProp,
  isValidElement,
  getListeners,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { WeekPickerProps } from './interface';
import interopDefault from '../_util/interopDefault';
import { cloneElement } from '../_util/vnode';

function formatValue(value, format) {
  return (value && value.format(format)) || '';
}
function noop() {}

export default {
  // static defaultProps = {
  //   format: 'YYYY-wo',
  //   allowClear: true,
  // };

  // private input: any;
  name: 'AWeekPicker',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(WeekPickerProps(), {
    format: 'gggg-wo',
    allowClear: true,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const value = this.value || this.defaultValue;
    if (value && !interopDefault(moment).isMoment(value)) {
      throw new Error(
        'The value/defaultValue of DatePicker or MonthPicker must be ' + 'a moment object',
      );
    }
    return {
      _value: value,
      _open: this.open,
    };
  },
  watch: {
    value(val) {
      const state = { _value: val };
      this.setState(state);
      this.prevState = { ...this.$data, ...state };
    },
    open(val) {
      const state = { _open: val };
      this.setState(state);
      this.prevState = { ...this.$data, ...state };
    },
    _open(val, oldVal) {
      this.$nextTick(() => {
        if (!hasProp(this, 'open') && oldVal && !val) {
          this.focus();
        }
      });
    },
  },
  mounted() {
    this.prevState = { ...this.$data };
  },
  updated() {
    this.$nextTick(() => {
      if (!hasProp(this, 'open') && this.prevState._open && !this._open) {
        this.focus();
      }
    });
  },
  methods: {
    weekDateRender(current) {
      const selectedValue = this.$data._value;
      const { _prefixCls: prefixCls, $scopedSlots } = this;
      const dateRender = this.dateRender || $scopedSlots.dateRender;
      const dateNode = dateRender ? dateRender(current) : current.date();
      if (
        selectedValue &&
        current.year() === selectedValue.year() &&
        current.week() === selectedValue.week()
      ) {
        return (
          <div class={`${prefixCls}-selected-day`}>
            <div class={`${prefixCls}-date`}>{dateNode}</div>
          </div>
        );
      }
      return <div class={`${prefixCls}-date`}>{dateNode}</div>;
    },
    handleChange(value) {
      if (!hasProp(this, 'value')) {
        this.setState({ _value: value });
      }
      this.$emit('change', value, formatValue(value, this.format));
    },
    handleOpenChange(open) {
      if (!hasProp(this, 'open')) {
        this.setState({ _open: open });
      }
      this.$emit('openChange', open);
    },
    clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      this.handleChange(null);
    },
    renderFooter(...args) {
      const { _prefixCls: prefixCls, $scopedSlots } = this;
      const renderExtraFooter = this.renderExtraFooter || $scopedSlots.renderExtraFooter;
      return renderExtraFooter ? (
        <div class={`${prefixCls}-footer-extra`}>{renderExtraFooter(...args)}</div>
      ) : null;
    },
    focus() {
      this.$refs.input.focus();
    },

    blur() {
      this.$refs.input.blur();
    },
  },

  render() {
    const props = getOptionProps(this);
    let suffixIcon = getComponentFromProp(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    const {
      prefixCls: customizePrefixCls,
      disabled,
      pickerClass,
      popupStyle,
      pickerInputClass,
      format,
      allowClear,
      locale,
      localeCode,
      disabledDate,
      $data,
      $scopedSlots,
    } = this;
    const listeners = getListeners(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('calendar', customizePrefixCls);
    this._prefixCls = prefixCls;

    const { _value: pickerValue, _open: open } = $data;
    const { focus = noop, blur = noop } = listeners;

    if (pickerValue && localeCode) {
      pickerValue.locale(localeCode);
    }

    const placeholder = hasProp(this, 'placeholder') ? this.placeholder : locale.lang.placeholder;
    const weekDateRender = this.dateRender || $scopedSlots.dateRender || this.weekDateRender;
    const calendar = (
      <Calendar
        showWeekNumber
        dateRender={weekDateRender}
        prefixCls={prefixCls}
        format={format}
        locale={locale.lang}
        showDateInput={false}
        showToday={false}
        disabledDate={disabledDate}
        renderFooter={this.renderFooter}
      />
    );
    const clearIcon =
      !disabled && allowClear && $data._value ? (
        <Icon
          type="close-circle"
          class={`${prefixCls}-picker-clear`}
          onClick={this.clearSelection}
          theme="filled"
        />
      ) : null;

    const inputIcon = (suffixIcon &&
      (isValidElement(suffixIcon) ? (
        cloneElement(suffixIcon, {
          class: `${prefixCls}-picker-icon`,
        })
      ) : (
        <span class={`${prefixCls}-picker-icon`}>{suffixIcon}</span>
      ))) || <Icon type="calendar" class={`${prefixCls}-picker-icon`} />;

    const input = ({ value }) => {
      return (
        <span style={{ display: 'inline-block', width: '100%' }}>
          <input
            ref="input"
            disabled={disabled}
            readOnly
            value={(value && value.format(format)) || ''}
            placeholder={placeholder}
            class={pickerInputClass}
            onFocus={focus}
            onBlur={blur}
          />
          {clearIcon}
          {inputIcon}
        </span>
      );
    };
    const vcDatePickerProps = {
      props: {
        ...props,
        calendar,
        prefixCls: `${prefixCls}-picker-container`,
        value: pickerValue,
        open,
      },
      on: {
        ...listeners,
        change: this.handleChange,
        openChange: this.handleOpenChange,
      },
      style: popupStyle,
    };
    return (
      <span class={pickerClass}>
        <VcDatePicker {...vcDatePickerProps}>{input}</VcDatePicker>
      </span>
    );
  },
};
