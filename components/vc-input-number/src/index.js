// based on rc-input-number 4.5.5
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { initDefaultProps, getOptionProps, getListeners } from '../../_util/props-util';
import classNames from 'classnames';
import KeyCode from '../../_util/KeyCode';
import InputHandler from './InputHandler';
import fill from 'lodash/fill';
import endsWith from 'lodash/endsWith';
import startsWith from 'lodash/startsWith';

function noop() {}

function preventDefault(e) {
  e.preventDefault();
}

function defaultParser(input) {
  return input.replace(/[^\w\.-]+/g, '');
}

/**
 * When click and hold on a button - the speed of auto changin the value.
 */
const SPEED = 100;

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
const DELAY = 600;

/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

/**
 * When onKeyDown triggered, it is necessary to recognize type of e.keyCode
 */
const NUMBER_KEY = 'NUMBER_KEY';
const DECIMAIL_SP = 'DECIMAIL_SP';
const FORMATTER_CASE = 'FORMATTER_CASE';

const isValidProps = value => value !== undefined && value !== null;

const isNumeralCharacterKey = keyCode => {
  if (keyCode >= KeyCode.ZERO && keyCode <= KeyCode.NINE) {
    return true;
  }
};

const isComposingNumKey = (keyCode, code) => {
  const numKeyEventCode = fill(new Array(10), 'Digit').map((v, i) => v + i);
  return keyCode === 229 && numKeyEventCode.includes(code);
};

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
  useGrouping: PropTypes.bool,
  groupSeparator: PropTypes.string,
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
    useGrouping: false,
    groupSeparator: ',',
    decimalSeparator: '.',
  }),
  data() {
    const props = getOptionProps(this);
    let value;
    if ('value' in props) {
      value = this.value;
    } else {
      value = this.defaultValue;
    }
    const validValue = this.getCurrentValidValue(value);
    return {
      inputValue: validValue,
      focused: this.autoFocus,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoFocus && !this.disabled) {
        this.focus();
      }
      // this.formatAndUpdate(this.inputValue);
    });
  },
  watch: {
    max() {
      const value = this.inputValue;
      if (value || value === 0) {
        this.formatAndUpdate(value);
      }
    },
    min() {
      const value = this.inputValue;
      if (value || value === 0) {
        this.formatAndUpdate(value);
      }
    },
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
        if (this.cursorStart() !== undefined && this.focused) {
          // In most cases, the string after cursor is stable.
          // We can move the cursor before it

          if (
            // If not match full str, try to match part of str
            !this.partRestoreByAfter(this.cursorAfter()) &&
            this.sValue !== this.value
          ) {
            // If not match any of then, let's just keep the position
            // TODO: Logic should not reach here, need check if happens
            let pos = this.cursorStart() + 1;

            // If not have last string, just position to the end
            if (!this.cursorAfter()) {
              pos = inputElem.value.length;
            } else if (this.lastKeyCode === KeyCode.BACKSPACE) {
              pos = this.cursorStart() - 1;
            } else if (this.lastKeyCode === KeyCode.DELETE) {
              pos = this.cursorStart();
            }
            this.fixCaret(pos, pos);
          } else if (this.currentValue === inputElem.value) {
            // Handle some special key code
            switch (this.lastKeyCode) {
              case KeyCode.BACKSPACE:
                this.fixCaret(this.cursorStart() - 1, this.cursorStart() - 1);
                break;
              case KeyCode.DELETE:
                this.fixCaret(this.cursorStart() + 1, this.cursorStart() + 1);
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
    setInputValue(val) {
      if (this.focused) {
        this.inputting = true;
      }
      if (val === null || val === undefined) {
        val = '';
      }
      this.setState({
        inputValue: String(val),
      });
      const emitValue = this.getCurrentValidValue(this.inputValue);
      if (this.onbluring) {
        this.$emit('change', emitValue === '' ? null : Number(emitValue));
      } else {
        this.$emit('change', emitValue === '' ? '' : Number(emitValue));
      }
    },
    formatAndUpdate(value) {
      if (this.formatter && this.parser) {
        value = this.formatWrapper(this.getCurrentValidValue(value));
      } else {
        value = this.formatNumber(value);
      }
      this.setInputValue(value);
    },
    formatNumber(value) {
      if (String(value).length > 30) value = value.slice(0, 30);
      value = this.getCurrentValidValue(value);
      if (value === '') {
        return '';
      } else {
        return new Intl.NumberFormat(undefined, {
          style: 'decimal',
          useGrouping: this.useGrouping,
          minimumFractionDigits: this.getMaxPrecision(value),
          maximumFractionDigits: this.getMaxPrecision(value),
        })
          .format(value)
          .replace(new RegExp('\\,', 'g'), this.groupSeparator)
          .replace(new RegExp('\\.', 'g'), this.decimalSeparator);
      }
    },
    spliceText(preValue, newChar, start, end) {
      const ret = preValue.slice(0, start) + newChar + preValue.slice(end);
      return ret;
    },
    async onKeyDown(e, ...args) {
      let eKeyCode = e.keyCode;
      let enterChar = e.key;
      let preValue = e.target.value;
      if (this.formatter && this.parser && ![KeyCode.UP, KeyCode.DOWN].includes(eKeyCode)) {
        eKeyCode = FORMATTER_CASE;
      } else if (isNumeralCharacterKey(eKeyCode)) {
        eKeyCode = NUMBER_KEY;
      } else if (enterChar === this.decimalSeparator) {
        eKeyCode = DECIMAIL_SP;
      } else if (isComposingNumKey(eKeyCode, e.code)) {
        eKeyCode = NUMBER_KEY;
        enterChar = e.code.slice(-1);
        e.preventDefault();
        if (preValue === this.inputValue) {
          // wait for browser repaint, otherwise duplicate value will be inserted
          await new Promise(res => requestAnimationFrame(res)); // for windows chrome
        } else {
          // if preValue != this.inputValue, it means browser repaint done
          preValue = this.inputValue; // actually for safari
          this.fixCaretSync(this.cursorStart() - 1, this.cursorEnd() - 1);
        }
      }
      this.processCaseOnKeydown(e, eKeyCode, enterChar, preValue);
      // Trigger user key down
      this.lastKeyCode = e.keyCode;
      this.$emit('keydown', e, ...args);
    },
    onKeyUp(e, ...args) {
      this.stop();
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
      if (this.formatter && this.parser) {
        const value = String(e.target.value);
        // use setInputValue instead of formatAndUpdate
        this.setInputValue(this.formatWrapper(this.parser(value)));
        this.$nextTick(() => {
          this.updatedFunc();
        });
      } else if (e.target.value === '') {
        // just for test input-number/__tests__/index.test.js
        // common logic should never run into here for preventDefault on keydown
        // composing case on safari will trigger onInput before keydown, but it need to be ignored
        this.setInputValue('');
      }
    },
    onFocus(...args) {
      this.setState({
        focused: true,
      });
      this.$emit('focus', ...args);
    },
    onBlur(...args) {
      this.onbluring = true;
      this.inputting = false;
      this.setState({
        focused: false,
      });
      this.formatAndUpdate(this.$refs.inputRef.value);
      this.$refs.inputRef.value = this.inputValue; // inputValue will be always same as value
      if (this.$listeners.blur) {
        this.$emit('blur', ...args);
      }
      this.onbluring = false;
    },
    processCaseOnKeydown(e, eKeyCode, enterChar, preValue) {
      switch (eKeyCode) {
        case FORMATTER_CASE:
        case KeyCode.DELETE:
        case KeyCode.CTRL:
        case KeyCode.LEFT:
        case KeyCode.RIGHT:
          break;
        case KeyCode.A:
        case KeyCode.C:
        case KeyCode.V:
          if ([KeyCode.CTRL, KeyCode.META].includes(this.lastKeyCode)) break;
        default:
          e.preventDefault();
      }
      let tempStr, toStart;
      const curStart = this.cursorStart();
      const curEnd = this.cursorEnd();
      const curBefore = this.cursorBefore();
      const curAfter = this.cursorAfter();
      const originalRightCharCount = this.cursorRightCharCount();
      const periodIndex = preValue.indexOf(this.decimalSeparator);
      const isCursorRightOfPeriod = periodIndex != -1 && periodIndex < curStart;
      const selectMutiChar = curEnd > curStart;
      switch (eKeyCode) {
        case NUMBER_KEY:
          if (
            isCursorRightOfPeriod &&
            curStart === preValue.length &&
            isValidProps(this.precision) &&
            !selectMutiChar
          ) {
            this.$nextTick(() => (e.target.value = preValue)); // this line just for ComposingNum
            break;
          }
          // replace the next char
          const firstZero = curStart === 0 && startsWith(curAfter, '0');
          const replaceNext = selectMutiChar ? 0 : isCursorRightOfPeriod || firstZero ? 1 : 0;
          tempStr = this.spliceText(preValue, enterChar, curStart, curEnd + replaceNext);
          this.formatAndUpdate(tempStr);

          // move the cursor right
          const moveRight = replaceNext;
          toStart = this.inputValue.length - originalRightCharCount + moveRight;
          if (preValue.length === 0) toStart = 1;
          this.fixCaret(toStart, toStart);
          break;

        case KeyCode.DASH:
          if (curStart !== 0 || preValue.includes('-') || selectMutiChar) break;
          if (preValue.length === 0) {
            this.setInputValue('-');
          } else {
            this.formatAndUpdate('-' + preValue);
          }
          this.fixCaret(1, 1);
          break;

        case DECIMAIL_SP:
          if (selectMutiChar) break;
          if (startsWith(curAfter, this.decimalSeparator)) {
            // just move the cursor right for one step
            this.fixCaret(curStart + 1, curStart + 1);
            break;
          }
          if (
            !isValidProps(this.precision) &&
            !preValue.includes(this.decimalSeparator) &&
            !startsWith(curAfter, this.groupSeparator) &&
            curStart !== 0
          ) {
            tempStr = this.spliceText(preValue, enterChar, curStart, curEnd);
            this.formatAndUpdate(tempStr);
            if (endsWith(tempStr, this.decimalSeparator)) {
              this.setInputValue(this.inputValue + this.decimalSeparator);
            }

            // always move the cursor to next of period
            toStart = this.inputValue.indexOf(this.decimalSeparator) + 1;
            this.fixCaret(toStart, toStart);
          }
          break;

        case KeyCode.BACKSPACE:
          if (curStart === 0) {
            this.setInputValue('');
            this.fixCaret(0, 0);
            break;
          }
          let justMoveLeft =
            endsWith(curBefore, this.groupSeparator) ||
            (endsWith(curBefore, this.decimalSeparator) && isValidProps(this.precision));
          if (selectMutiChar) justMoveLeft = false;
          tempStr = this.spliceText(preValue, '', curStart - (selectMutiChar ? 0 : 1), curEnd);
          if (justMoveLeft) tempStr = preValue;
          this.formatAndUpdate(tempStr);

          // move the cursor left
          const noInteger = startsWith(tempStr, this.decimalSeparator);
          const onlyMinus = startsWith(tempStr, `-${this.decimalSeparator}`);
          let moveLeft = isCursorRightOfPeriod || justMoveLeft || noInteger || onlyMinus ? 1 : 0;
          if (selectMutiChar) moveLeft = 0;
          if (!isValidProps(this.precision)) {
            isCursorRightOfPeriod && (moveLeft = 0);
            if (endsWith(tempStr, this.decimalSeparator)) {
              this.setInputValue(this.inputValue + this.decimalSeparator);
            }
          }
          toStart = this.inputValue.length - originalRightCharCount - moveLeft;
          this.fixCaret(toStart, toStart);
          break;

        case KeyCode.UP:
          this.up(e, this.getRatio(e));
          this.stop();
          break;

        case KeyCode.DOWN:
          this.down(e, this.getRatio(e));
          this.stop();
          break;

        case KeyCode.ENTER:
          this.$emit('pressEnter', e);
          break;

        case FORMATTER_CASE:
          break;
      }
    },
    getCurrentValidValue(value) {
      // promise to return correct num or ''
      // typeof ret is string
      // avoid to clear decimal digit such as 1.000 when precision is undefined
      // should not use num.toString() / parseFloat / Number() directly
      if (this.formatter && this.parser) {
        value = this.parser(String(value));
      } else {
        value = String(value)
          .replace(new RegExp('\\' + this.groupSeparator, 'g'), '')
          .replace(new RegExp('\\' + this.decimalSeparator, 'g'), '.');
      }
      value = this.toPrecisionAsStep(value);
      if (this.isNotCompleteNumber(value)) {
        value = parseFloat(value);
      }
      if (isNaN(value) || value === '') return '';
      if (isValidProps(this.min)) {
        value = value < this.min ? this.min : value;
      }
      if (isValidProps(this.max)) {
        value = value > this.max ? this.max : value;
      }
      return value;
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
    cursorStart() {
      try {
        return this.$refs.inputRef.selectionStart;
      } catch (error) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
        return 0;
      }
    },
    cursorEnd() {
      try {
        return this.$refs.inputRef.selectionEnd;
      } catch (error) {
        return 0;
      }
    },
    cursorBefore() {
      return this.inputValue.substring(0, this.cursorStart());
    },
    cursorAfter() {
      return this.inputValue.substring(this.cursorEnd());
    },
    cursorRightCharCount() {
      return this.inputValue.length - this.cursorEnd();
    },
    fixCaret(start, end) {
      // avoid rerending causes cursor back to the end
      this.$nextTick(() => {
        this.fixCaretSync(start, end);
      });
    },
    fixCaretSync(start, end) {
      if (
        start === undefined ||
        end === undefined ||
        !this.$refs.inputRef ||
        !this.$refs.inputRef.value
      ) {
        return;
      }
      try {
        this.$refs.inputRef.setSelectionRange(start, end);
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

      const prevCursorPos = this.cursorBefore().length;
      if (
        this.lastKeyCode === KeyCode.DELETE &&
        this.cursorBefore().charAt(prevCursorPos - 1) === str[0]
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
      return num;
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
      const value = this.getCurrentValidValue(this.inputValue) || 0;
      let val = this[`${type}Step`](value, ratio);
      const originalRightCharCount = this.cursorRightCharCount();
      this.formatAndUpdate(val);
      const toStart = this.inputValue.length - originalRightCharCount;
      this.fixCaret(toStart, toStart);
      this.setState({
        focused: true,
      });
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
      this.originalValue = e.target.value;
    },
    onCompositionend(e) {
      e.target.composing = false;
      if (!/^\d$/.test(e.data)) {
        this.setInputValue(this.originalValue);
      }
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

    let val = this.getCurrentValidValue(this.inputValue);
    val = val === '' ? null : Number(val);
    if (val || val === 0) {
      if (isValidProps(this.max) && val >= this.max) {
        upDisabledClass = `${prefixCls}-handler-up-disabled`;
      }
      if (isValidProps(this.min) && val <= this.min) {
        downDisabledClass = `${prefixCls}-handler-down-disabled`;
      }
    }

    const editable = !this.readonly && !this.disabled;

    // focus state, show input value
    // unfocus state, show valid value

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
            aria-valuenow={val}
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
            value={this.inputValue}
            pattern={this.pattern}
          />
        </div>
      </div>
    );
  },
};
