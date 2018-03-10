<script>
import PropTypes from '@/components/_util/vue-types'
import BaseMixin from '@/components/_util/BaseMixin'
import { getOptionProps, hasProp } from '@/components/_util/props-util'
import { cloneElement } from '@/components/_util/vnode'
import moment from 'moment'
import classnames from 'classnames'
import CalendarPart from './range-calendar/CalendarPart'
import TodayButton from './calendar/TodayButton'
import OkButton from './calendar/OkButton'
import TimePickerButton from './calendar/TimePickerButton'
import CommonMixin from './mixin/CommonMixin'
import { syncTime, getTodayTime, isAllowedDate } from './util/'

function noop () {}

function isEmptyArray (arr) {
  return Array.isArray(arr) && (arr.length === 0 || arr.every(i => !i))
}

function isArraysEqual (a, b) {
  if (a === b) return true
  if (a === null || typeof a === 'undefined' || b === null || typeof b === 'undefined') {
    return false
  }
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function getValueFromSelectedValue (selectedValue) {
  const [start, end] = selectedValue
  const newEnd = end && end.isSame(start, 'month') ? end.clone().add(1, 'month') : end
  return [start, newEnd]
}

function normalizeAnchor (props, init) {
  const selectedValue = props.selectedValue || init && props.defaultSelectedValue
  const value = props.value || init && props.defaultValue
  const normalizedValue = value
    ? getValueFromSelectedValue(value)
    : getValueFromSelectedValue(selectedValue)
  return !isEmptyArray(normalizedValue)
    ? normalizedValue : init && [moment(), moment().add(1, 'months')]
}

function generateOptions (length, extraOptionGen) {
  const arr = extraOptionGen ? extraOptionGen().concat() : []
  for (let value = 0; value < length; value++) {
    if (arr.indexOf(value) === -1) {
      arr.push(value)
    }
  }
  return arr
}

function onInputSelect (direction, value) {
  if (!value) {
    return
  }
  const originalValue = this.state.selectedValue
  const selectedValue = originalValue.concat()
  const index = direction === 'left' ? 0 : 1
  selectedValue[index] = value
  if (selectedValue[0] && this.compare(selectedValue[0], selectedValue[1]) > 0) {
    selectedValue[1 - index] = this.state.showTimePicker ? selectedValue[index] : undefined
  }
  this.props.onInputSelect(selectedValue)
  this.fireSelectValueChange(selectedValue)
}

const RangeCalendar = createReactClass({
  propTypes: {
    prefixCls: PropTypes.string,
    dateInputPlaceholder: PropTypes.any,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    hoverValue: PropTypes.any,
    mode: PropTypes.arrayOf(PropTypes.oneOf(['date', 'month', 'year', 'decade'])),
    showDateInput: PropTypes.bool,
    timePicker: PropTypes.any,
    showOk: PropTypes.bool,
    showToday: PropTypes.bool,
    defaultSelectedValue: PropTypes.array,
    selectedValue: PropTypes.array,
    onOk: PropTypes.func,
    showClear: PropTypes.bool,
    locale: PropTypes.object,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onValueChange: PropTypes.func,
    onHoverChange: PropTypes.func,
    onPanelChange: PropTypes.func,
    format: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onClear: PropTypes.func,
    type: PropTypes.any,
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.func,
  },

  mixins: [CommonMixin],

  getDefaultProps () {
    return {
      type: 'both',
      defaultSelectedValue: [],
      onValueChange: noop,
      onHoverChange: noop,
      onPanelChange: noop,
      disabledTime: noop,
      onInputSelect: noop,
      showToday: true,
      showDateInput: true,
    }
  },

  getInitialState () {
    const props = this.props
    const selectedValue = props.selectedValue || props.defaultSelectedValue
    const value = normalizeAnchor(props, 1)
    return {
      selectedValue,
      prevSelectedValue: selectedValue,
      firstSelectedValue: null,
      hoverValue: props.hoverValue || [],
      value,
      showTimePicker: false,
      mode: props.mode || ['date', 'date'],
    }
  },

  componentWillReceiveProps (nextProps) {
    const { state } = this
    const newState = {}
    if ('value' in nextProps) {
      newState.value = normalizeAnchor(nextProps, 0)
      this.setState(newState)
    }
    if ('hoverValue' in nextProps && !isArraysEqual(state.hoverValue, nextProps.hoverValue)) {
      this.setState({ hoverValue: nextProps.hoverValue })
    }
    if ('selectedValue' in nextProps) {
      newState.selectedValue = nextProps.selectedValue
      newState.prevSelectedValue = nextProps.selectedValue
      this.setState(newState)
    }
    if ('mode' in nextProps && !isArraysEqual(state.mode, nextProps.mode)) {
      this.setState({ mode: nextProps.mode })
    }
  },

  onDatePanelEnter () {
    if (this.hasSelectedValue()) {
      this.fireHoverValueChange(this.state.selectedValue.concat())
    }
  },

  onDatePanelLeave () {
    if (this.hasSelectedValue()) {
      this.fireHoverValueChange([])
    }
  },

  onSelect (value) {
    const { type } = this.props
    const { selectedValue, prevSelectedValue, firstSelectedValue } = this.state
    let nextSelectedValue
    if (type === 'both') {
      if (!firstSelectedValue) {
        syncTime(prevSelectedValue[0], value)
        nextSelectedValue = [value]
      } else if (this.compare(firstSelectedValue, value) < 0) {
        syncTime(prevSelectedValue[1], value)
        nextSelectedValue = [firstSelectedValue, value]
      } else {
        syncTime(prevSelectedValue[0], value)
        syncTime(prevSelectedValue[1], firstSelectedValue)
        nextSelectedValue = [value, firstSelectedValue]
      }
    } else if (type === 'start') {
      syncTime(prevSelectedValue[0], value)
      const endValue = selectedValue[1]
      nextSelectedValue = endValue && this.compare(endValue, value) > 0
        ? [value, endValue] : [value]
    } else { // type === 'end'
      const startValue = selectedValue[0]
      if (startValue && this.compare(startValue, value) <= 0) {
        syncTime(prevSelectedValue[1], value)
        nextSelectedValue = [startValue, value]
      } else {
        syncTime(prevSelectedValue[0], value)
        nextSelectedValue = [value]
      }
    }

    this.fireSelectValueChange(nextSelectedValue)
  },

  onDayHover (value) {
    let hoverValue = []
    const { selectedValue, firstSelectedValue } = this.state
    const { type } = this.props
    if (type === 'start' && selectedValue[1]) {
      hoverValue = this.compare(value, selectedValue[1]) < 0
        ? [value, selectedValue[1]] : [value]
    } else if (type === 'end' && selectedValue[0]) {
      hoverValue = this.compare(value, selectedValue[0]) > 0
        ? [selectedValue[0], value] : []
    } else {
      if (!firstSelectedValue) {
        return
      }
      hoverValue = this.compare(value, firstSelectedValue) < 0
        ? [value, firstSelectedValue] : [firstSelectedValue, value]
    }
    this.fireHoverValueChange(hoverValue)
  },

  onToday () {
    const startValue = getTodayTime(this.state.value[0])
    const endValue = startValue.clone().add(1, 'months')
    this.setState({ value: [startValue, endValue] })
  },

  onOpenTimePicker () {
    this.setState({
      showTimePicker: true,
    })
  },
  onCloseTimePicker () {
    this.setState({
      showTimePicker: false,
    })
  },

  onOk () {
    const { selectedValue } = this.state
    if (this.isAllowedDateAndTime(selectedValue)) {
      this.props.onOk(this.state.selectedValue)
    }
  },

  onStartInputSelect (...oargs) {
    const args = ['left'].concat(oargs)
    return onInputSelect.apply(this, args)
  },

  onEndInputSelect (...oargs) {
    const args = ['right'].concat(oargs)
    return onInputSelect.apply(this, args)
  },

  onStartValueChange (leftValue) {
    const value = [...this.state.value]
    value[0] = leftValue
    return this.fireValueChange(value)
  },

  onEndValueChange (rightValue) {
    const value = [...this.state.value]
    value[1] = rightValue
    return this.fireValueChange(value)
  },

  onStartPanelChange (value, mode) {
    const { props, state } = this
    const newMode = [mode, state.mode[1]]
    if (!('mode' in props)) {
      this.setState({
        mode: newMode,
      })
    }
    const newValue = [value || state.value[0], state.value[1]]
    props.onPanelChange(newValue, newMode)
  },

  onEndPanelChange (value, mode) {
    const { props, state } = this
    const newMode = [state.mode[0], mode]
    if (!('mode' in props)) {
      this.setState({
        mode: newMode,
      })
    }
    const newValue = [state.value[0], value || state.value[1]]
    props.onPanelChange(newValue, newMode)
  },

  getStartValue () {
    let value = this.state.value[0]
    const selectedValue = this.state.selectedValue
    // keep selectedTime when select date
    if (selectedValue[0] && this.props.timePicker) {
      value = value.clone()
      syncTime(selectedValue[0], value)
    }
    if (this.state.showTimePicker && selectedValue[0]) {
      return selectedValue[0]
    }
    return value
  },

  getEndValue () {
    const { value, selectedValue, showTimePicker } = this.state
    const endValue = value[1] ? value[1].clone() : value[0].clone().add(1, 'month')
    // keep selectedTime when select date
    if (selectedValue[1] && this.props.timePicker) {
      syncTime(selectedValue[1], endValue)
    }
    if (showTimePicker) {
      return selectedValue[1] ? selectedValue[1] : this.getStartValue()
    }
    return endValue
  },
  // get disabled hours for second picker
  getEndDisableTime () {
    const { selectedValue, value } = this.state
    const { disabledTime } = this.props
    const userSettingDisabledTime = disabledTime(selectedValue, 'end') || {}
    const startValue = selectedValue && selectedValue[0] || value[0].clone()
    // if startTime and endTime is same day..
    // the second time picker will not able to pick time before first time picker
    if (!selectedValue[1] || startValue.isSame(selectedValue[1], 'day')) {
      const hours = startValue.hour()
      const minutes = startValue.minute()
      const second = startValue.second()
      let { disabledHours, disabledMinutes, disabledSeconds } = userSettingDisabledTime
      const oldDisabledMinutes = disabledMinutes ? disabledMinutes() : []
      const olddisabledSeconds = disabledSeconds ? disabledSeconds() : []
      disabledHours = generateOptions(hours, disabledHours)
      disabledMinutes = generateOptions(minutes, disabledMinutes)
      disabledSeconds = generateOptions(second, disabledSeconds)
      return {
        disabledHours () {
          return disabledHours
        },
        disabledMinutes (hour) {
          if (hour === hours) {
            return disabledMinutes
          }
          return oldDisabledMinutes
        },
        disabledSeconds (hour, minute) {
          if (hour === hours && minute === minutes) {
            return disabledSeconds
          }
          return olddisabledSeconds
        },
      }
    }
    return userSettingDisabledTime
  },

  isAllowedDateAndTime (selectedValue) {
    return isAllowedDate(selectedValue[0], this.props.disabledDate, this.disabledStartTime) &&
    isAllowedDate(selectedValue[1], this.props.disabledDate, this.disabledEndTime)
  },

  isMonthYearPanelShow (mode) {
    return ['month', 'year', 'decade'].indexOf(mode) > -1
  },

  hasSelectedValue () {
    const { selectedValue } = this.state
    return !!selectedValue[1] && !!selectedValue[0]
  },

  compare (v1, v2) {
    if (this.props.timePicker) {
      return v1.diff(v2)
    }
    return v1.diff(v2, 'days')
  },

  fireSelectValueChange (selectedValue, direct) {
    const { timePicker } = this.props
    const { prevSelectedValue } = this.state
    if (timePicker && timePicker.props.defaultValue) {
      const timePickerDefaultValue = timePicker.props.defaultValue
      if (!prevSelectedValue[0] && selectedValue[0]) {
        syncTime(timePickerDefaultValue[0], selectedValue[0])
      }
      if (!prevSelectedValue[1] && selectedValue[1]) {
        syncTime(timePickerDefaultValue[1], selectedValue[1])
      }
    }

    if (!('selectedValue' in this.props)) {
      this.setState({
        selectedValue,
      })
    }

    // 尚未选择过时间，直接输入的话
    if (!this.state.selectedValue[0] || !this.state.selectedValue[1]) {
      const startValue = selectedValue[0] || moment()
      const endValue = selectedValue[1] || startValue.clone().add(1, 'months')
      this.setState({
        selectedValue,
        value: getValueFromSelectedValue([startValue, endValue]),
      })
    }

    if (selectedValue[0] && !selectedValue[1]) {
      this.setState({ firstSelectedValue: selectedValue[0] })
      this.fireHoverValueChange(selectedValue.concat())
    }
    this.props.onChange(selectedValue)
    if (direct || selectedValue[0] && selectedValue[1]) {
      this.setState({
        prevSelectedValue: selectedValue,
        firstSelectedValue: null,
      })
      this.fireHoverValueChange([])
      this.props.onSelect(selectedValue)
    }
  },

  fireValueChange (value) {
    const props = this.props
    if (!('value' in props)) {
      this.setState({
        value,
      })
    }
    props.onValueChange(value)
  },

  fireHoverValueChange (hoverValue) {
    const props = this.props
    if (!('hoverValue' in props)) {
      this.setState({ hoverValue })
    }
    props.onHoverChange(hoverValue)
  },

  clear () {
    this.fireSelectValueChange([], true)
    this.props.onClear()
  },

  disabledStartTime (time) {
    return this.props.disabledTime(time, 'start')
  },

  disabledEndTime (time) {
    return this.props.disabledTime(time, 'end')
  },

  disabledStartMonth (month) {
    const { value } = this.state
    return month.isSameOrAfter(value[1], 'month')
  },

  disabledEndMonth (month) {
    const { value } = this.state
    return month.isSameOrBefore(value[0], 'month')
  },

  render () {
    const { props, state } = this
    const {
      prefixCls, dateInputPlaceholder,
      timePicker, showOk, locale, showClear,
      showToday, type,
    } = props
    const {
      hoverValue,
      selectedValue,
      mode,
      showTimePicker,
    } = state
    const className = {
      [props.className]: !!props.className,
      [prefixCls]: 1,
      [`${prefixCls}-hidden`]: !props.visible,
      [`${prefixCls}-range`]: 1,
      [`${prefixCls}-show-time-picker`]: showTimePicker,
      [`${prefixCls}-week-number`]: props.showWeekNumber,
    }
    const classes = classnames(className)
    const newProps = {
      selectedValue: state.selectedValue,
      onSelect: this.onSelect,
      onDayHover: type === 'start' && selectedValue[1] ||
      type === 'end' && selectedValue[0] || !!hoverValue.length
        ? this.onDayHover : undefined,
    }

    let placeholder1
    let placeholder2

    if (dateInputPlaceholder) {
      if (Array.isArray(dateInputPlaceholder)) {
        [placeholder1, placeholder2] = dateInputPlaceholder
      } else {
        placeholder1 = placeholder2 = dateInputPlaceholder
      }
    }
    const showOkButton = showOk === true || showOk !== false && !!timePicker
    const cls = classnames({
      [`${prefixCls}-footer`]: true,
      [`${prefixCls}-range-bottom`]: true,
      [`${prefixCls}-footer-show-ok`]: showOkButton,
    })

    const startValue = this.getStartValue()
    const endValue = this.getEndValue()
    const todayTime = getTodayTime(startValue)
    const thisMonth = todayTime.month()
    const thisYear = todayTime.year()
    const isTodayInView =
            startValue.year() === thisYear && startValue.month() === thisMonth ||
            endValue.year() === thisYear && endValue.month() === thisMonth
    const nextMonthOfStart = startValue.clone().add(1, 'months')
    const isClosestMonths = nextMonthOfStart.year() === endValue.year() &&
            nextMonthOfStart.month() === endValue.month()
    return (
      <div
        ref={this.saveRoot}
        className={classes}
        style={props.style}
        tabIndex='0'
      >
        {props.renderSidebar()}
        <div className={`${prefixCls}-panel`}>
          {showClear && selectedValue[0] && selectedValue[1]
            ? <a
              className={`${prefixCls}-clear-btn`}
              role='button'
              title={locale.clear}
              onClick={this.clear}
            /> : null}
          <div
            className={`${prefixCls}-date-panel`}
            onMouseLeave={type !== 'both' ? this.onDatePanelLeave : undefined}
            onMouseEnter={type !== 'both' ? this.onDatePanelEnter : undefined}
          >
            <CalendarPart
              {...props}
              {...newProps}
              hoverValue={hoverValue}
              direction='left'
              disabledTime={this.disabledStartTime}
              disabledMonth={this.disabledStartMonth}
              format={this.getFormat()}
              value={startValue}
              mode={mode[0]}
              placeholder={placeholder1}
              onInputSelect={this.onStartInputSelect}
              onValueChange={this.onStartValueChange}
              onPanelChange={this.onStartPanelChange}
              showDateInput={this.props.showDateInput}
              timePicker={timePicker}
              showTimePicker={showTimePicker}
              enablePrev
              enableNext={!isClosestMonths || this.isMonthYearPanelShow(mode[1])}
            />
            <span className={`${prefixCls}-range-middle`}>~</span>
            <CalendarPart
              {...props}
              {...newProps}
              hoverValue={hoverValue}
              direction='right'
              format={this.getFormat()}
              timePickerDisabledTime={this.getEndDisableTime()}
              placeholder={placeholder2}
              value={endValue}
              mode={mode[1]}
              onInputSelect={this.onEndInputSelect}
              onValueChange={this.onEndValueChange}
              onPanelChange={this.onEndPanelChange}
              showDateInput={this.props.showDateInput}
              timePicker={timePicker}
              showTimePicker={showTimePicker}
              disabledTime={this.disabledEndTime}
              disabledMonth={this.disabledEndMonth}
              enablePrev={!isClosestMonths || this.isMonthYearPanelShow(mode[0])}
              enableNext
            />
          </div>
          <div className={cls}>
            {props.renderFooter()}
            {showToday || props.timePicker || showOkButton ? (
              <div className={`${prefixCls}-footer-btn`}>
                {showToday ? (
                  <TodayButton
                    {...props}
                    disabled={isTodayInView}
                    value={state.value[0]}
                    onToday={this.onToday}
                    text={locale.backToToday}
                  />
                ) : null}
                {props.timePicker
                  ? <TimePickerButton
                    {...props}
                    showTimePicker={showTimePicker}
                    onOpenTimePicker={this.onOpenTimePicker}
                    onCloseTimePicker={this.onCloseTimePicker}
                    timePickerDisabled={!this.hasSelectedValue() || hoverValue.length}
                  /> : null}
                {showOkButton
                  ? <OkButton
                    {...props}
                    onOk={this.onOk}
                    okDisabled={!this.isAllowedDateAndTime(selectedValue) ||
                      !this.hasSelectedValue() || hoverValue.length
                    }
                  /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  },
})

export default RangeCalendar
</script>
