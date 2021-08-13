// based on rc-input-number 4.5.5
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { initDefaultProps, hasProp, getOptionProps, getListeners } from '../../_util/props-util';
import classNames from 'classnames';
import KeyCode from '../../_util/KeyCode';
import InputHandler from './InputHandler';

function noop() {}

function preventDefault(e) {
  e.preventDefault();
}

function defaultParser(input) {
  return input.replace(/[^\d\.-]+/g, '');
}

/**
 * When click and hold on a button - the speed of auto changin the value.
 */
const SPEED = 200;

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
const DELAY = 600;

/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

const isValidProps = value => value !== undefined && value !== null;

const isEqual = (oldValue, newValue) =>
  newValue === oldValue ||
  (typeof newValue === 'number' &&
    typeof oldValue === 'number' &&
    isNaN(newValue) &&
    isNaN(oldValue));

const inputNumberProps = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  focusOnUpDown: PropTypes.bool,
  autoFocus: PropTypes.bool,
  // onChange: PropTypes.func,
  // onKeyDown: PropTypes.func,
  // onKeyUp: PropTypes.func,
  prefixCls: PropTypes.string,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  // onFocus: PropTypes.func,
  // onBlur: PropTypes.func,
  readonly: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
  decimalSeparator: PropTypes.string,
  autoComplete: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
};

export default {
  name: 'VCInputNumber',
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
    autoComplete: 'off',
  }),
  data() {
    const props = getOptionProps(this);
    this.prevProps = { ...props };
    let value;
    if ('value' in props) {
      value = this.value;
    } else {
      value = this.defaultValue;
    }
    const validValue = this.getValidValue(this.toNumber(value));
    return {
      inputValue: this.toPrecisionAsStep(validValue),
      sValue: validValue,
      focused: this.autoFocus,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoFocus && !this.disabled) {
        this.focus();
      }
      this.updatedFunc();
    });
  },
  updated() {
    const { value, max, min } = this.$props;
    const { focused } = this.$data;
    const { prevProps } = this;
    const props = getOptionProps(this);
    // Don't trigger in componentDidMount
    if (prevProps) {
      if (
        !isEqual(prevProps.value, value) ||
        !isEqual(prevProps.max, max) ||
        !isEqual(prevProps.min, min)
      ) {
        const validValue = focused ? value : this.getValidValue(value);
        let nextInputValue;
        if (this.pressingUpOrDown) {
          nextInputValue = validValue;
        } else if (this.inputting) {
          nextInputValue = this.rawInput;
        } else {
          nextInputValue = this.toPrecisionAsStep(validValue);
        }
        this.setState({
          // eslint-disable-line
          sValue: validValue,
          inputValue: nextInputValue,
        });
      }

      // Trigger onChange when max or min change
      // https://github.com/ant-design/ant-design/issues/11574
      const nextValue = 'value' in props ? value : this.sValue;
      // ref: null < 20 === true
      // https://github.com/ant-design/ant-design/issues/14277
      if (
        'max' in props &&
        prevProps.max !== max &&
        typeof nextValue === 'number' &&
        nextValue > max
      ) {
        this.$emit('change', max);
      }
      if (
        'min' in props &&
        prevProps.min !== min &&
        typeof nextValue === 'number' &&
        nextValue < min
      ) {
        this.$emit('change', min);
      }
    }
    this.prevProps = { ...props };
    this.$nextTick(() => {
      this.updatedFunc();
    });
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    updatedFunc() {
      const inputElem = this.$refs.inputRef;
      // Restore cursor
      try {
        // Firefox set the input cursor after it get focused.
        // This caused that if an input didn't init with the selection,
        // set will cause cursor not correct when first focus.
        // Safari will focus input if set selection. We need skip this.
        if (this.cursorStart !== undefined && this.focused) {
          // In most cases, the string after cursor is stable.
          // We can move the cursor before it

          if (
            // If not match full str, try to match part of str
            !this.partRestoreByAfter(this.cursorAfter) &&
            this.sValue !== this.value
          ) {
            // If not match any of then, let's just keep the position
            // TODO: Logic should not reach here, need check if happens
            let pos = this.cursorStart + 1;

            // If not have last string, just position to the end
            if (!this.cursorAfter) {
              pos = inputElem.value.length;
            } else if (this.lastKeyCode === KeyCode.BACKSPACE) {
              pos = this.cursorStart - 1;
            } else if (this.lastKeyCode === KeyCode.DELETE) {
              pos = this.cursorStart;
            }
            this.fixCaret(pos, pos);
          } else if (this.currentValue === inputElem.value) {
            // Handle some special key code
            switch (this.lastKeyCode) {
              case KeyCode.BACKSPACE:
                this.fixCaret(this.cursorStart - 1, this.cursorStart - 1);
                break;
              case KeyCode.DELETE:
                this.fixCaret(this.cursorStart + 1, this.cursorStart + 1);
                break;
              default:
              // Do nothing
            }
          }
        }
      } catch (e) {
        // Do nothing
      }
      // Reset last key
      this.lastKeyCode = null;

      // pressingUpOrDown is true means that someone just click up or down button
      if (!this.pressingUpOrDown) {
        return;
      }
      if (this.focusOnUpDown && this.focused) {
        if (document.activeElement !== inputElem) {
          this.focus();
        }
      }

      this.pressingUpOrDown = false;
    },
    onKeyDown(e, ...args) {
      if (e.keyCode === KeyCode.UP) {
        const ratio = this.getRatio(e);
        this.up(e, ratio);
        this.stop();
      } else if (e.keyCode === KeyCode.DOWN) {
        const ratio = this.getRatio(e);
        this.down(e, ratio);
        this.stop();
      } else if (e.keyCode === KeyCode.ENTER) {
        this.$emit('pressEnter', e);
      }
      // Trigger user key down
      this.recordCursorPosition();
      this.lastKeyCode = e.keyCode;
      this.$emit('keydown', e, ...args);
    },
    onKeyUp(e, ...args) {
      this.stop();

      this.recordCursorPosition();

      this.$emit('keyup', e, ...args);
    },
    onTrigger(e) {
      if (e.target.composing) return false;
      this.onChange(e);
    },
    onChange(e) {
      if (this.focused) {
        this.inputting = true;
      }
      this.rawInput = this.parser(this.getValueFromEvent(e));
      this.setState({ inputValue: this.rawInput });
      this.$emit('change', this.toNumber(this.rawInput)); // valid number or invalid string
    },
    onFocus(...args) {
      this.setState({
        focused: true,
      });
      this.$emit('focus', ...args);
    },
    onBlur(...args) {
      this.inputting = false;
      this.setState({
        focused: false,
      });
      const value = this.getCurrentValidValue(this.inputValue);
      const newValue = this.setValue(value);
      if (this.$listeners.blur) {
        const originValue = this.$refs.inputRef.value;
        const inputValue = this.getInputDisplayValue({ focused: false, sValue: newValue });
        this.$refs.inputRef.value = inputValue;
        this.$emit('blur', ...args);
        this.$refs.inputRef.value = originValue;
      }
    },
    getCurrentValidValue(value) {
      let val = value;
      if (val === '') {
        val = '';
      } else if (!this.isNotCompleteNumber(parseFloat(val, 10))) {
        val = this.getValidValue(val);
      } else {
        val = this.sValue;
      }
      return this.toNumber(val);
    },
    getRatio(e) {
      let ratio = 1;
      if (e.metaKey || e.ctrlKey) {
        ratio = 0.1;
      } else if (e.shiftKey) {
        ratio = 10;
      }
      return ratio;
    },
    getValueFromEvent(e) {
      // optimize for chinese input expierence
      // https://github.com/ant-design/ant-design/issues/8196
      let value = e.target.value.trim().replace(/。/g, '.');

      if (isValidProps(this.decimalSeparator)) {
        value = value.replace(this.decimalSeparator, '.');
      }

      return value;
    },
    getValidValue(value, min = this.min, max = this.max) {
      let val = parseFloat(value, 10);
      // https://github.com/ant-design/ant-design/issues/7358
      if (isNaN(val)) {
        return value;
      }
      if (val < min) {
        val = min;
      }
      if (val > max) {
        val = max;
      }
      return val;
    },
    setValue(v, callback) {
      // trigger onChange
      const { precision } = this.$props;
      const newValue = this.isNotCompleteNumber(parseFloat(v, 10)) ? null : parseFloat(v, 10);
      const { sValue: value = null, inputValue = null } = this.$data;
      // https://github.com/ant-design/ant-design/issues/7363
      // https://github.com/ant-design/ant-design/issues/16622
      const newValueInString =
        typeof newValue === 'number' ? newValue.toFixed(precision) : `${newValue}`;
      const changed = newValue !== value || newValueInString !== `${inputValue}`;
      if (!hasProp(this, 'value')) {
        this.setState(
          {
            sValue: newValue,
            inputValue: this.toPrecisionAsStep(v),
          },
          callback,
        );
      } else {
        // always set input value same as value
        this.setState(
          {
            inputValue: this.toPrecisionAsStep(this.sValue),
          },
          callback,
        );
      }
      if (changed) {
        this.$emit('change', newValue);
      }
      return newValue;
    },
    getPrecision(value) {
      if (isValidProps(this.precision)) {
        return this.precision;
      }
      const valueString = value.toString();
      if (valueString.indexOf('e-') >= 0) {
        return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10);
      }
      let precision = 0;
      if (valueString.indexOf('.') >= 0) {
        precision = valueString.length - valueString.indexOf('.') - 1;
      }
      return precision;
    },
    // step={1.0} value={1.51}
    // press +
    // then value should be 2.51, rather than 2.5
    // if this.$props.precision is undefined
    // https://github.com/react-component/input-number/issues/39
    getMaxPrecision(currentValue, ratio = 1) {
      if (isValidProps(this.precision)) {
        return this.precision;
      }
      const { step } = this;
      const ratioPrecision = this.getPrecision(ratio);
      const stepPrecision = this.getPrecision(step);
      const currentValuePrecision = this.getPrecision(currentValue);
      if (!currentValue) {
        return ratioPrecision + stepPrecision;
      }
      return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
    },
    getPrecisionFactor(currentValue, ratio = 1) {
      const precision = this.getMaxPrecision(currentValue, ratio);
      return Math.pow(10, precision);
    },
    getInputDisplayValue(state) {
      const { focused, inputValue, sValue } = state || this.$data;
      let inputDisplayValue;
      if (focused) {
        inputDisplayValue = inputValue;
      } else {
        inputDisplayValue = this.toPrecisionAsStep(sValue);
      }

      if (inputDisplayValue === undefined || inputDisplayValue === null) {
        inputDisplayValue = '';
      }

      let inputDisplayValueFormat = this.formatWrapper(inputDisplayValue);
      if (isValidProps(this.$props.decimalSeparator)) {
        inputDisplayValueFormat = inputDisplayValueFormat
          .toString()
          .replace('.', this.$props.decimalSeparator);
      }

      return inputDisplayValueFormat;
    },
    recordCursorPosition() {
      // Record position
      try {
        const inputElem = this.$refs.inputRef;
        this.cursorStart = inputElem.selectionStart;
        this.cursorEnd = inputElem.selectionEnd;
        this.currentValue = inputElem.value;
        this.cursorBefore = inputElem.value.substring(0, this.cursorStart);
        this.cursorAfter = inputElem.value.substring(this.cursorEnd);
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    },
    fixCaret(start, end) {
      if (
        start === undefined ||
        end === undefined ||
        !this.$refs.inputRef ||
        !this.$refs.inputRef.value
      ) {
        return;
      }

      try {
        const inputElem = this.$refs.inputRef;
        const currentStart = inputElem.selectionStart;
        const currentEnd = inputElem.selectionEnd;

        if (start !== currentStart || end !== currentEnd) {
          inputElem.setSelectionRange(start, end);
        }
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    },
    restoreByAfter(str) {
      if (str === undefined) return false;

      const fullStr = this.$refs.inputRef.value;
      const index = fullStr.lastIndexOf(str);

      if (index === -1) return false;

      const prevCursorPos = this.cursorBefore.length;
      if (
        this.lastKeyCode === KeyCode.DELETE &&
        this.cursorBefore.charAt(prevCursorPos - 1) === str[0]
      ) {
        this.fixCaret(prevCursorPos, prevCursorPos);
        return true;
      }
      if (index + str.length === fullStr.length) {
        this.fixCaret(index, index);

        return true;
      }
      return false;
    },
    partRestoreByAfter(str) {
      if (str === undefined) return false;

      // For loop from full str to the str with last char to map. e.g. 123
      // -> 123
      // -> 23
      // -> 3
      return Array.prototype.some.call(str, (_, start) => {
        const partStr = str.substring(start);

        return this.restoreByAfter(partStr);
      });
    },
    focus() {
      this.$refs.inputRef.focus();
      this.recordCursorPosition();
    },
    blur() {
      this.$refs.inputRef.blur();
    },
    formatWrapper(num) {
      // http://2ality.com/2012/03/signedzero.html
      // https://github.com/ant-design/ant-design/issues/9439
      if (this.formatter) {
        return this.formatter(num);
      }
      return num;
    },
    toPrecisionAsStep(num) {
      if (this.isNotCompleteNumber(num) || num === '') {
        return num;
      }
      const precision = Math.abs(this.getMaxPrecision(num));
      if (!isNaN(precision)) {
        return Number(num).toFixed(precision);
      }
      return num.toString();
    },
    // '1.' '1x' 'xx' '' => are not complete numbers
    isNotCompleteNumber(num) {
      return (
        isNaN(num) ||
        num === '' ||
        num === null ||
        (num && num.toString().indexOf('.') === num.toString().length - 1)
      );
    },
    toNumber(num) {
      const { precision, autoFocus } = this.$props;
      const { focused = autoFocus } = this;
      // num.length > 16 => This is to prevent input of large numbers
      const numberIsTooLarge = num && num.length > 16 && focused;
      if (this.isNotCompleteNumber(num) || numberIsTooLarge) {
        return num;
      }
      if (isValidProps(precision)) {
        return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
      }
      return Number(num);
    },
    upStep(val, rat) {
      const { step } = this;
      const precisionFactor = this.getPrecisionFactor(val, rat);
      const precision = Math.abs(this.getMaxPrecision(val, rat));
      const result = (
        (precisionFactor * val + precisionFactor * step * rat) /
        precisionFactor
      ).toFixed(precision);
      return this.toNumber(result);
    },
    downStep(val, rat) {
      const { step } = this;
      const precisionFactor = this.getPrecisionFactor(val, rat);
      const precision = Math.abs(this.getMaxPrecision(val, rat));
      const result = (
        (precisionFactor * val - precisionFactor * step * rat) /
        precisionFactor
      ).toFixed(precision);
      return this.toNumber(result);
    },
    stepFn(type, e, ratio = 1, recursive) {
      this.stop();
      if (e) {
        // e.persist()
        e.preventDefault();
      }
      if (this.disabled) {
        return;
      }
      const { max, min } = this;
      const value = this.getCurrentValidValue(this.inputValue) || 0;
      if (this.isNotCompleteNumber(value)) {
        return;
      }
      let val = this[`${type}Step`](value, ratio);
      const outOfRange = val > max || val < min;
      if (val > max) {
        val = max;
      } else if (val < min) {
        val = min;
      }
      this.setValue(val);
      this.setState({
        focused: true,
      });
      if (outOfRange) {
        return;
      }
      this.autoStepTimer = setTimeout(
        () => {
          this[type](e, ratio, true);
        },
        recursive ? SPEED : DELAY,
      );
    },
    stop() {
      if (this.autoStepTimer) {
        clearTimeout(this.autoStepTimer);
      }
    },
    down(e, ratio, recursive) {
      this.pressingUpOrDown = true;
      this.stepFn('down', e, ratio, recursive);
    },
    up(e, ratio, recursive) {
      this.pressingUpOrDown = true;
      this.stepFn('up', e, ratio, recursive);
    },
    handleInputClick() {
      this.$emit('click');
    },
    onCompositionstart(e) {
      e.target.composing = true;
    },
    onCompositionend(e) {
      this.onChange(e);
      e.target.composing = false;
    },
  },
  render() {
    const {
      prefixCls,
      disabled,
      readonly,
      useTouch,
      autoComplete,
      upHandler,
      downHandler,
    } = this.$props;
    const classes = classNames({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focused`]: this.focused,
    });
    let upDisabledClass = '';
    let downDisabledClass = '';
    const { sValue } = this;
    if (sValue || sValue === 0) {
      if (!isNaN(sValue)) {
        const val = Number(sValue);
        if (val >= this.max) {
          upDisabledClass = `${prefixCls}-handler-up-disabled`;
        }
        if (val <= this.min) {
          downDisabledClass = `${prefixCls}-handler-down-disabled`;
        }
      } else {
        upDisabledClass = `${prefixCls}-handler-up-disabled`;
        downDisabledClass = `${prefixCls}-handler-down-disabled`;
      }
    }

    const editable = !this.readonly && !this.disabled;

    // focus state, show input value
    // unfocus state, show valid value
    const inputDisplayValue = this.getInputDisplayValue();

    let upEvents;
    let downEvents;
    if (useTouch) {
      upEvents = {
        touchstart: editable && !upDisabledClass ? this.up : noop,
        touchend: this.stop,
      };
      downEvents = {
        touchstart: editable && !downDisabledClass ? this.down : noop,
        touchend: this.stop,
      };
    } else {
      upEvents = {
        mousedown: editable && !upDisabledClass ? this.up : noop,
        mouseup: this.stop,
        mouseleave: this.stop,
      };
      downEvents = {
        mousedown: editable && !downDisabledClass ? this.down : noop,
        mouseup: this.stop,
        mouseleave: this.stop,
      };
    }
    const isUpDisabled = !!upDisabledClass || disabled || readonly;
    const isDownDisabled = !!downDisabledClass || disabled || readonly;
    const {
      mouseenter = noop,
      mouseleave = noop,
      mouseover = noop,
      mouseout = noop,
    } = getListeners(this);
    const contentProps = {
      on: { mouseenter, mouseleave, mouseover, mouseout },
      class: classes,
      attrs: { title: this.$props.title },
    };
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
    };
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
    };
    // ref for test
    return (
      <div {...contentProps}>
        <div class={`${prefixCls}-handler-wrap`}>
          <InputHandler {...upHandlerProps}>
            {upHandler || (
              <span
                unselectable="unselectable"
                class={`${prefixCls}-handler-up-inner`}
                onClick={preventDefault}
              />
            )}
          </InputHandler>
          <InputHandler {...downHandlerProps}>
            {downHandler || (
              <span
                unselectable="unselectable"
                class={`${prefixCls}-handler-down-inner`}
                onClick={preventDefault}
              />
            )}
          </InputHandler>
        </div>
        <div class={`${prefixCls}-input-wrap`}>
          <input
            role="spinbutton"
            aria-valuemin={this.min}
            aria-valuemax={this.max}
            aria-valuenow={sValue}
            required={this.required}
            type={this.type}
            placeholder={this.placeholder}
            onClick={this.handleInputClick}
            class={`${prefixCls}-input`}
            tabIndex={this.tabIndex}
            autoComplete={autoComplete}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeydown={editable ? this.onKeyDown : noop}
            onKeyup={editable ? this.onKeyUp : noop}
            readonly={this.readonly}
            disabled={this.disabled}
            max={this.max}
            min={this.min}
            step={this.step}
            name={this.name}
            title={this.title}
            id={this.id}
            onInput={this.onTrigger}
            onCompositionstart={this.onCompositionstart}
            onCompositionend={this.onCompositionend}
            ref="inputRef"
            value={inputDisplayValue}
            pattern={this.pattern}
          />
        </div>
      </div>
    );
  },
};
