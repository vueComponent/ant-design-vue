<script>
import PropTypes from '@/components/_util/vue-types'
import BaseMixin from '@/components/_util/BaseMixin'
import { getOptionProps, hasProp, getEvents, getStyle } from '@/components/_util/props-util'
import { cloneElement } from '@/components/_util/vnode'
import createChainedFunction from '@/components/_util/createChainedFunction'
import KeyCode from '@/components/_util/KeyCode'
import placements from './picker/placements'
import Trigger from '@/components/trigger'

const Picker = {
  props: {
    animation: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    disabled: PropTypes.bool,
    transitionName: PropTypes.string,
    // onChange: PropTypes.func,
    // onOpenChange: PropTypes.func,
    children: PropTypes.func,
    getCalendarContainer: PropTypes.func,
    calendar: PropTypes.any,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool.def(false),
    prefixCls: PropTypes.string.def('rc-calendar-picker'),
    placement: PropTypes.any.def('bottomLeft'),
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    align: PropTypes.object.def({}),
  },
  mixins: [BaseMixin],

  data () {
    const props = this.$props
    let open
    if (hasProp(this, 'open')) {
      open = props.open
    } else {
      open = props.defaultOpen
    }
    const value = props.value || props.defaultValue
    return {
      sOpen: open,
      sValue: value,
    }
  },
  watch: {
    value (val) {
      this.setState({
        sValue: val,
      })
    },
    open (val) {
      this.setState({
        sOpen: val,
      })
    },
  },
  mounted () {
    this.preSOpen = this.sOpen
  },
  updated () {
    if (!this.preSOpen && this.sOpen) {
      // setTimeout is for making sure saveCalendarRef happen before focusCalendar
      this.focusTimeout = setTimeout(this.focusCalendar, 0)
    }
    this.preSOpen = this.sOpen
  },

  beforeDestroy () {
    clearTimeout(this.focusTimeout)
  },
  methods: {
    onCalendarKeyDown (event) {
      if (event.keyCode === KeyCode.ESC) {
        event.stopPropagation()
        this.close(this.focus)
      }
    },

    onCalendarSelect (value, cause = {}) {
      const props = this.$props
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value,
        })
      }
      const calendarProps = getOptionProps(props.calendar)
      if (
        cause.source === 'keyboard' ||
      (!calendarProps.timePicker && cause.source !== 'dateInput') ||
      cause.source === 'todayButton') {
        this.close(this.focus)
      }
      this.__emit('change', value)
    },

    onKeyDown (event) {
      if (event.keyCode === KeyCode.DOWN && !this.sOpen) {
        this.open()
        event.preventDefault()
      }
    },

    onCalendarOk () {
      this.close(this.focus)
    },

    onCalendarClear () {
      this.close(this.focus)
    },

    onVisibleChange (open) {
      this.setOpen(open)
    },

    getCalendarElement () {
      const props = this.$props
      const calendarProps = getOptionProps(props.calendar)
      const calendarEvents = getEvents(props.calendar)
      const { sValue: value } = this
      const defaultValue = value
      const extraProps = {
        ref: 'calendarInstance',
        props: {
          defaultValue: defaultValue || calendarProps.defaultValue,
          selectedValue: value,
        },
        on: {
          keydown: this.onCalendarKeyDown,
          ok: createChainedFunction(calendarEvents.ok, this.onCalendarOk),
          select: createChainedFunction(calendarEvents.select, this.onCalendarSelect),
          clear: createChainedFunction(calendarEvents.clear, this.onCalendarClear),
        },

      }

      return cloneElement(props.calendar, extraProps)
    },

    setOpen (open, callback) {
      if (this.sOpen !== open) {
        if (!hasProp(this, 'open')) {
          this.setState({
            sOpen: open,
          }, callback)
        }
        this.__emit('openChange', open)
      }
    },

    open (callback) {
      this.setOpen(true, callback)
    },

    close (callback) {
      this.setOpen(false, callback)
    },

    focus () {
      if (!this.sOpen) {
        this.$el.focus()
      }
    },

    focusCalendar () {
      if (this.sOpen && !!this.$refs.calendarInstance) {
        this.$refs.calendarInstance.focus()
      }
    },
  },

  render () {
    const props = getOptionProps(this)
    const style = getStyle(this)
    const {
      prefixCls, placement,
      getCalendarContainer,
      align, animation,
      disabled,
      dropdownClassName,
      transitionName, children,
    } = props
    const state = this.$data
    return (<Trigger
      popupAlign={align}
      builtinPlacements={placements}
      popupPlacement={placement}
      action={(disabled && !state.sOpen) ? [] : ['click']}
      destroyPopupOnHide
      getPopupContainer={getCalendarContainer}
      popupStyle={style}
      popupAnimation={animation}
      popupTransitionName={transitionName}
      popupVisible={state.sOpen}
      onPopupVisibleChange={this.onVisibleChange}
      prefixCls={prefixCls}
      popupClassName={dropdownClassName}
    >
      <template slot='popup'>
        {this.getCalendarElement()}
      </template>
      {cloneElement(children(state, props), { on: { keydown: this.onKeyDown }})}
    </Trigger>)
  },
}

export default Picker
</script>
