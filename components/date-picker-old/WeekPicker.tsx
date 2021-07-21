import { defineComponent, inject, nextTick } from 'vue';
import moment from 'moment';
import Calendar from '../vc-calendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import { defaultConfigProvider } from '../config-provider';
import { hasProp, getOptionProps, getComponent } from '../_util/props-util';
import classNames from '../_util/classNames';
import BaseMixin from '../_util/BaseMixin';
import { WeekPickerProps } from './props';
import interopDefault from '../_util/interopDefault';
import InputIcon from './InputIcon';
import { getDataAndAriaProps } from '../_util/util';
import initDefaultProps from '../_util/props-util/initDefaultProps';

function formatValue(value: moment.Moment | null, format: string): string {
  return (value && value.format(format)) || '';
}

interface WeekPickerState {
  _open?: boolean;
  _value?: moment.Moment | null;
}
function noop() {}

export default defineComponent({
  name: 'AWeekPicker',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(WeekPickerProps, {
    allowClear: true,
  }),
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      prevState: {} as WeekPickerState,
      input: undefined,
      sPrefixCls: undefined,
    };
  },
  data(): WeekPickerState {
    const value: any = this.value || this.defaultValue;
    if (value && !interopDefault(moment).isMoment(value)) {
      throw new Error(
        'The value/defaultValue of WeekPicker or MonthPicker must be ' + 'a moment object',
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
      nextTick(() => {
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
    nextTick(() => {
      if (!hasProp(this, 'open') && this.prevState._open && !this._open) {
        this.focus();
      }
    });
  },
  methods: {
    saveInput(node: any) {
      this.input = node;
    },
    weekDateRender({ current }) {
      const selectedValue = this.$data._value;
      const { sPrefixCls: prefixCls, $slots } = this;
      const dateRender = this.dateRender || $slots.dateRender;
      const dateNode = dateRender ? dateRender({ current }) : current.date();
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
    handleChange(value: moment.Moment | null) {
      if (!hasProp(this, 'value')) {
        this.setState({ _value: value });
      }
      this.$emit('change', value, formatValue(value, this.format));
    },
    handleOpenChange(open: boolean) {
      if (!hasProp(this, 'open')) {
        this.setState({ _open: open });
      }
      this.$emit('openChange', open);
    },
    clearSelection(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      this.handleChange(null);
    },
    focus() {
      this.input.focus();
    },

    blur() {
      this.input.blur();
    },
    renderFooter(...args: any[]) {
      const { sPrefixCls: prefixCls, $slots } = this;
      const renderExtraFooter = this.renderExtraFooter || $slots.renderExtraFooter;
      return renderExtraFooter ? (
        <div class={`${prefixCls}-footer-extra`}>{renderExtraFooter(...args)}</div>
      ) : null;
    },
  },

  render() {
    const props = { ...getOptionProps(this), ...this.$attrs };
    let suffixIcon = getComponent(this, 'suffixIcon');
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
      defaultPickerValue,
      $data,
      $slots,
    } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('calendar', customizePrefixCls);
    this.sPrefixCls = prefixCls;

    const { _value: pickerValue, _open: open } = $data;
    const { class: className, style, id, onFocus = noop, onBlur = noop } = props as any;

    if (pickerValue && localeCode) {
      pickerValue.locale(localeCode);
    }

    const placeholder = hasProp(this, 'placeholder') ? this.placeholder : locale.lang.placeholder;
    const weekDateRender = this.dateRender || $slots.dateRender || this.weekDateRender;
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
        defaultValue={defaultPickerValue as any}
      />
    );
    const clearIcon =
      !disabled && allowClear && $data._value ? (
        <CloseCircleFilled class={`${prefixCls}-picker-clear`} onClick={this.clearSelection} />
      ) : null;

    const inputIcon = <InputIcon suffixIcon={suffixIcon} prefixCls={prefixCls} />;

    const input = ({ value }) => {
      return (
        <span style={{ display: 'inline-block', width: '100%' }}>
          <input
            ref={this.saveInput}
            disabled={disabled}
            readonly
            value={(value && value.format(format)) || ''}
            placeholder={placeholder}
            class={pickerInputClass}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {clearIcon}
          {inputIcon}
        </span>
      );
    };
    const vcDatePickerProps = {
      ...props,
      calendar,
      prefixCls: `${prefixCls}-picker-container`,
      value: pickerValue,
      open,
      onChange: this.handleChange,
      onOpenChange: this.handleOpenChange,
      style: popupStyle,
    };
    return (
      <span
        class={classNames(className, pickerClass)}
        style={style}
        id={id}
        {...getDataAndAriaProps(props)}
      >
        <VcDatePicker {...vcDatePickerProps} v-slots={{ default: input, ...$slots }}></VcDatePicker>
      </span>
    );
  },
});
