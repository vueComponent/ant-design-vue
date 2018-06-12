import PropTypes from '../../_util/vue-types'
import BaseMixin from '../../_util/BaseMixin'
import { initDefaultProps, hasProp } from '../../_util/props-util'
import classNames from 'classnames'
import isNegativeZero from 'is-negative-zero'
import InputHandler from './InputHandler'

function noop () {
}

function preventDefault (e) {
  e.preventDefault()
}

function defaultParser (input) {
  return input.replace(/[^\w\.-]+/g, '')
}

/**
 * When click and hold on a button - the speed of auto changin the value.
 */
const SPEED = 200

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
const DELAY = 600

/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1
const inputNumberProps = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  focusOnUpDown: PropTypes.bool,
  autoFocus: PropTypes.bool,
  // onChange: PropTypes.func,
  // onKeyDown: PropTypes.func,
  // onKeyUp: PropTypes.func,
  prefixCls: PropTypes.string,
  tabIndex: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  // onFocus: PropTypes.func,
  // onBlur: PropTypes.func,
  readOnly: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  upHandler: PropTypes.any,
  downHandler: PropTypes.any,
  useTouch: PropTypes.bool,
  formatter: PropTypes.func,
  parser: PropTypes.func,
  // onMouseEnter: PropTypes.func,
  // onMouseLeave: PropTypes.func,
  // onMouseOver: PropTypes.func,
  // onMouseOut: PropTypes.func,
  precision: PropTypes.number,
  required: PropTypes.bool,
  pattern: PropTypes.string,
}

export default {
  name: 'InputNumber',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(inputNumberProps, {
    focusOnUpDown: true,
    useTouch: false,
    prefixCls: 'rc-input-number',
    min: -MAX_SAFE_INTEGER,
    step: 1,
    parser: defaultParser,
    required: false,
  }),
  data () {
    let value
    if (hasProp(this, 'value')) {
      value = this.value
    } else {
      value = this.defaultValue
    }
    value = this.toNumber(value)

    return {
      inputValue: this.toPrecisionAsStep(value),
      sValue: value,
      focused: this.autoFocus,
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.autoFocus && !this.disabled) {
        this.focus()
      }
      this.updatedFunc()
    })
  },
  beforeUpdate () {
    this.$nextTick(() => {
      try {
        this.start = this.$refs.inputRef.selectionStart
        this.end = this.$refs.inputRef.selectionEnd
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    })
  },
  updated () {
    this.$nextTick(() => {
      this.updatedFunc()
    })
  },
  beforeDestroy () {
    this.stop()
  },
  watch: {
    value (val) {
      const value = this.focused
        ? val : this.getValidValue(val, this.min, this.max)
      this.setState({
        sValue: val,
        inputValue: this.inputting ? value : this.toPrecisionAsStep(value),
      })
    },
  },
  methods: {
    updatedFunc () {
      if (!this.pressingUpOrDown) {
        return
      }
      if (this.focusOnUpDown && this.focused) {
        const selectionRange = this.$refs.inputRef.setSelectionRange
        if (selectionRange &&
            typeof selectionRange === 'function' &&
            this.start !== undefined &&
            this.end !== undefined) {
          this.$refs.inputRef.setSelectionRange(this.start, this.end)
        } else {
          this.focus()
        }
        this.pressingUpOrDown = false
      }
    },
    onKeyDown (e, ...args) {
      if (e.keyCode === 38) {
        const ratio = this.getRatio(e)
        this.up(e, ratio)
        this.stop()
      } else if (e.keyCode === 40) {
        const ratio = this.getRatio(e)
        this.down(e, ratio)
        this.stop()
      }
      this.$emit('keydown', e, ...args)
    },
    onKeyUp (e, ...args) {
      this.stop()
      this.$emit('keyup', e, ...args)
    },
    onChange (e) {
      if (this.focused) {
        this.inputting = true
      }
      const input = this.parser(this.getValueFromEvent(e))
      this.setState({ inputValue: input })
      this.$emit('change', this.toNumberWhenUserInput(input)) // valid number or invalid string
    },
    onFocus (...args) {
      this.setState({
        focused: true,
      })
      this.$emit('focus', ...args)
    },
    onBlur (e, ...args) {
      this.inputting = false
      this.setState({
        focused: false,
      })
      const value = this.getCurrentValidValue(this.inputValue)
      // todo
      // e.persist() // fix https://github.com/react-component/input-number/issues/51
      this.setValue(value, () => {
        this.$emit('blur', e, ...args)
      })
    },
    getCurrentValidValue (value) {
      let val = value
      if (val === '') {
        val = ''
      } else if (!this.isNotCompleteNumber(val)) {
        val = this.getValidValue(val)
      } else {
        val = this.sValue
      }
      return this.toNumber(val)
    },
    getRatio (e) {
      let ratio = 1
      if (e.metaKey || e.ctrlKey) {
        ratio = 0.1
      } else if (e.shiftKey) {
        ratio = 10
      }
      return ratio
    },
    getValueFromEvent (e) {
      // optimize for chinese input expierence
      // https://github.com/ant-design/ant-design/issues/8196
      return e.target.value.trim().replace(/。/g, '.')
    },
    getValidValue (value, min = this.min, max = this.max) {
      let val = parseFloat(value, 10)
      // https://github.com/ant-design/ant-design/issues/7358
      if (isNaN(val)) {
        return value
      }
      if (val < min) {
        val = min
      }
      if (val > max) {
        val = max
      }
      return val
    },
    setValue (v, callback) {
      // trigger onChange
      const newValue = this.isNotCompleteNumber(parseFloat(v, 10)) ? undefined : parseFloat(v, 10)
      const changed = newValue !== this.sValue ||
        `${newValue}` !== `${this.inputValue}` // https://github.com/ant-design/ant-design/issues/7363
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: newValue,
          inputValue: this.toPrecisionAsStep(v),
        }, callback)
      } else {
        // always set input value same as value
        this.setState({
          inputValue: this.toPrecisionAsStep(this.sValue),
        }, callback)
      }
      if (changed) {
        this.$emit('change', newValue)
      }
    },
    getPrecision (value) {
      if (hasProp(this, 'precision')) {
        return this.precision
      }
      const valueString = value.toString()
      if (valueString.indexOf('e-') >= 0) {
        return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10)
      }
      let precision = 0
      if (valueString.indexOf('.') >= 0) {
        precision = valueString.length - valueString.indexOf('.') - 1
      }
      return precision
    },
    // step={1.0} value={1.51}
    // press +
    // then value should be 2.51, rather than 2.5
    // if this.props.precision is undefined
    // https://github.com/react-component/input-number/issues/39
    getMaxPrecision (currentValue, ratio = 1) {
      if (hasProp(this, 'precision')) {
        return this.precision
      }
      const { step } = this
      const ratioPrecision = this.getPrecision(ratio)
      const stepPrecision = this.getPrecision(step)
      const currentValuePrecision = this.getPrecision(currentValue)
      if (!currentValue) {
        return ratioPrecision + stepPrecision
      }
      return Math.max(currentValuePrecision, ratioPrecision + stepPrecision)
    },
    getPrecisionFactor (currentValue, ratio = 1) {
      const precision = this.getMaxPrecision(currentValue, ratio)
      return Math.pow(10, precision)
    },
    focus () {
      this.$refs.inputRef.focus()
    },
    blur () {
      this.$refs.inputRef.blur()
    },
    formatWrapper (num) {
      // http://2ality.com/2012/03/signedzero.html
      // https://github.com/ant-design/ant-design/issues/9439
      if (isNegativeZero(num)) {
        return '-0'
      }
      if (this.formatter) {
        return this.formatter(num)
      }
      return num
    },
    toPrecisionAsStep (num) {
      if (this.isNotCompleteNumber(num) || num === '') {
        return num
      }
      const precision = Math.abs(this.getMaxPrecision(num))
      if (precision === 0) {
        return num.toString()
      }
      if (!isNaN(precision)) {
        return Number(num).toFixed(precision)
      }
      return num.toString()
    },
    // '1.' '1x' 'xx' '' => are not complete numbers
    isNotCompleteNumber (num) {
      return (
        isNaN(num) ||
        num === '' ||
        num === null ||
        (num && num.toString().indexOf('.') === num.toString().length - 1)
      )
    },
    toNumber (num) {
      if (this.isNotCompleteNumber(num)) {
        return num
      }
      if (hasProp(this, 'precision')) {
        return Number(Number(num).toFixed(this.precision))
      }
      return Number(num)
    },
    // '1.0' '1.00'  => may be a inputing number
    toNumberWhenUserInput (num) {
      // num.length > 16 => prevent input large number will became Infinity
      if ((/\.\d*0$/.test(num) || num.length > 16) && this.focused) {
        return num
      }
      return this.toNumber(num)
    },
    upStep (val, rat) {
      const { step, min } = this
      const precisionFactor = this.getPrecisionFactor(val, rat)
      const precision = Math.abs(this.getMaxPrecision(val, rat))
      let result
      if (typeof val === 'number') {
        result =
          ((precisionFactor * val + precisionFactor * step * rat) /
          precisionFactor).toFixed(precision)
      } else {
        result = min === -Infinity ? step : min
      }
      return this.toNumber(result)
    },
    downStep (val, rat) {
      const { step, min } = this
      const precisionFactor = this.getPrecisionFactor(val, rat)
      const precision = Math.abs(this.getMaxPrecision(val, rat))
      let result
      if (typeof val === 'number') {
        result =
          ((precisionFactor * val - precisionFactor * step * rat) /
          precisionFactor).toFixed(precision)
      } else {
        result = min === -Infinity ? -step : min
      }
      return this.toNumber(result)
    },
    stepFn (type, e, ratio = 1, recursive) {
      this.stop()
      if (e) {
        // e.persist()
        e.preventDefault()
      }
      if (this.disabled) {
        return
      }
      const { max, min } = this
      const value = this.getCurrentValidValue(this.inputValue) || 0
      if (this.isNotCompleteNumber(value)) {
        return
      }
      let val = this[`${type}Step`](value, ratio)
      const outOfRange = val > max || val < min
      if (val > max) {
        val = max
      } else if (val < min) {
        val = min
      }
      this.setValue(val)
      this.setState({
        focused: true,
      })
      if (outOfRange) {
        return
      }
      this.autoStepTimer = setTimeout(() => {
        this[type](e, ratio, true)
      }, recursive ? SPEED : DELAY)
    },
    stop () {
      if (this.autoStepTimer) {
        clearTimeout(this.autoStepTimer)
      }
    },
    down (e, ratio, recursive) {
      this.pressingUpOrDown = true
      this.stepFn('down', e, ratio, recursive)
    },
    up (e, ratio, recursive) {
      this.pressingUpOrDown = true
      this.stepFn('up', e, ratio, recursive)
    },
    handleInputClick () {
      this.$emit('click')
    },
  },
  render () {
    const { prefixCls, disabled, readOnly, useTouch } = this.$props
    const classes = classNames({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focused`]: this.focused,
    })
    let upDisabledClass = ''
    let downDisabledClass = ''
    const { sValue } = this
    if (sValue || sValue === 0) {
      if (!isNaN(sValue)) {
        const val = Number(sValue)
        if (val >= this.max) {
          upDisabledClass = `${prefixCls}-handler-up-disabled`
        }
        if (val <= this.min) {
          downDisabledClass = `${prefixCls}-handler-down-disabled`
        }
      } else {
        upDisabledClass = `${prefixCls}-handler-up-disabled`
        downDisabledClass = `${prefixCls}-handler-down-disabled`
      }
    }

    const editable = !this.readOnly && !this.disabled

    // focus state, show input value
    // unfocus state, show valid value
    let inputDisplayValue
    if (this.focused) {
      inputDisplayValue = this.inputValue
    } else {
      inputDisplayValue = this.toPrecisionAsStep(this.sValue)
    }

    if (inputDisplayValue === undefined || inputDisplayValue === null) {
      inputDisplayValue = ''
    }

    let upEvents
    let downEvents
    if (useTouch) {
      upEvents = {
        touchstart: (editable && !upDisabledClass) ? this.up : noop,
        touchend: this.stop,
      }
      downEvents = {
        touchstart: (editable && !downDisabledClass) ? this.down : noop,
        touchend: this.stop,
      }
    } else {
      upEvents = {
        mousedown: (editable && !upDisabledClass) ? this.up : noop,
        mouseup: this.stop,
        mouseleave: this.stop,
      }
      downEvents = {
        mousedown: (editable && !downDisabledClass) ? this.down : noop,
        mouseup: this.stop,
        mouseleave: this.stop,
      }
    }
    const inputDisplayValueFormat = this.formatWrapper(inputDisplayValue)
    const isUpDisabled = !!upDisabledClass || disabled || readOnly
    const isDownDisabled = !!downDisabledClass || disabled || readOnly
    const { mouseenter = noop, mouseleave = noop, mouseover = noop, mouseout = noop } = this.$listeners
    const contentProps = {
      on: { mouseenter, mouseleave, mouseover, mouseout },
      class: classes,
    }
    const upHandlerProps = {
      props: {
        disabled: isUpDisabled,
        prefixCls,
      },
      attrs: {
        unselectable: 'unselectable',
        role: 'button',
        'aria-label': 'Increase Value',
        'aria-disabled': !!isUpDisabled,
      },
      class: `${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`,
      on: upEvents,
      ref: 'up',
    }
    const downHandlerProps = {
      props: {
        disabled: isDownDisabled,
        prefixCls,
      },
      attrs: {
        unselectable: 'unselectable',
        role: 'button',
        'aria-label': 'Decrease Value',
        'aria-disabled': !!isDownDisabled,
      },
      class: `${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`,
      on: downEvents,
      ref: 'down',
    }
    // ref for test
    return (
      <div
        {...contentProps}
      >
        <div class={`${prefixCls}-handler-wrap`}>
          <InputHandler
            {...upHandlerProps}
          >
            {this.upHandler || <span
              unselectable='unselectable'
              class={`${prefixCls}-handler-up-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
          <InputHandler
            {...downHandlerProps}
          >
            {this.downHandler || <span
              unselectable='unselectable'
              class={`${prefixCls}-handler-down-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
        </div>
        <div
          class={`${prefixCls}-input-wrap`}
          role='spinbutton'
          aria-valuemin={this.min}
          aria-valuemax={this.max}
          aria-valuenow={sValue}
        >
          <input
            required={this.required}
            type={this.type}
            placeholder={this.placeholder}
            onClick={this.handleInputClick}
            class={`${prefixCls}-input`}
            tabIndex={this.tabIndex}
            autoComplete='off'
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeydown={editable ? this.onKeyDown : noop}
            onKeyup={editable ? this.onKeyUp : noop}
            maxLength={this.maxLength}
            readOnly={this.readOnly}
            disabled={this.disabled}
            max={this.max}
            min={this.min}
            step={this.step}
            name={this.name}
            id={this.id}
            onInput={this.onChange}
            ref='inputRef'
            value={inputDisplayValueFormat}
            pattern={this.pattern}
          />
        </div>
      </div>
    )
  },
}
