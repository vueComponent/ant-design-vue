import type { CSSProperties } from 'vue';
import { defineComponent, inject, nextTick } from 'vue';
import moment from 'moment';
import RangeCalendar from '../vc-calendar/src/RangeCalendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import classNames from '../_util/classNames';
import shallowequal from '../_util/shallowequal';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import Tag from '../tag';
import { defaultConfigProvider } from '../config-provider';
import interopDefault from '../_util/interopDefault';
import { RangePickerProps } from './props';
import { hasProp, getOptionProps, getComponent } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { formatDate } from './utils';
import InputIcon from './InputIcon';
import { getDataAndAriaProps } from '../_util/util';
import initDefaultProps from '../_util/props-util/initDefaultProps';

type RangePickerValue =
  | undefined[]
  | null[]
  | [moment.Moment]
  | [undefined, moment.Moment]
  | [moment.Moment, undefined]
  | [null, moment.Moment]
  | [moment.Moment, null]
  | [moment.Moment, moment.Moment];

export type RangePickerPresetRange = RangePickerValue | (() => RangePickerValue);
function getShowDateFromValue(value: RangePickerValue, mode?: string | string[]) {
  const [start, end] = value;
  // value could be an empty array, then we should not reset showDate
  if (!start && !end) {
    return;
  }
  if (mode && mode[0] === 'month') {
    return [start, end] as RangePickerValue;
  }
  const newEnd = end && end.isSame(start, 'month') ? end.clone().add(1, 'month') : end;
  return [start, newEnd] as RangePickerValue;
}

function pickerValueAdapter(
  value?: moment.Moment | RangePickerValue,
): RangePickerValue | undefined {
  if (!value) {
    return;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value, value.clone().add(1, 'month')];
}

function isEmptyArray(arr: any) {
  if (Array.isArray(arr)) {
    return arr.length === 0 || arr.every(i => !i);
  }
  return false;
}

function fixLocale(value: RangePickerValue | undefined, localeCode: string | undefined) {
  if (!localeCode) {
    return;
  }
  if (!value || value.length === 0) {
    return;
  }
  const [start, end] = value;
  if (start) {
    start.locale(localeCode);
  }
  if (end) {
    end.locale(localeCode);
  }
}

export interface RangePickerState {
  sValue?: RangePickerValue;
  sShowDate?: RangePickerValue;
  sOpen?: boolean;
  sHoverValue?: RangePickerValue;
}

export default defineComponent({
  name: 'ARangePicker',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(RangePickerProps, {
    allowClear: true,
    showToday: false,
    separator: '~',
  }),
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      picker: null,
      sTagPrefixCls: undefined,
      sPrefixCls: '',
    };
  },
  data(): RangePickerState {
    const value = this.value || this.defaultValue || [];
    const [start, end] = value;
    if (
      (start && !interopDefault(moment).isMoment(start)) ||
      (end && !interopDefault(moment).isMoment(end))
    ) {
      throw new Error(
        'The value/defaultValue of RangePicker must be a moment object array after `antd@2.0`, ' +
          'see: https://u.ant.design/date-picker-value',
      );
    }
    const pickerValue = !value || isEmptyArray(value) ? this.defaultPickerValue : value;
    return {
      sValue: value as RangePickerValue,
      sShowDate: pickerValueAdapter(pickerValue || interopDefault(moment)()),
      sOpen: this.open,
      sHoverValue: [],
    };
  },
  watch: {
    value(val) {
      const value = val || [];
      let state: RangePickerState = { sValue: value };
      if (!shallowequal(val, this.sValue)) {
        state = {
          ...state,
          sShowDate: getShowDateFromValue(value, this.mode) || this.sShowDate,
        };
      }
      this.setState(state);
    },
    open(val) {
      const state = { sOpen: val };
      this.setState(state);
    },
    sOpen(val, oldVal) {
      nextTick(() => {
        if (!hasProp(this, 'open') && oldVal && !val) {
          this.focus();
        }
      });
    },
  },
  methods: {
    setValue(value: RangePickerValue, hidePanel?: boolean) {
      this.handleChange(value);
      if ((hidePanel || !this.showTime) && !hasProp(this, 'open')) {
        this.setState({ sOpen: false });
      }
    },

    savePicker(node: any) {
      this.picker = node;
    },
    clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ sValue: [] });
      this.handleChange([]);
    },

    clearHoverValue() {
      this.setState({ sHoverValue: [] });
    },

    handleChange(value: RangePickerValue) {
      if (!hasProp(this, 'value')) {
        this.setState(({ sShowDate }) => ({
          sValue: value,
          sShowDate: getShowDateFromValue(value) || sShowDate,
        }));
      }
      if (value[0] && value[1] && value[0].diff(value[1]) > 0) {
        value[1] = undefined;
      }
      const [start, end] = value;
      this.$emit('change', value, [formatDate(start, this.format), formatDate(end, this.format)]);
    },

    handleOpenChange(open: boolean) {
      if (!hasProp(this, 'open')) {
        this.setState({ sOpen: open });
      }

      if (open === false) {
        this.clearHoverValue();
      }
      this.$emit('openChange', open);
    },

    handleShowDateChange(showDate: boolean) {
      this.setState({ sShowDate: showDate });
    },

    handleHoverChange(hoverValue: any) {
      this.setState({ sHoverValue: hoverValue });
    },

    handleRangeMouseLeave() {
      if (this.sOpen) {
        this.clearHoverValue();
      }
    },

    handleCalendarInputSelect(value: RangePickerValue) {
      const [start] = value;
      if (!start) {
        return;
      }
      this.setState(({ sShowDate }) => ({
        sValue: value,
        sShowDate: getShowDateFromValue(value) || sShowDate,
      }));
    },

    handleRangeClick(value: RangePickerPresetRange) {
      if (typeof value === 'function') {
        value = value();
      }

      this.setValue(value, true);
      this.$emit('ok', value);
      this.$emit('openChange', false);
    },

    onMouseEnter(e: MouseEvent) {
      this.$emit('mouseenter', e);
    },
    onMouseLeave(e: MouseEvent) {
      this.$emit('mouseleave', e);
    },

    focus() {
      this.picker.focus();
    },

    blur() {
      this.picker.blur();
    },

    renderFooter() {
      const { ranges, $slots } = this;
      const { sPrefixCls: prefixCls, sTagPrefixCls: tagPrefixCls } = this;
      const renderExtraFooter = this.renderExtraFooter || $slots.renderExtraFooter;
      if (!ranges && !renderExtraFooter) {
        return null;
      }
      const customFooter = renderExtraFooter ? (
        <div class={`${prefixCls}-footer-extra`} key="extra">
          {typeof renderExtraFooter === 'function' ? renderExtraFooter() : renderExtraFooter}
        </div>
      ) : null;
      const operations =
        ranges &&
        Object.keys(ranges).map(range => {
          const value = ranges[range];
          const hoverValue = typeof value === 'function' ? value.call(this) : value;
          return (
            <Tag
              key={range}
              prefixCls={tagPrefixCls}
              color="blue"
              onClick={() => this.handleRangeClick(value)}
              onMouseenter={() => this.setState({ sHoverValue: hoverValue })}
              onMouseleave={this.handleRangeMouseLeave}
            >
              {range}
            </Tag>
          );
        });
      const rangeNode =
        operations && operations.length > 0 ? (
          <div class={`${prefixCls}-footer-extra ${prefixCls}-range-quick-selector`} key="range">
            {operations}
          </div>
        ) : null;
      return [rangeNode, customFooter];
    },
  },

  render() {
    const props: any = { ...getOptionProps(this), ...this.$attrs };
    let suffixIcon = getComponent(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    const {
      sValue: value,
      sShowDate: showDate,
      sHoverValue: hoverValue,
      sOpen: open,
      $slots,
    } = this;
    const {
      prefixCls: customizePrefixCls,
      tagPrefixCls: customizeTagPrefixCls,
      popupStyle,
      disabledDate,
      disabledTime,
      showTime,
      showToday,
      ranges,
      locale,
      localeCode,
      format,
      separator,
      inputReadOnly,
      style,
      onCalendarChange,
      onOk,
      onBlur,
      onFocus,
      onPanelChange,
    } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('calendar', customizePrefixCls);
    const tagPrefixCls = getPrefixCls('tag', customizeTagPrefixCls);
    this.sPrefixCls = prefixCls;
    this.sTagPrefixCls = tagPrefixCls;

    const dateRender = props.dateRender || $slots.dateRender;
    fixLocale(value, localeCode);
    fixLocale(showDate, localeCode);

    const calendarClassName = classNames({
      [`${prefixCls}-time`]: showTime,
      [`${prefixCls}-range-with-ranges`]: ranges,
    });

    // 需要选择时间时，点击 ok 时才触发 onChange
    const pickerChangeHandler = {
      onChange: this.handleChange,
    };
    let calendarProps: any = {
      onOk: this.handleChange,
    };
    if (props.timePicker) {
      pickerChangeHandler.onChange = changedValue => this.handleChange(changedValue);
    } else {
      calendarProps = {};
    }
    if ('mode' in props) {
      calendarProps.mode = props.mode;
    }

    const startPlaceholder = Array.isArray(props.placeholder)
      ? props.placeholder[0]
      : locale.lang.rangePlaceholder[0];
    const endPlaceholder = Array.isArray(props.placeholder)
      ? props.placeholder[1]
      : locale.lang.rangePlaceholder[1];

    const rangeCalendarProps = {
      ...calendarProps,
      separator,
      format,
      prefixCls,
      renderFooter: this.renderFooter,
      timePicker: props.timePicker,
      disabledDate,
      disabledTime,
      dateInputPlaceholder: [startPlaceholder, endPlaceholder],
      locale: locale.lang,
      dateRender,
      value: showDate,
      hoverValue,
      showToday,
      inputReadOnly,
      onChange: onCalendarChange,
      onOk,
      onValueChange: this.handleShowDateChange,
      onHoverChange: this.handleHoverChange,
      onPanelChange,
      onInputSelect: this.handleCalendarInputSelect,
      class: calendarClassName,
    };
    const calendar = <RangeCalendar {...rangeCalendarProps} v-slots={$slots} />;

    // default width for showTime
    const pickerStyle: CSSProperties = {};
    if (props.showTime) {
      pickerStyle.width = '350px';
    }
    const [startValue, endValue] = value;
    const clearIcon =
      !props.disabled && props.allowClear && value && (startValue || endValue) ? (
        <CloseCircleFilled class={`${prefixCls}-picker-clear`} onClick={this.clearSelection} />
      ) : null;

    const inputIcon = <InputIcon suffixIcon={suffixIcon} prefixCls={prefixCls} />;

    const input = ({ value: inputValue }) => {
      const [start, end] = inputValue;
      return (
        <span class={props.pickerInputClass}>
          <input
            disabled={props.disabled}
            readonly
            value={formatDate(start, props.format)}
            placeholder={startPlaceholder}
            class={`${prefixCls}-range-picker-input`}
            tabindex={-1}
          />
          <span class={`${prefixCls}-range-picker-separator`}> {separator} </span>
          <input
            disabled={props.disabled}
            readonly
            value={formatDate(end, props.format)}
            placeholder={endPlaceholder}
            class={`${prefixCls}-range-picker-input`}
            tabindex={-1}
          />
          {clearIcon}
          {inputIcon}
        </span>
      );
    };
    const vcDatePickerProps = {
      ...props,
      ...pickerChangeHandler,
      calendar,
      value,
      open,
      prefixCls: `${prefixCls}-picker-container`,
      onOpenChange: this.handleOpenChange,
      style: popupStyle,
    };
    return (
      <span
        ref={this.savePicker}
        id={props.id}
        class={classNames(props.class, props.pickerClass)}
        style={{ ...pickerStyle, ...style }}
        tabindex={props.disabled ? -1 : 0}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseenter={this.onMouseEnter}
        onMouseleave={this.onMouseLeave}
        {...getDataAndAriaProps(props)}
      >
        <VcDatePicker {...vcDatePickerProps} v-slots={{ default: input, ...$slots }}></VcDatePicker>
      </span>
    );
  },
});
