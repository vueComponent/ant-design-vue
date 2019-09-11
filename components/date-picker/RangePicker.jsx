import * as moment from 'moment';
import RangeCalendar from '../vc-calendar/src/RangeCalendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import classNames from 'classnames';
import shallowequal from 'shallowequal';
import Icon from '../icon';
import Tag from '../tag';
import { ConfigConsumerProps } from '../config-provider';
import interopDefault from '../_util/interopDefault';
import { RangePickerProps } from './interface';
import {
  hasProp,
  getOptionProps,
  initDefaultProps,
  mergeProps,
  getComponentFromProp,
  isValidElement,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement } from '../_util/vnode';
function noop() {}
function getShowDateFromValue(value) {
  const [start, end] = value;
  // value could be an empty array, then we should not reset showDate
  if (!start && !end) {
    return;
  }
  const newEnd = end && end.isSame(start, 'month') ? end.clone().add(1, 'month') : end;
  return [start, newEnd];
}

function formatValue(value, format) {
  return (value && value.format(format)) || '';
}

function pickerValueAdapter(value) {
  if (!value) {
    return;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value, value.clone().add(1, 'month')];
}

function isEmptyArray(arr) {
  if (Array.isArray(arr)) {
    return arr.length === 0 || arr.every(i => !i);
  }
  return false;
}

function fixLocale(value, localeCode) {
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

export default {
  name: 'ARangePicker',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(RangePickerProps(), {
    allowClear: true,
    showToday: false,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
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
      sValue: value,
      sShowDate: pickerValueAdapter(pickerValue || interopDefault(moment)()),
      sOpen: this.open,
      sHoverValue: [],
    };
  },
  watch: {
    value(val) {
      const value = val || [];
      let state = { sValue: value };
      if (!shallowequal(val, this.sValue)) {
        state = {
          ...state,
          sShowDate: getShowDateFromValue(value) || this.sShowDate,
        };
      }
      this.setState(state);
    },
    open(val) {
      const state = { sOpen: val };
      this.setState(state);
    },
    sOpen(val, oldVal) {
      this.$nextTick(() => {
        if (!hasProp(this, 'open') && oldVal && !val) {
          this.focus();
        }
      });
    },
  },
  methods: {
    clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ sValue: [] });
      this.handleChange([]);
    },

    clearHoverValue() {
      this.setState({ sHoverValue: [] });
    },

    handleChange(value) {
      if (!hasProp(this, 'value')) {
        this.setState(({ sShowDate }) => ({
          sValue: value,
          sShowDate: getShowDateFromValue(value) || sShowDate,
        }));
      }
      const [start, end] = value;
      this.$emit('change', value, [formatValue(start, this.format), formatValue(end, this.format)]);
    },

    handleOpenChange(open) {
      if (!hasProp(this, 'open')) {
        this.setState({ sOpen: open });
      }

      if (open === false) {
        this.clearHoverValue();
      }
      this.$emit('openChange', open);
    },

    handleShowDateChange(showDate) {
      this.setState({ sShowDate: showDate });
    },

    handleHoverChange(hoverValue) {
      this.setState({ sHoverValue: hoverValue });
    },

    handleRangeMouseLeave() {
      if (this.sOpen) {
        this.clearHoverValue();
      }
    },

    handleCalendarInputSelect(value) {
      const [start] = value;
      if (!start) {
        return;
      }
      this.setState(({ sShowDate }) => ({
        sValue: value,
        sShowDate: getShowDateFromValue(value) || sShowDate,
      }));
    },

    handleRangeClick(value) {
      if (typeof value === 'function') {
        value = value();
      }

      this.setValue(value, true);
      this.$emit('ok', value);
      this.$emit('openChange', false);
    },

    setValue(value, hidePanel) {
      this.handleChange(value);
      if ((hidePanel || !this.showTime) && !hasProp(this, 'open')) {
        this.setState({ sOpen: false });
      }
    },

    onMouseEnter(e) {
      this.$emit('mouseenter', e);
    },
    onMouseLeave(e) {
      this.$emit('mouseleave', e);
    },

    focus() {
      this.$refs.picker.focus();
    },

    blur() {
      this.$refs.picker.blur();
    },

    renderFooter(...args) {
      const { ranges, $scopedSlots, $slots } = this;
      const { _prefixCls: prefixCls, _tagPrefixCls: tagPrefixCls } = this;
      const renderExtraFooter =
        this.renderExtraFooter || $scopedSlots.renderExtraFooter || $slots.renderExtraFooter;
      if (!ranges && !renderExtraFooter) {
        return null;
      }
      const customFooter = renderExtraFooter ? (
        <div class={`${prefixCls}-footer-extra`} key="extra">
          {typeof renderExtraFooter === 'function' ? renderExtraFooter(...args) : renderExtraFooter}
        </div>
      ) : null;
      const operations = Object.keys(ranges || {}).map(range => {
        const value = ranges[range];
        return (
          <Tag
            key={range}
            prefixCls={tagPrefixCls}
            color="blue"
            onClick={() => this.handleRangeClick(value)}
            onMouseenter={() => this.setState({ sHoverValue: value })}
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
    const props = getOptionProps(this);
    let suffixIcon = getComponentFromProp(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    const {
      sValue: value,
      sShowDate: showDate,
      sHoverValue: hoverValue,
      sOpen: open,
      $listeners,
      $scopedSlots,
    } = this;
    const {
      calendarChange = noop,
      ok = noop,
      focus = noop,
      blur = noop,
      panelChange = noop,
    } = $listeners;
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
    } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('calendar', customizePrefixCls);
    const tagPrefixCls = getPrefixCls('tag', customizeTagPrefixCls);
    this._prefixCls = prefixCls;
    this._tagPrefixCls = tagPrefixCls;

    const dateRender = props.dateRender || $scopedSlots.dateRender;
    fixLocale(value, localeCode);
    fixLocale(showDate, localeCode);

    const calendarClassName = classNames({
      [`${prefixCls}-time`]: showTime,
      [`${prefixCls}-range-with-ranges`]: ranges,
    });

    // 需要选择时间时，点击 ok 时才触发 onChange
    const pickerChangeHandler = {
      on: {
        change: this.handleChange,
      },
    };
    let calendarProps = {
      on: {
        ok: this.handleChange,
      },
      props: {},
    };
    if (props.timePicker) {
      pickerChangeHandler.on.change = changedValue => this.handleChange(changedValue);
    } else {
      calendarProps = { on: {}, props: {} };
    }
    if ('mode' in props) {
      calendarProps.props.mode = props.mode;
    }

    const startPlaceholder =
      'placeholder' in props ? props.placeholder[0] : locale.lang.rangePlaceholder[0];
    const endPlaceholder =
      'placeholder' in props ? props.placeholder[1] : locale.lang.rangePlaceholder[1];
    const rangeCalendarProps = mergeProps(calendarProps, {
      props: {
        format: format,
        prefixCls: prefixCls,
        renderFooter: this.renderFooter,
        timePicker: props.timePicker,
        disabledDate: disabledDate,
        disabledTime: disabledTime,
        dateInputPlaceholder: [startPlaceholder, endPlaceholder],
        locale: locale.lang,
        dateRender: dateRender,
        value: showDate,
        hoverValue: hoverValue,
        showToday: showToday,
      },
      on: {
        change: calendarChange,
        ok: ok,
        valueChange: this.handleShowDateChange,
        hoverChange: this.handleHoverChange,
        panelChange,
        inputSelect: this.handleCalendarInputSelect,
      },
      class: calendarClassName,
      scopedSlots: $scopedSlots,
    });
    const calendar = <RangeCalendar {...rangeCalendarProps} />;

    // default width for showTime
    const pickerStyle = {};
    if (props.showTime) {
      pickerStyle.width = '350px';
    }
    const [startValue, endValue] = value;
    const clearIcon =
      !props.disabled && props.allowClear && value && (startValue || endValue) ? (
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

    const input = ({ value: inputValue }) => {
      const [start, end] = inputValue;
      return (
        <span class={props.pickerInputClass}>
          <input
            disabled={props.disabled}
            readOnly
            value={(start && start.format(props.format)) || ''}
            placeholder={startPlaceholder}
            class={`${prefixCls}-range-picker-input`}
            tabIndex={-1}
          />
          <span class={`${prefixCls}-range-picker-separator`}> ~ </span>
          <input
            disabled={props.disabled}
            readOnly
            value={(end && end.format(props.format)) || ''}
            placeholder={endPlaceholder}
            class={`${prefixCls}-range-picker-input`}
            tabIndex={-1}
          />
          {clearIcon}
          {inputIcon}
        </span>
      );
    };
    const vcDatePickerProps = mergeProps(
      {
        props,
        on: $listeners,
      },
      pickerChangeHandler,
      {
        props: {
          calendar: calendar,
          value: value,
          open: open,
          prefixCls: `${prefixCls}-picker-container`,
        },
        on: {
          openChange: this.handleOpenChange,
        },
        style: popupStyle,
        scopedSlots: { default: input, ...$scopedSlots },
      },
    );
    return (
      <span
        ref="picker"
        class={props.pickerClass}
        style={pickerStyle}
        tabIndex={props.disabled ? -1 : 0}
        onFocus={focus}
        onBlur={blur}
        onMouseenter={this.onMouseEnter}
        onMouseleave={this.onMouseLeave}
      >
        <VcDatePicker {...vcDatePickerProps} />
      </span>
    );
  },
};
