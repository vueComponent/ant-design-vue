
import PropTypes from '../../../_util/vue-types'
import BaseMixin from '../../../_util/BaseMixin'
import moment from 'moment'

const DateInput = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    timePicker: PropTypes.object,
    value: PropTypes.object,
    disabledTime: PropTypes.any,
    format: PropTypes.string,
    locale: PropTypes.object,
    disabledDate: PropTypes.func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    placeholder: PropTypes.string,
    // onSelect: PropTypes.func,
    selectedValue: PropTypes.object,
  },

  data () {
    const selectedValue = this.selectedValue
    return {
      str: selectedValue && selectedValue.format(this.format) || '',
      invalid: false,
    }
  },
  watch: {
    selectedValue () {
      this.updateState()
    },
    format () {
      this.updateState()
    },
  },

  updated () {
    this.$nextTick(() => {
      if (!this.invalid) {
        this.$refs.dateInputInstance.setSelectionRange(this.cachedSelectionStart, this.cachedSelectionEnd)
      }
    })
  },
  methods: {
    updateState () {
      this.cachedSelectionStart = this.$refs.dateInputInstance.selectionStart
      this.cachedSelectionEnd = this.$refs.dateInputInstance.selectionEnd
      // when popup show, click body will call this, bug!
      const selectedValue = this.selectedValue
      this.setState({
        str: selectedValue && selectedValue.format(this.format) || '',
        invalid: false,
      })
    },
    onInputChange (event) {
      const str = event.target.value
      this.setState({
        str,
      })
      let value
      const { disabledDate, format } = this
      if (str) {
        const parsed = moment(str, format, true)
        if (!parsed.isValid()) {
          this.setState({
            invalid: true,
          })
          return
        }
        value = this.value.clone()
        value
          .year(parsed.year())
          .month(parsed.month())
          .date(parsed.date())
          .hour(parsed.hour())
          .minute(parsed.minute())
          .second(parsed.second())

        if (value && (!disabledDate || !disabledDate(value))) {
          const originalValue = this.selectedValue
          if (originalValue && value) {
            if (!originalValue.isSame(value)) {
              this.__emit('change', value)
            }
          } else if (originalValue !== value) {
            this.__emit('change', value)
          }
        } else {
          this.setState({
            invalid: true,
          })
          return
        }
      } else {
        this.__emit('change', null)
      }
      this.setState({
        invalid: false,
      })
    },

    onClear () {
      this.setState({
        str: '',
      })
      this.__emit('clear', null)
    },

    getRootDOMNode () {
      return this.$el
    },

    focus () {
      if (this.$refs.dateInputInstance) {
        this.$refs.dateInputInstance.focus()
      }
    },
  },

  render () {
    const { invalid, str, locale, prefixCls, placeholder, disabled, showClear } = this
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : ''
    return (<div class={`${prefixCls}-input-wrap`}>
      <div class={`${prefixCls}-date-input-wrap`}>
        <input
          ref='dateInputInstance'
          class={`${prefixCls}-input ${invalidClass}`}
          value={str}
          disabled={disabled}
          placeholder={placeholder}
          onInput={this.onInputChange}
        />
      </div>
      {showClear ? <a
        class={`${prefixCls}-clear-btn`}
        role='button'
        title={locale.clear}
        onClick={this.onClear}
      /> : null}
    </div>)
  },
}

export default DateInput

