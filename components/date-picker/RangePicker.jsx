
import * as moment from 'moment'
import RangeCalendar from '../vc-calendar/src/RangeCalendar'
import VcDatePicker from '../vc-calendar/src/Picker'
import classNames from 'classnames'
import shallowequal from 'shallowequal'
import Icon from '../icon'
import Tag from '../tag'
import interopDefault from '../_util/interopDefault'
import { RangePickerProps } from './interface'
import { hasProp, getOptionProps, initDefaultProps, mergeProps } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
function noop () {}
function getShowDateFromValue (value) {
  const [start, end] = value
  // value could be an empty array, then we should not reset showDate
  if (!start && !end) {
    return
  }
  const newEnd = end && end.isSame(start, 'month') ? end.clone().add(1, 'month') : end
  return [start, newEnd]
}

function formatValue (value, format) {
  return (value && value.format(format)) || ''
}

function pickerValueAdapter (value) {
  if (!value) {
    return
  }
  if (Array.isArray(value)) {
    return value
  }
  return [value, value.clone().add(1, 'month')]
}

function isEmptyArray (arr) {
  if (Array.isArray(arr)) {
    return arr.length === 0 || arr.every(i => !i)
  }
  return false
}

function fixLocale (value, localeCode) {
  if (!localeCode) {
    return
  }
  if (!value || value.length === 0) {
    return
  }
  if (value[0]) {
    value[0].locale(localeCode)
  }
  if (value[1]) {
    value[1].locale(localeCode)
  }
}

export default {
  mixins: [BaseMixin],
  name: 'ARangePicker',
  props: initDefaultProps(RangePickerProps(), {
    prefixCls: 'ant-calendar',
    tagPrefixCls: 'ant-tag',
    allowClear: true,
    showToday: false,
  }),
  model: {
    prop: 'value',
    event: 'change',
  },
  data () {
    const value = this.value || this.defaultValue || []
    if (
      value[0] && !interopDefault(moment).isMoment(value[0]) ||
      value[1] && !interopDefault(moment).isMoment(value[1])
    ) {
      throw new Error(
        'The value/defaultValue of RangePicker must be a moment object array after `antd@2.0`, ' +
        'see: https://u.ant.design/date-picker-value',
      )
    }
    const pickerValue = !value || isEmptyArray(value) ? this.defaultPickerValue : value
    return {
      sValue: value,
      sShowDate: pickerValueAdapter(pickerValue || interopDefault(moment)()),
      sOpen: this.open,
      sHoverValue: [],
    }
  },
  watch: {
    value (val) {
      const value = val || []
      let state = { sValue: value }
      if (!shallowequal(val, this.sValue)) {
        state = {
          ...state,
          sShowDate: getShowDateFromValue(value) || this.sShowDate,
        }
      }
      this.setState(state)
    },
    open (val) {
      this.setState({
        sOpen: val,
      })
    },
  },
  methods: {
    clearSelection (e) {
      e.preventDefault()
      e.stopPropagation()
      this.setState({ sValue: [] })
      this.handleChange([])
    },

    clearHoverValue () {
      this.setState({ sHoverValue: [] })
    },

    handleChange (value) {
      if (!hasProp(this, 'value')) {
        this.setState(({ sShowDate }) => ({
          sValue: value,
          sShowDate: getShowDateFromValue(value) || sShowDate,
        }))
      }
      this.$emit('change', value, [
        formatValue(value[0], this.format),
        formatValue(value[1], this.format),
      ])
    },

    handleOpenChange (open) {
      if (!hasProp(this, 'open')) {
        this.setState({ sOpen: open })
      }

      if (open === false) {
        this.clearHoverValue()
      }
      this.$emit('openChange', open)
    },

    handleShowDateChange (showDate) {
      this.setState({ sShowDate: showDate })
    },

    handleHoverChange (hoverValue) {
      this.setState({ sHoverValue: hoverValue })
    },

    handleRangeMouseLeave () {
      if (this.sOpen) {
        this.clearHoverValue()
      }
    },

    handleCalendarInputSelect (value) {
      if (!value[0]) {
        return
      }
      this.setState(({ sShowDate }) => ({
        sValue: value,
        sShowDate: getShowDateFromValue(value) || sShowDate,
      }))
    },

    handleRangeClick (value) {
      if (typeof value === 'function') {
        value = value()
      }

      this.setValue(value, true)
      this.$emit('ok', value)
    },

    setValue (value, hidePanel) {
      this.handleChange(value)
      if ((hidePanel || !this.showTime) && !hasProp(this, 'open')) {
        this.setState({ sOpen: false })
      }
    },

    onMouseEnter (e) {
      this.$emit('mouseenter', e)
    },
    onMouseLeave (e) {
      this.$emit('mouseleave', e)
    },

    focus () {
      this.$refs.picker.focus()
    },

    blur () {
      this.$refs.picker.blur()
    },

    renderFooter (...args) {
      const { prefixCls, ranges, $scopedSlots, $slots, tagPrefixCls } = this
      const renderExtraFooter = this.renderExtraFooter || $scopedSlots.renderExtraFooter || $slots.renderExtraFooter
      if (!ranges && !renderExtraFooter) {
        return null
      }
      const customFooter = renderExtraFooter ? (
        <div class={`${prefixCls}-footer-extra`} key='extra'>
          {typeof renderExtraFooter === 'function' ? renderExtraFooter(...args) : renderExtraFooter}
        </div>
      ) : null
      const operations = Object.keys(ranges || {}).map((range) => {
        const value = ranges[range]
        return (
          <Tag
            key={range}
            prefixCls={tagPrefixCls}
            color='blue'
            onClick={() => this.handleRangeClick(value)}
            onMouseenter={() => this.setState({ sHoverValue: value })}
            onMouseleave={this.handleRangeMouseLeave}
          >
            {range}
          </Tag>
        )
      })
      const rangeNode = (
        <div class={`${prefixCls}-footer-extra ${prefixCls}-range-quick-selector`} key='range'>
          {operations}
        </div>
      )
      return [rangeNode, customFooter]
    },
  },

  render () {
    const props = getOptionProps(this)
    const { sValue: value, sShowDate: showDate, sHoverValue: hoverValue, sOpen: open, $listeners, $scopedSlots } = this
    const { calendarChange = noop, ok = noop, focus = noop, blur = noop, panelChange = noop } = $listeners
    const {
      prefixCls, popupStyle,
      disabledDate, disabledTime,
      showTime, showToday,
      ranges, locale, localeCode, format,
    } = props
    const dateRender = props.dateRender || $scopedSlots.dateRender
    fixLocale(value, localeCode)
    fixLocale(showDate, localeCode)

    const calendarClassName = classNames({
      [`${prefixCls}-time`]: showTime,
      [`${prefixCls}-range-with-ranges`]: ranges,
    })

    // 需要选择时间时，点击 ok 时才触发 onChange
    const pickerChangeHandler = {
      on: {
        change: this.handleChange,
      },
    }
    let calendarProps = {
      on: {
        ok: this.handleChange,
      }, props: {},
    }
    if (props.timePicker) {
      pickerChangeHandler.on.change = changedValue => this.handleChange(changedValue)
    } else {
      calendarProps = { on: {}, props: {}}
    }
    if ('mode' in props) {
      calendarProps.props.mode = props.mode
    }

    const startPlaceholder = ('placeholder' in props)
      ? props.placeholder[0] : locale.lang.rangePlaceholder[0]
    const endPlaceholder = ('placeholder' in props)
      ? props.placeholder[1] : locale.lang.rangePlaceholder[1]
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
        panelChange: panelChange,
        inputSelect: this.handleCalendarInputSelect,
      },
      class: calendarClassName,
      scopedSlots: $scopedSlots,
    })
    const calendar = (
      <RangeCalendar
        {...rangeCalendarProps}
      />
    )

    // default width for showTime
    const pickerStyle = {}
    if (props.showTime) {
      pickerStyle.width = '350px'
    }

    const clearIcon = (!props.disabled && props.allowClear && value && (value[0] || value[1])) ? (
      <Icon
        type='cross-circle'
        class={`${prefixCls}-picker-clear`}
        onClick={this.clearSelection}
      />
    ) : null

    const input = ({ value: inputValue }) => {
      const start = inputValue[0]
      const end = inputValue[1]
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
          <span class={`${prefixCls}-picker-icon`} />
        </span>
      )
    }
    const vcDatePickerProps = mergeProps({
      props,
      on: $listeners,
    }, pickerChangeHandler, {
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
    })
    return (
      <span
        ref='picker'
        class={props.pickerClass}
        style={pickerStyle}
        tabIndex={props.disabled ? -1 : 0}
        onFocus={focus}
        onBlur={blur}
        onMouseenter={this.onMouseEnter}
        onMouseleave={this.onMouseLeave}
      >
        <VcDatePicker
          {...vcDatePickerProps}
        >
          {input}
        </VcDatePicker>
      </span>
    )
  },
}

