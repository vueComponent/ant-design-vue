import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getOptionProps, getComponentFromProp, getListeners } from '../../../_util/props-util';
import { cloneElement } from '../../../_util/vnode';
import CalendarHeader from '../calendar/CalendarHeader';
import DateTable from '../date/DateTable';
import DateInput from '../date/DateInput';
import { getTimeConfig } from '../util/index';
function noop() {}
const CalendarPart = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    value: PropTypes.any,
    hoverValue: PropTypes.any,
    selectedValue: PropTypes.any,
    direction: PropTypes.any,
    locale: PropTypes.any,
    showDateInput: PropTypes.bool,
    showTimePicker: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
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
    dateRender: PropTypes.func,
    clearIcon: PropTypes.any,
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
    } = props;
    const clearIcon = getComponentFromProp(this, 'clearIcon');
    const {
      inputChange = noop,
      inputSelect = noop,
      valueChange = noop,
      panelChange = noop,
      select = noop,
      dayHover = noop,
    } = getListeners(this);
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
        props: {
          showHour: true,
          showMinute: true,
          showSecond: true,
          ...timePickerProps,
          ...disabledTimeConfig,
          ...timePickerDisabledTime,
          defaultOpenValue: value,
          value: selectedValue[index],
        },
        on: {
          change: inputChange,
        },
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
        showClear={false}
        selectedValue={selectedValue[index]}
        onChange={inputSelect}
        onChange={inputChange}
        onSelect={inputSelect}
        clearIcon={clearIcon}
      />
    );
    const headerProps = {
      props: {
        ...newProps,
        mode,
        enableNext,
        enablePrev,
        disabledMonth,
      },
      on: {
        valueChange,
        panelChange,
      },
    };
    const tableProps = {
      props: {
        ...newProps,
        hoverValue,
        selectedValue,
        dateRender,
        disabledDate,
        showWeekNumber,
      },
      on: {
        select,
        dayHover,
      },
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
