<script>
import PropTypes from '@/components/_util/vue-types'
import BaseMixin from '@/components/_util/BaseMixin'
import { getOptionProps } from '@/components/_util/props-util'
import { cloneElement } from '@/components/_util/vnode'
import CalendarHeader from '../calendar/CalendarHeader'
import DateTable from '../date/DateTable'
import DateInput from '../date/DateInput'
import { getTimeConfig } from '../util/index'
function noop () {}
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
    format: PropTypes.any,
    placeholder: PropTypes.any,
    disabledDate: PropTypes.any,
    timePicker: PropTypes.any,
    disabledTime: PropTypes.any,
    // onInputSelect: PropTypes.func,
    timePickerDisabledTime: PropTypes.object,
    enableNext: PropTypes.any,
    enablePrev: PropTypes.any,
  },
  render () {
    const { $props: props, $listeners = {}} = this
    const {
      prefixCls,
      value,
      hoverValue,
      selectedValue,
      mode,
      direction,
      locale, format, placeholder,
      disabledDate, timePicker, disabledTime,
      timePickerDisabledTime, showTimePicker,
      enablePrev, enableNext, disabledMonth,
      showDateInput, dateRender, showWeekNumber,
    } = props
    const { inputSelect = noop,
      valueChange = noop,
      panelChange = noop,
      select = noop,
      dayHover = noop,
    } = $listeners
    const shouldShowTimePicker = showTimePicker && timePicker
    const disabledTimeConfig = shouldShowTimePicker && disabledTime
      ? getTimeConfig(selectedValue, disabledTime) : null
    const rangeClassName = `${prefixCls}-range`
    const newProps = {
      locale,
      value,
      prefixCls,
      showTimePicker,
    }
    const index = direction === 'left' ? 0 : 1
    const timePickerProps = getOptionProps(timePicker)
    console.log('timePickerProps', timePickerProps)
    const timePickerEle = shouldShowTimePicker &&
      cloneElement(timePicker, {
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
          change: inputSelect,
        },

      })

    const dateInputElement = showDateInput &&
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
      />
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
    }
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
    }
    return (
      <div class={`${rangeClassName}-part ${rangeClassName}-${direction}`}>
        {dateInputElement}
        <div style={{ outline: 'none' }}>
          <CalendarHeader {...headerProps}/>
          {showTimePicker ? <div class={`${prefixCls}-time-picker`}>
            <div class={`${prefixCls}-time-picker-panel`}>
              {timePickerEle}
            </div>
          </div> : null}
          <div class={`${prefixCls}-body`}>
            <DateTable {...tableProps}/>
          </div>
        </div>
      </div>)
  },
}

export default CalendarPart
</script>