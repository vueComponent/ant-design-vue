
import * as moment from 'moment'
import Calendar from '../vc-calendar'
import VcDatePicker from '../vc-calendar/src/Picker'
import Icon from '../icon'
import { hasProp, getOptionProps, initDefaultProps } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
import { WeekPickerProps } from './interface'
import interopDefault from '../_util/interopDefault'

function formatValue (value, format) {
  return (value && value.format(format)) || ''
}
function noop () {}

export default {
  // static defaultProps = {
  //   format: 'YYYY-wo',
  //   allowClear: true,
  // };

  // private input: any;
  props: initDefaultProps(WeekPickerProps(), {
    format: 'gggg-wo',
    allowClear: true,
  }),
  name: 'AWeekPicker',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  data () {
    const value = this.value || this.defaultValue
    if (value && !interopDefault(moment).isMoment(value)) {
      throw new Error(
        'The value/defaultValue of DatePicker or MonthPicker must be ' +
        'a moment object',
      )
    }
    return {
      sValue: value,
    }
  },
  watch: {
    value (val) {
      this.setState({ sValue: val })
    },
  },

  methods: {
    weekDateRender (current) {
      const selectedValue = this.sValue
      const { prefixCls } = this
      if (selectedValue &&
        current.year() === selectedValue.year() &&
        current.week() === selectedValue.week()) {
        return (
          <div class={`${prefixCls}-selected-day`}>
            <div class={`${prefixCls}-date`}>
              {current.date()}
            </div>
          </div>
        )
      }
      return (
        <div class={`${prefixCls}-date`}>
          {current.date()}
        </div>
      )
    },
    handleChange  (value) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value })
      }
      this.$emit('change', value, formatValue(value, this.format))
    },
    clearSelection (e) {
      e.preventDefault()
      e.stopPropagation()
      this.handleChange(null)
    },

    focus () {
      this.$refs.input.focus()
    },

    blur () {
      this.$refs.input.blur()
    },
  },

  render () {
    const props = getOptionProps(this)
    const {
      prefixCls, disabled, pickerClass, popupStyle,
      pickerInputClass, format, allowClear, locale, localeCode, disabledDate,
      sValue: pickerValue, $listeners, $scopedSlots,
    } = this
    const { focus = noop, blur = noop } = $listeners

    if (pickerValue && localeCode) {
      pickerValue.locale(localeCode)
    }

    const placeholder = hasProp(this, 'placeholder') ? this.placeholder : locale.lang.placeholder
    const weekDateRender = this.dateRender || $scopedSlots.dateRender || this.weekDateRender
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
      />
    )
    const clearIcon = (!disabled && allowClear && this.sValue) ? (
      <Icon
        type='cross-circle'
        class={`${prefixCls}-picker-clear`}
        onClick={this.clearSelection}
      />
    ) : null
    const input = ({ value }) => {
      return (
        <span>
          <input
            ref='input'
            disabled={disabled}
            readOnly
            value={(value && value.format(format)) || ''}
            placeholder={placeholder}
            class={pickerInputClass}
            onFocus={focus}
            onBlur={blur}
          />
          {clearIcon}
          <span class={`${prefixCls}-picker-icon`} />
        </span>
      )
    }
    const vcDatePickerProps = {
      props: {
        ...props,
        calendar,
        prefixCls: `${prefixCls}-picker-container`,
        value: pickerValue,
      },
      on: {
        ...$listeners,
        change: this.handleChange,
      },
      style: popupStyle,
    }
    return (
      <span class={pickerClass}>
        <VcDatePicker
          {...vcDatePickerProps}
        >
          {input}
        </VcDatePicker>
      </span>
    )
  },
}

