<script>
import PropTypes from '@/components/_util/vue-types'
import BaseMixin from '@/components/_util/BaseMixin'
import { getOptionProps, hasProp, initDefaultProps } from '@/components/_util/props-util'
import * as moment from 'moment'
import FullCalendar from '../vc-calendar/src/FullCalendar'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import { PREFIX_CLS } from './Constants'
import Header from './Header'
import callMoment from '../_util/callMoment'
import enUS from './locale/en_US'

export { HeaderProps } from './Header'

function noop () { return null }

function zerofixed (v) {
  if (v < 10) {
    return `0${v}`
  }
  return `${v}`
}
export const MomentType = {
  type: Object,
  validator: function (value) {
    return moment.isMoment(value)
  },
}
export const CalendarMode = PropTypes.oneOf(['month', 'year'])

export const CalendarProps = () => ({
  prefixCls: PropTypes.string,
  value: MomentType,
  defaultValue: MomentType,
  mode: CalendarMode,
  fullscreen: PropTypes.bool,
  dateCellRender: PropTypes.func,
  monthCellRender: PropTypes.func,
  dateFullCellRender: PropTypes.func,
  monthFullCellRender: PropTypes.func,
  locale: PropTypes.any,
  // onPanelChange?: (date?: moment.Moment, mode?: CalendarMode) => void;
  // onSelect?: (date?: moment.Moment) => void;
  disabledDate: PropTypes.func,
})

export default {
  mixins: [BaseMixin],
  props: initDefaultProps(CalendarProps(), {
    locale: {},
    fullscreen: true,
    prefixCls: PREFIX_CLS,
    mode: 'month',
  }),

  data () {
    const value = this.value || this.defaultValue || callMoment(moment)
    if (!moment.isMoment(value)) {
      throw new Error(
        'The value/defaultValue of Calendar must be a moment object, ',
      )
    }
    return {
      sValue: value,
      sMode: this.mode,
    }
  },
  watch: {
    value (val) {
      this.setState({
        sValue: val,
      })
    },
    mode (val) {
      this.setState({
        sMode: val,
      })
    },
  },
  methods: {
    monthCellRender (value) {
      const { prefixCls, monthCellRender = noop } = this
      return (
        <div class={`${prefixCls}-month`}>
          <div class={`${prefixCls}-value`}>
            {value.localeData().monthsShort(value)}
          </div>
          <div class={`${prefixCls}-content`}>
            {monthCellRender(value)}
          </div>
        </div>
      )
    },

    dateCellRender (value) {
      const { prefixCls, dateCellRender = noop } = this
      return (
        <div class={`${prefixCls}-date`}>
          <div class={`${prefixCls}-value`}>
            {zerofixed(value.date())}
          </div>
          <div class={`${prefixCls}-content`}>
            {dateCellRender(value)}
          </div>
        </div>
      )
    },

    setValue (value, way) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value })
      }
      if (way === 'select') {
        this.$emit('select', value)
      } else if (way === 'changePanel') {
        this.$emit('panelChange', value, this.sMode)
      }
    },

    setType  (type) {
      const mode = (type === 'date') ? 'month' : 'year'
      if (this.sMode !== mode) {
        this.setState({ sMode: mode })
        this.$emit('panelChange', this.sValue, this.sMode)
      }
    },

    onHeaderValueChange  (value) {
      this.setValue(value, 'changePanel')
    },

    onHeaderTypeChange  (type) {
      this.setType(type)
    },

    onPanelChange (value, mode) {
      this.$emit('panelChange', value, mode)
    },

    onSelect  (value) {
      this.setValue(value, 'select')
    },

    renderCalendar  (locale, localeCode) {
      const props = getOptionProps(this)
      const { sValue: value, sMode: mode, $listeners } = this
      if (value && localeCode) {
        value.locale(localeCode)
      }
      const { prefixCls, fullscreen, dateFullCellRender, monthFullCellRender } = props
      const type = (mode === 'year') ? 'month' : 'date'

      let cls = ''
      if (fullscreen) {
        cls += (` ${prefixCls}-fullscreen`)
      }

      const monthCellRender = monthFullCellRender || this.monthCellRender
      const dateCellRender = dateFullCellRender || this.dateCellRender
      const fullCalendarProps = {
        props: {
          ...props,
          Select: noop,
          locale: locale.lang,
          type: type,
          prefixCls: prefixCls,
          showHeader: false,
          value: value,
          monthCellRender: monthCellRender,
          dateCellRender: dateCellRender,
        },
        on: {
          ...$listeners,
          select: this.onSelect,
        },
      }
      return (
        <div class={cls}>
          <Header
            fullscreen={fullscreen}
            type={type}
            value={value}
            locale={locale.lang}
            prefixCls={prefixCls}
            onTypeChange={this.onHeaderTypeChange}
            onValueChange={this.onHeaderValueChange}
          />
          <FullCalendar {...fullCalendarProps}/>
        </div>
      )
    },
  },

  render () {
    return (
      <LocaleReceiver
        componentName='Calendar'
        defaultLocale={enUS}
        children={this.renderCalendar}
      />
    )
  },
}
</script>
