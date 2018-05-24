
import * as moment from 'moment'
import MonthCalendar from '../vc-calendar/src/MonthCalendar'
import VcDatePicker from '../vc-calendar/src/Picker'
import classNames from 'classnames'
import Icon from '../icon'
import interopDefault from '../_util/interopDefault'
import BaseMixin from '../_util/BaseMixin'
import { hasProp, getOptionProps, initDefaultProps, mergeProps } from '../_util/props-util'

// export const PickerProps = {
//   value?: moment.Moment;
//   prefixCls: string;
// }
function noop () {}
export default function createPicker (TheCalendar, props) {
  return {
    // static defaultProps = {
    //   prefixCls: 'ant-calendar',
    //   allowClear: true,
    //   showToday: true,
    // };

    // private input: any;
    props: initDefaultProps(props, {
      prefixCls: 'ant-calendar',
      allowClear: true,
      showToday: true,
    }),
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
        showDate: value,
      }
    },
    watch: {
      value (val) {
        this.setState({
          sValue: val,
          showDate: val,
        })
      },
    },
    methods: {
      renderFooter (...args) {
        const { prefixCls, $scopedSlots, $slots } = this
        const renderExtraFooter = this.renderExtraFooter || $scopedSlots.renderExtraFooter || $slots.renderExtraFooter
        return renderExtraFooter ? (
          <div class={`${prefixCls}-footer-extra`}>
            {typeof renderExtraFooter === 'function' ? renderExtraFooter(...args) : renderExtraFooter}
          </div>
        ) : null
      },

      clearSelection (e) {
        e.preventDefault()
        e.stopPropagation()
        this.handleChange(null)
      },

      handleChange (value) {
        if (!hasProp(this, 'value')) {
          this.setState({
            sValue: value,
            showDate: value,
          })
        }
        this.$emit('change', value, (value && value.format(this.format)) || '')
      },

      handleCalendarChange (value) {
        this.setState({ showDate: value })
      },

      focus () {
        this.$refs.input.focus()
      },

      blur () {
        this.$refs.input.blur()
      },
    },

    render () {
      const { sValue: value, showDate, $listeners, $scopedSlots } = this
      const { panelChange = noop, focus = noop, blur = noop, ok = noop } = $listeners
      const props = getOptionProps(this)
      const { prefixCls, locale, localeCode } = props
      const dateRender = props.dateRender || $scopedSlots.dateRender
      const monthCellContentRender = props.monthCellContentRender || $scopedSlots.monthCellContentRender
      const placeholder = ('placeholder' in props)
        ? props.placeholder : locale.lang.placeholder

      const disabledTime = props.showTime ? props.disabledTime : null

      const calendarClassName = classNames({
        [`${prefixCls}-time`]: props.showTime,
        [`${prefixCls}-month`]: MonthCalendar === TheCalendar,
      })

      if (value && localeCode) {
        value.locale(localeCode)
      }

      const pickerProps = { props: {}, on: {}}
      const calendarProps = { props: {}, on: {}}
      if (props.showTime) {
        // fix https://github.com/ant-design/ant-design/issues/1902
        calendarProps.on.select = this.handleChange
      } else {
        pickerProps.on.change = this.handleChange
      }
      if ('mode' in props) {
        calendarProps.props.mode = props.mode
      }
      const theCalendarProps = mergeProps(calendarProps, {
        props: {
          disabledDate: props.disabledDate,
          disabledTime,
          locale: locale.lang,
          timePicker: props.timePicker,
          defaultValue: props.defaultPickerValue || interopDefault(moment)(),
          dateInputPlaceholder: placeholder,
          prefixCls,
          dateRender,
          format: props.format,
          showToday: props.showToday,
          monthCellContentRender,
          renderFooter: this.renderFooter,
          value: showDate,
        },
        on: {
          ok: ok,
          panelChange: panelChange,
          change: this.handleCalendarChange,
        },
        class: calendarClassName,
        scopedSlots: $scopedSlots,
      })
      const calendar = (
        <TheCalendar
          {...theCalendarProps}
        />
      )

      const clearIcon = (!props.disabled && props.allowClear && value) ? (
        <Icon
          type='cross-circle'
          class={`${prefixCls}-picker-clear`}
          onClick={this.clearSelection}
        />
      ) : null

      const input = ({ value: inputValue }) => (
        <div>
          <input
            ref='input'
            disabled={props.disabled}
            readOnly
            value={(inputValue && inputValue.format(props.format)) || ''}
            placeholder={placeholder}
            class={props.pickerInputClass}
          />
          {clearIcon}
          <span class={`${prefixCls}-picker-icon`} />
        </div>
      )
      const vcDatePickerProps = {
        props: {
          ...props,
          ...pickerProps.props,
          calendar,
          value,
          prefixCls: `${prefixCls}-picker-container`,
        },
        on: {
          ...$listeners,
          ...pickerProps.on,
        },
        style: props.popupStyle,
      }
      return (
        <span
          class={props.pickerClass}
          // tabIndex={props.disabled ? -1 : 0}
          // onFocus={focus}
          // onBlur={blur}
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
}
