<script>
import PropTypes from 'prop-types'
import Trigger from 'rc-trigger'
import Panel from './Panel'
import placements from './placements'
import moment from 'moment'

function noop () {
}

function refFn (field, component) {
  this[field] = component
}

export default class Picker extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    clearText: PropTypes.string,
    value: PropTypes.object,
    defaultOpenValue: PropTypes.object,
    inputReadOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    allowEmpty: PropTypes.bool,
    defaultValue: PropTypes.object,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    align: PropTypes.object,
    placement: PropTypes.any,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    placeholder: PropTypes.string,
    format: PropTypes.string,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    hideDisabledOptions: PropTypes.bool,
    onChange: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    addon: PropTypes.func,
    name: PropTypes.string,
    autoComplete: PropTypes.string,
    use12Hours: PropTypes.bool,
    hourStep: PropTypes.number,
    minuteStep: PropTypes.number,
    secondStep: PropTypes.number,
    focusOnOpen: PropTypes.bool,
    onKeyDown: PropTypes.func,
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    clearText: 'clear',
    prefixCls: 'rc-time-picker',
    defaultOpen: false,
    inputReadOnly: false,
    style: {},
    className: '',
    popupClassName: '',
    align: {},
    defaultOpenValue: moment(),
    allowEmpty: true,
    showHour: true,
    showMinute: true,
    showSecond: true,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    onChange: noop,
    onOpen: noop,
    onClose: noop,
    onFocus: noop,
    onBlur: noop,
    addon: noop,
    use12Hours: false,
    focusOnOpen: false,
    onKeyDown: noop,
  };

  constructor (props) {
    super(props)
    this.saveInputRef = refFn.bind(this, 'picker')
    this.savePanelRef = refFn.bind(this, 'panelInstance')
    const { defaultOpen, defaultValue, open = defaultOpen, value = defaultValue } = props
    this.state = {
      open,
      value,
    }
  }

  componentWillReceiveProps (nextProps) {
    const { value, open } = nextProps
    if ('value' in nextProps) {
      this.setState({
        value,
      })
    }
    if (open !== undefined) {
      this.setState({ open })
    }
  }

  onPanelChange = (value) => {
    this.setValue(value)
  }

  onPanelClear = () => {
    this.setValue(null)
    this.setOpen(false)
  }

  onVisibleChange = (open) => {
    this.setOpen(open)
  }

  onEsc = () => {
    this.setOpen(false)
    this.focus()
  }

  onKeyDown = (e) => {
    if (e.keyCode === 40) {
      this.setOpen(true)
    }
  }

  setValue (value) {
    if (!('value' in this.props)) {
      this.setState({
        value,
      })
    }
    this.props.onChange(value)
  }

  getFormat () {
    const { format, showHour, showMinute, showSecond, use12Hours } = this.props
    if (format) {
      return format
    }

    if (use12Hours) {
      const fmtString = ([
        showHour ? 'h' : '',
        showMinute ? 'mm' : '',
        showSecond ? 'ss' : '',
      ].filter(item => !!item).join(':'))

      return fmtString.concat(' a')
    }

    return [
      showHour ? 'HH' : '',
      showMinute ? 'mm' : '',
      showSecond ? 'ss' : '',
    ].filter(item => !!item).join(':')
  }

  getPanelElement () {
    const {
      prefixCls, placeholder, disabledHours,
      disabledMinutes, disabledSeconds, hideDisabledOptions, inputReadOnly,
      allowEmpty, showHour, showMinute, showSecond, defaultOpenValue, clearText,
      addon, use12Hours, focusOnOpen, onKeyDown, hourStep, minuteStep, secondStep,
    } = this.props
    return (
      <Panel
        clearText={clearText}
        prefixCls={`${prefixCls}-panel`}
        ref={this.savePanelRef}
        value={this.state.value}
        inputReadOnly={inputReadOnly}
        onChange={this.onPanelChange}
        onClear={this.onPanelClear}
        defaultOpenValue={defaultOpenValue}
        showHour={showHour}
        showMinute={showMinute}
        showSecond={showSecond}
        onEsc={this.onEsc}
        allowEmpty={allowEmpty}
        format={this.getFormat()}
        placeholder={placeholder}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        hideDisabledOptions={hideDisabledOptions}
        use12Hours={use12Hours}
        hourStep={hourStep}
        minuteStep={minuteStep}
        secondStep={secondStep}
        addon={addon}
        focusOnOpen={focusOnOpen}
        onKeyDown={onKeyDown}
      />
    )
  }

  getPopupClassName () {
    const { showHour, showMinute, showSecond, use12Hours, prefixCls } = this.props
    let popupClassName = this.props.popupClassName
    // Keep it for old compatibility
    if ((!showHour || !showMinute || !showSecond) && !use12Hours) {
      popupClassName += ` ${prefixCls}-panel-narrow`
    }
    let selectColumnCount = 0
    if (showHour) {
      selectColumnCount += 1
    }
    if (showMinute) {
      selectColumnCount += 1
    }
    if (showSecond) {
      selectColumnCount += 1
    }
    if (use12Hours) {
      selectColumnCount += 1
    }
    popupClassName += ` ${prefixCls}-panel-column-${selectColumnCount}`
    return popupClassName
  }

  setOpen (open) {
    const { onOpen, onClose } = this.props
    if (this.state.open !== open) {
      if (!('open' in this.props)) {
        this.setState({ open })
      }
      if (open) {
        onOpen({ open })
      } else {
        onClose({ open })
      }
    }
  }

  focus () {
    this.picker.focus()
  }

  blur () {
    this.picker.blur()
  }

  render () {
    const {
      prefixCls, placeholder, placement, align,
      disabled, transitionName, style, className, getPopupContainer, name, autoComplete,
      onFocus, onBlur, autoFocus, inputReadOnly,
    } = this.props
    const { open, value } = this.state
    const popupClassName = this.getPopupClassName()
    return (
      <Trigger
        prefixCls={`${prefixCls}-panel`}
        popupClassName={popupClassName}
        popup={this.getPanelElement()}
        popupAlign={align}
        builtinPlacements={placements}
        popupPlacement={placement}
        action={disabled ? [] : ['click']}
        destroyPopupOnHide
        getPopupContainer={getPopupContainer}
        popupTransitionName={transitionName}
        popupVisible={open}
        onPopupVisibleChange={this.onVisibleChange}
      >
        <span className={`${prefixCls} ${className}`} style={style}>
          <input
            className={`${prefixCls}-input`}
            ref={this.saveInputRef}
            type='text'
            placeholder={placeholder}
            name={name}
            onKeyDown={this.onKeyDown}
            disabled={disabled}
            value={value && value.format(this.getFormat()) || ''}
            autoComplete={autoComplete}
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus={autoFocus}
            onChange={noop}
            readOnly={!!inputReadOnly}
          />
          <span className={`${prefixCls}-icon`}/>
        </span>
      </Trigger>
    )
  }
}
</script>