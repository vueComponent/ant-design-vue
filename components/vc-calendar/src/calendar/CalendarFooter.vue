<script>
import PropTypes from '@/components/_util/vue-types'
import BaseMixin from '@/components/_util/BaseMixin'
import { getOptionProps } from '@/components/_util/props-util'
import TodayButton from '../calendar/TodayButton'
import OkButton from '../calendar/OkButton'
import TimePickerButton from '../calendar/TimePickerButton'

const CalendarFooter = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    showDateInput: PropTypes.bool,
    disabledTime: PropTypes.any,
    timePicker: PropTypes.any,
    selectedValue: PropTypes.any,
    showOk: PropTypes.bool,
    // onSelect: PropTypes.func,
    value: PropTypes.object,
    renderFooter: PropTypes.func,
    defaultValue: PropTypes.object,
    locale: PropTypes.object,
    showToday: PropTypes.bool.def(true),
    disabledDate: PropTypes.func,
    showTimePicker: PropTypes.bool,
    okDisabled: PropTypes.bool,
  },
  methods: {
    onSelect (value) {
      this.__emit('select', value)
    },

    getRootDOMNode () {
      return this.$el
    },
  },

  render () {
    const props = getOptionProps(this)
    const { $listeners } = this
    const { value, prefixCls, showOk, timePicker, renderFooter, showToday } = props
    let footerEl = null
    const extraFooter = renderFooter()
    if (showToday || timePicker || extraFooter) {
      const btnProps = {
        props: {
          ...props,
          value: value,
        },
        on: $listeners,
      }
      console.log(props)
      let nowEl = null
      if (showToday) {
        nowEl = <TodayButton {...btnProps} />
      }
      delete btnProps.props.value
      let okBtn = null
      if (showOk === true || showOk !== false && !!timePicker) {
        okBtn = <OkButton {...btnProps} />
      }
      let timePickerBtn = null
      if (timePicker) {
        timePickerBtn = <TimePickerButton {...btnProps} />
      }

      let footerBtn
      if (nowEl || timePickerBtn || okBtn) {
        footerBtn = (<span class={`${prefixCls}-footer-btn`}>
          {nowEl}{timePickerBtn}{okBtn}
        </span>)
      }
      const cls = {
        [`${prefixCls}-footer`]: true,
        [`${prefixCls}-footer-show-ok`]: okBtn,
      }
      footerEl = (
        <div class={cls}>
          {extraFooter}
          {footerBtn}
        </div>)
    }
    return footerEl
  },
}

export default CalendarFooter
</script>
