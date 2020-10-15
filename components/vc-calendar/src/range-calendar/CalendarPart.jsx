import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getOptionProps, getComponent } from '../../../_util/props-util';
import { cloneElement } from '../../../_util/vnode';
import CalendarHeader from '../calendar/CalendarHeader';
import DateTable from '../date/DateTable';
import DateInput from '../date/DateInput';
import { getTimeConfig } from '../util/index';
function noop() {}
const CalendarPart = {
  name: 'CalendarPart',
  inheritAttrs: false,
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    value: PropTypes.any,
    hoverValue: PropTypes.any,
    selectedValue: PropTypes.any,
    direction: PropTypes.any,
    locale: PropTypes.any,
    showDateInput: PropTypes.looseBool,
    showTimePicker: PropTypes.looseBool,
    showWeekNumber: PropTypes.looseBool,
    format: PropTypes.any,
    placeholder: PropTypes.any,
    disabledDate: PropTypes.any,
    timePicker: PropTypes.any,
    disabledTime: PropTypes.any,
    disabledMonth: PropTypes.any,
    mode: PropTypes.any,
    // onInputSelect: PropTypes.func,
    timePickerDisabledTime: PropTypes.object,
    enableNext: PropTypes.any,
    enablePrev: PropTypes.any,
    clearIcon: PropTypes.any,
    dateRender: PropTypes.func,
    inputMode: PropTypes.string,
    inputReadOnly: PropTypes.looseBool,
  },
  render() {
    const { $props: props } = this;
    const {
      prefixCls,
      value,
      hoverValue,
      selectedValue,
      mode,
      direction,
      locale,
      format,
      placeholder,
      disabledDate,
      timePicker,
      disabledTime,
      timePickerDisabledTime,
      showTimePicker,
      enablePrev,
      enableNext,
      disabledMonth,
      showDateInput,
      dateRender,
      showWeekNumber,
      showClear,
      inputMode,
      inputReadOnly,
    } = props;
    const clearIcon = getComponent(this, 'clearIcon');
    const {
      onInputChange = noop,
      onInputSelect = noop,
      onValueChange = noop,
      onPanelChange = noop,
      onSelect = noop,
      onDayHover = noop,
    } = this.$attrs;
    const shouldShowTimePicker = showTimePicker && timePicker;
    const disabledTimeConfig =
      shouldShowTimePicker && disabledTime ? getTimeConfig(selectedValue, disabledTime) : null;
    const rangeClassName = `${prefixCls}-range`;
    const newProps = {
      locale,
      value,
      prefixCls,
      showTimePicker,
    };
    const index = direction === 'left' ? 0 : 1;
    let timePickerEle = null;
    if (shouldShowTimePicker) {
      const timePickerProps = getOptionProps(timePicker);
      timePickerEle = cloneElement(timePicker, {
        showHour: true,
        showMinute: true,
        showSecond: true,
        ...timePickerProps,
        ...disabledTimeConfig,
        ...timePickerDisabledTime,
        defaultOpenValue: value,
        value: selectedValue[index],
        onChange: onInputChange,
      });
    }

    const dateInputElement = showDateInput && (
      <DateInput
        format={format}
        locale={locale}
        prefixCls={prefixCls}
        timePicker={timePicker}
        disabledDate={disabledDate}
        placeholder={placeholder}
        disabledTime={disabledTime}
        value={value}
        showClear={showClear || false}
        selectedValue={selectedValue[index]}
        onChange={onInputChange}
        onSelect={onInputSelect}
        clearIcon={clearIcon}
        inputMode={inputMode}
        inputReadOnly={inputReadOnly}
      />
    );
    const headerProps = {
      ...newProps,
      mode,
      enableNext,
      enablePrev,
      disabledMonth,
      onValueChange,
      onPanelChange,
    };
    const tableProps = {
      ...newProps,
      hoverValue,
      selectedValue,
      dateRender,
      disabledDate,
      showWeekNumber,
      onSelect,
      onDayHover,
    };
    return (
      <div class={`${rangeClassName}-part ${rangeClassName}-${direction}`}>
        {dateInputElement}
        <div style={{ outline: 'none' }}>
          <CalendarHeader {...headerProps} />
          {showTimePicker ? (
            <div class={`${prefixCls}-time-picker`}>
              <div class={`${prefixCls}-time-picker-panel`}>{timePickerEle}</div>
            </div>
          ) : null}
          <div class={`${prefixCls}-body`}>
            <DateTable {...tableProps} />
          </div>
        </div>
      </div>
    );
  },
};

export default CalendarPart;
