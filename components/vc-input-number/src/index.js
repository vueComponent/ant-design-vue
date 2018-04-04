import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isNegativeZero from 'is-negative-zero';
import InputHandler from './InputHandler';

function noop() {
}

function preventDefault(e) {
  e.preventDefault();
}

function defaultParser(input) {
  return input.replace(/[^\w\.-]+/g, '');
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

export default class InputNumber extends React.Component {
  static propTypes = {
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
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    prefixCls: PropTypes.string,
    tabIndex: PropTypes.string,
    disabled: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    upHandler: PropTypes.node,
    downHandler: PropTypes.node,
    useTouch: PropTypes.bool,
    formatter: PropTypes.func,
    parser: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    precision: PropTypes.number,
    required: PropTypes.bool,
    pattern: PropTypes.string,
  }

  static defaultProps = {
    focusOnUpDown: true,
    useTouch: false,
    prefixCls: 'rc-input-number',
    min: -MAX_SAFE_INTEGER,
    step: 1,
    style: {},
    onChange: noop,
    onKeyDown: noop,
    onFocus: noop,
    onBlur: noop,
    parser: defaultParser,
    required: false,
  }

  constructor(props) {
    super(props);

    let value;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    value = this.toNumber(value);

    this.state = {
      inputValue: this.toPrecisionAsStep(value),
      value,
      focused: props.autoFocus,
    };
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = this.state.focused
        ? nextProps.value : this.getValidValue(nextProps.value, nextProps.min, nextProps.max);
      this.setState({
        value,
        inputValue: this.inputting ? value : this.toPrecisionAsStep(value),
      });
    }
  }

  componentWillUpdate() {
    try {
      this.start = this.input.selectionStart;
      this.end = this.input.selectionEnd;
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  }

  componentDidUpdate() {
    // pressingUpOrDown is true means that someone just click up or down button
    // https://github.com/ant-design/ant-design/issues/9204
    if (!this.pressingUpOrDown) {
      return;
    }
    if (this.props.focusOnUpDown && this.state.focused) {
      const selectionRange = this.input.setSelectionRange;
      if (selectionRange &&
          typeof selectionRange === 'function' &&
          this.start !== undefined &&
          this.end !== undefined) {
        this.input.setSelectionRange(this.start, this.end);
      } else {
        this.focus();
      }
      this.pressingUpOrDown = false;
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  onKeyDown = (e, ...args) => {
    if (e.keyCode === 38) {
      const ratio = this.getRatio(e);
      this.up(e, ratio);
      this.stop();
    } else if (e.keyCode === 40) {
      const ratio = this.getRatio(e);
      this.down(e, ratio);
      this.stop();
    }
    const { onKeyDown } = this.props;
    if (onKeyDown) {
      onKeyDown(e, ...args);
    }
  }

  onKeyUp = (e, ...args) => {
    this.stop();
    const { onKeyUp } = this.props;
    if (onKeyUp) {
      onKeyUp(e, ...args);
    }
  }

  onChange = (e) => {
    if (this.state.focused) {
      this.inputting = true;
    }
    const input = this.props.parser(this.getValueFromEvent(e));
    this.setState({ inputValue: input });
    this.props.onChange(this.toNumberWhenUserInput(input)); // valid number or invalid string
  }

  onFocus = (...args) => {
    this.setState({
      focused: true,
    });
    this.props.onFocus(...args);
  }

  onBlur = (e, ...args) => {
    this.inputting = false;
    this.setState({
      focused: false,
    });
    const value = this.getCurrentValidValue(this.state.inputValue);
    e.persist();  // fix https://github.com/react-component/input-number/issues/51
    this.setValue(value, () => {
      this.props.onBlur(e, ...args);
    });
  }

  getCurrentValidValue(value) {
    let val = value;
    if (val === '') {
      val = '';
    } else if (!this.isNotCompleteNumber(val)) {
      val = this.getValidValue(val);
    } else {
      val = this.state.value;
    }
    return this.toNumber(val);
  }

  getRatio(e) {
    let ratio = 1;
    if (e.metaKey || e.ctrlKey) {
      ratio = 0.1;
    } else if (e.shiftKey) {
      ratio = 10;
    }
    return ratio;
  }

  getValueFromEvent(e) {
    // optimize for chinese input expierence
    // https://github.com/ant-design/ant-design/issues/8196
    return e.target.value.trim().replace(/。/g, '.');
  }

  getValidValue(value, min = this.props.min, max = this.props.max) {
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
  }

  setValue(v, callback) {
    // trigger onChange
    const newValue = this.isNotCompleteNumber(parseFloat(v, 10)) ? undefined : parseFloat(v, 10);
    const changed = newValue !== this.state.value ||
      `${newValue}` !== `${this.state.inputValue}`; // https://github.com/ant-design/ant-design/issues/7363
    if (!('value' in this.props)) {
      this.setState({
        value: newValue,
        inputValue: this.toPrecisionAsStep(v),
      }, callback);
    } else {
      // always set input value same as value
      this.setState({
        inputValue: this.toPrecisionAsStep(this.state.value),
      }, callback);
    }
    if (changed) {
      this.props.onChange(newValue);
    }
  }

  getPrecision(value) {
    if ('precision' in this.props) {
      return this.props.precision;
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
  }

  // step={1.0} value={1.51}
  // press +
  // then value should be 2.51, rather than 2.5
  // if this.props.precision is undefined
  // https://github.com/react-component/input-number/issues/39
  getMaxPrecision(currentValue, ratio = 1) {
    if ('precision' in this.props) {
      return this.props.precision;
    }
    const { step } = this.props;
    const ratioPrecision = this.getPrecision(ratio);
    const stepPrecision = this.getPrecision(step);
    const currentValuePrecision = this.getPrecision(currentValue);
    if (!currentValue) {
      return ratioPrecision + stepPrecision;
    }
    return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
  }

  getPrecisionFactor(currentValue, ratio = 1) {
    const precision = this.getMaxPrecision(currentValue, ratio);
    return Math.pow(10, precision);
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  formatWrapper(num) {
    // http://2ality.com/2012/03/signedzero.html
    // https://github.com/ant-design/ant-design/issues/9439
    if (isNegativeZero(num)) {
      return '-0';
    }
    if (this.props.formatter) {
      return this.props.formatter(num);
    }
    return num;
  }

  toPrecisionAsStep(num) {
    if (this.isNotCompleteNumber(num) || num === '') {
      return num;
    }
    const precision = Math.abs(this.getMaxPrecision(num));
    if (precision === 0) {
      return num.toString();
    }
    if (!isNaN(precision)) {
      return Number(num).toFixed(precision);
    }
    return num.toString();
  }

  // '1.' '1x' 'xx' '' => are not complete numbers
  isNotCompleteNumber(num) {
    return (
      isNaN(num) ||
      num === '' ||
      num === null ||
      (num && num.toString().indexOf('.') === num.toString().length - 1)
    );
  }

  toNumber(num) {
    if (this.isNotCompleteNumber(num)) {
      return num;
    }
    if ('precision' in this.props) {
      return Number(Number(num).toFixed(this.props.precision));
    }
    return Number(num);
  }

  // '1.0' '1.00'  => may be a inputing number
  toNumberWhenUserInput(num) {
    // num.length > 16 => prevent input large number will became Infinity
    if ((/\.\d*0$/.test(num) || num.length > 16) && this.state.focused) {
      return num;
    }
    return this.toNumber(num);
  }

  upStep(val, rat) {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    let result;
    if (typeof val === 'number') {
      result =
        ((precisionFactor * val + precisionFactor * step * rat) /
        precisionFactor).toFixed(precision);
    } else {
      result = min === -Infinity ? step : min;
    }
    return this.toNumber(result);
  }

  downStep(val, rat) {
    const { step, min } = this.props;
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    let result;
    if (typeof val === 'number') {
      result =
        ((precisionFactor * val - precisionFactor * step * rat) /
        precisionFactor).toFixed(precision);
    } else {
      result = min === -Infinity ? -step : min;
    }
    return this.toNumber(result);
  }

  step(type, e, ratio = 1, recursive) {
    this.stop();
    if (e) {
      e.persist();
      e.preventDefault();
    }
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const value = this.getCurrentValidValue(this.state.inputValue) || 0;
    if (this.isNotCompleteNumber(value)) {
      return;
    }
    let val = this[`${type}Step`](value, ratio);
    const outOfRange = val > props.max || val < props.min;
    if (val > props.max) {
      val = props.max;
    } else if (val < props.min) {
      val = props.min;
    }
    this.setValue(val);
    this.setState({
      focused: true,
    });
    if (outOfRange) {
      return;
    }
    this.autoStepTimer = setTimeout(() => {
      this[type](e, ratio, true);
    }, recursive ? SPEED : DELAY);
  }

  stop = () => {
    if (this.autoStepTimer) {
      clearTimeout(this.autoStepTimer);
    }
  }

  down = (e, ratio, recursive) => {
    this.pressingUpOrDown = true;
    this.step('down', e, ratio, recursive);
  }

  up = (e, ratio, recursive) => {
    this.pressingUpOrDown = true;
    this.step('up', e, ratio, recursive);
  }

  saveInput = (node) => {
    this.input = node;
  }

  render() {
    const props = { ...this.props };
    const { prefixCls, disabled, readOnly, useTouch } = props;
    const classes = classNames({
      [prefixCls]: true,
      [props.className]: !!props.className,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focused`]: this.state.focused,
    });
    let upDisabledClass = '';
    let downDisabledClass = '';
    const { value } = this.state;
    if (value || value === 0) {
      if (!isNaN(value)) {
        const val = Number(value);
        if (val >= props.max) {
          upDisabledClass = `${prefixCls}-handler-up-disabled`;
        }
        if (val <= props.min) {
          downDisabledClass = `${prefixCls}-handler-down-disabled`;
        }
      } else {
        upDisabledClass = `${prefixCls}-handler-up-disabled`;
        downDisabledClass = `${prefixCls}-handler-down-disabled`;
      }
    }

    const editable = !props.readOnly && !props.disabled;

    // focus state, show input value
    // unfocus state, show valid value
    let inputDisplayValue;
    if (this.state.focused) {
      inputDisplayValue = this.state.inputValue;
    } else {
      inputDisplayValue = this.toPrecisionAsStep(this.state.value);
    }

    if (inputDisplayValue === undefined || inputDisplayValue === null) {
      inputDisplayValue = '';
    }

    let upEvents;
    let downEvents;
    if (useTouch) {
      upEvents = {
        onTouchStart: (editable && !upDisabledClass) ? this.up : noop,
        onTouchEnd: this.stop,
      };
      downEvents = {
        onTouchStart: (editable && !downDisabledClass) ? this.down : noop,
        onTouchEnd: this.stop,
      };
    } else {
      upEvents = {
        onMouseDown: (editable && !upDisabledClass) ? this.up : noop,
        onMouseUp: this.stop,
        onMouseLeave: this.stop,
      };
      downEvents = {
        onMouseDown: (editable && !downDisabledClass) ? this.down : noop,
        onMouseUp: this.stop,
        onMouseLeave: this.stop,
      };
    }
    const inputDisplayValueFormat = this.formatWrapper(inputDisplayValue);
    const isUpDisabled = !!upDisabledClass || disabled || readOnly;
    const isDownDisabled = !!downDisabledClass || disabled || readOnly;
    // ref for test
    return (
      <div
        className={classes}
        style={props.style}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onMouseOver={props.onMouseOver}
        onMouseOut={props.onMouseOut}
      >
        <div className={`${prefixCls}-handler-wrap`}>
          <InputHandler
            ref="up"
            disabled={isUpDisabled}
            prefixCls={prefixCls}
            unselectable="unselectable"
            {...upEvents}
            role="button"
            aria-label="Increase Value"
            aria-disabled={!!isUpDisabled}
            className={`${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`}
          >
            {this.props.upHandler || <span
              unselectable="unselectable"
              className={`${prefixCls}-handler-up-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
          <InputHandler
            ref="down"
            disabled={isDownDisabled}
            prefixCls={prefixCls}
            unselectable="unselectable"
            {...downEvents}
            role="button"
            aria-label="Decrease Value"
            aria-disabled={!!isDownDisabled}
            className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}
          >
            {this.props.downHandler || <span
              unselectable="unselectable"
              className={`${prefixCls}-handler-down-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
        </div>
        <div
          className={`${prefixCls}-input-wrap`}
          role="spinbutton"
          aria-valuemin={props.min}
          aria-valuemax={props.max}
          aria-valuenow={value}
        >
          <input
            required={props.required}
            type={props.type}
            placeholder={props.placeholder}
            onClick={props.onClick}
            className={`${prefixCls}-input`}
            tabIndex={props.tabIndex}
            autoComplete="off"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={editable ? this.onKeyDown : noop}
            onKeyUp={editable ? this.onKeyUp : noop}
            autoFocus={props.autoFocus}
            maxLength={props.maxLength}
            readOnly={props.readOnly}
            disabled={props.disabled}
            max={props.max}
            min={props.min}
            step={props.step}
            name={props.name}
            id={props.id}
            onChange={this.onChange}
            ref={this.saveInput}
            value={inputDisplayValueFormat}
            pattern={props.pattern}
          />
        </div>
      </div>
    );
  }
}
