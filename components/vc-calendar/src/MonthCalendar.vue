<script>
import PropTypes from '@/components/_util/vue-types'
import BaseMixin from '@/components/_util/BaseMixin'
import KeyCode from '@/components/_util/KeyCode'
import CalendarHeader from './calendar/CalendarHeader'
import CalendarFooter from './calendar/CalendarFooter'
import CalendarMixin from './mixin/CalendarMixin'
import CommonMixin from './mixin/CommonMixin'

const MonthCalendar = {
  props: {
    monthCellRender: PropTypes.func,
    dateCellRender: PropTypes.func,
  },
  mixins: [BaseMixin, CommonMixin, CalendarMixin],

  data () {
    return { mode: 'month' }
  },
  methods: {
    onKeyDown (event) {
      const keyCode = event.keyCode
      const ctrlKey = event.ctrlKey || event.metaKey
      const stateValue = this.sValue
      const { disabledDate } = this
      let value = stateValue
      switch (keyCode) {
        case KeyCode.DOWN:
          value = stateValue.clone()
          value.add(3, 'months')
          break
        case KeyCode.UP:
          value = stateValue.clone()
          value.add(-3, 'months')
          break
        case KeyCode.LEFT:
          value = stateValue.clone()
          if (ctrlKey) {
            value.add(-1, 'years')
          } else {
            value.add(-1, 'months')
          }
          break
        case KeyCode.RIGHT:
          value = stateValue.clone()
          if (ctrlKey) {
            value.add(1, 'years')
          } else {
            value.add(1, 'months')
          }
          break
        case KeyCode.ENTER:
          if (!disabledDate || !disabledDate(stateValue)) {
            this.onSelect(stateValue)
          }
          event.preventDefault()
          return 1
        default:
          return undefined
      }
      if (value !== stateValue) {
        this.setValue(value)
        event.preventDefault()
        return 1
      }
    },

    handlePanelChange (_, mode) {
      if (mode !== 'date') {
        this.setState({ mode })
      }
    },
  },

  render () {
    const { mode, sValue: value, $props: props } = this
    const children = (
      <div class={`${props.prefixCls}-month-calendar-content`}>
        <div class={`${props.prefixCls}-month-header-wrap`}>
          <CalendarHeader
            prefixCls={props.prefixCls}
            mode={mode}
            value={value}
            locale={props.locale}
            disabledMonth={props.disabledDate}
            monthCellRender={props.monthCellRender}
            monthCellContentRender={props.monthCellContentRender}
            onMonthSelect={this.onSelect}
            onValueChange={this.setValue}
            onPanelChange={this.handlePanelChange}
          />
        </div>
        <CalendarFooter
          prefixCls={props.prefixCls}
          renderFooter={props.renderFooter}
        />
      </div>
    )
    return this.renderRoot({
      class: `${props.prefixCls}-month-calendar`,
      children,
    })
  },
}

export default MonthCalendar
</script>
