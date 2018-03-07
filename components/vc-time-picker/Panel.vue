<script>
import PropTypes from 'prop-types'
import Header from './Header'
import Combobox from './Combobox'
import moment from 'moment'
import classNames from 'classnames'

function noop () {
}

function generateOptions (length, disabledOptions, hideDisabledOptions, step = 1) {
  const arr = []
  for (let value = 0; value < length; value += step) {
    if (!disabledOptions || disabledOptions.indexOf(value) < 0 || !hideDisabledOptions) {
      arr.push(value)
    }
  }
  return arr
}

class Panel extends Component {
  static propTypes = {
    clearText: PropTypes.string,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    defaultOpenValue: PropTypes.object,
    value: PropTypes.object,
    placeholder: PropTypes.string,
    format: PropTypes.string,
    inputReadOnly: PropTypes.bool,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    hideDisabledOptions: PropTypes.bool,
    onChange: PropTypes.func,
    onEsc: PropTypes.func,
    allowEmpty: PropTypes.bool,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    onClear: PropTypes.func,
    use12Hours: PropTypes.bool,
    hourStep: PropTypes.number,
    minuteStep: PropTypes.number,
    secondStep: PropTypes.number,
    addon: PropTypes.func,
    focusOnOpen: PropTypes.bool,
    onKeyDown: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'rc-time-picker-panel',
    onChange: noop,
    onClear: noop,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    defaultOpenValue: moment(),
    use12Hours: false,
    addon: noop,
    onKeyDown: noop,
    inputReadOnly: false,
  };

  constructor (props) {
    super(props)
    this.state = {
      value: props.value,
      selectionRange: [],
    }
  }

  componentWillReceiveProps (nextProps) {
    const value = nextProps.value
    if (value) {
      this.setState({
        value,
      })
    }
  }

  onChange = (newValue) => {
    this.setState({ value: newValue })
    this.props.onChange(newValue)
  }

  onCurrentSelectPanelChange = (currentSelectPanel) => {
    this.setState({ currentSelectPanel })
  }

  // https://github.com/ant-design/ant-design/issues/5829
  close () {
    this.props.onEsc()
  }

  disabledHours = () => {
    const { use12Hours, disabledHours } = this.props
    let disabledOptions = disabledHours()
    if (use12Hours && Array.isArray(disabledOptions)) {
      if (this.isAM()) {
        disabledOptions = disabledOptions.filter(h => h < 12).map(h => (h === 0 ? 12 : h))
      } else {
        disabledOptions = disabledOptions.map(h => (h === 12 ? 12 : h - 12))
      }
    }
    return disabledOptions
  }

  isAM () {
    const value = (this.state.value || this.props.defaultOpenValue)
    return value.hour() >= 0 && value.hour() < 12
  }

  render () {
    const {
      prefixCls, className, placeholder, disabledMinutes,
      disabledSeconds, hideDisabledOptions, allowEmpty, showHour, showMinute, showSecond,
      format, defaultOpenValue, clearText, onEsc, addon, use12Hours, onClear,
      focusOnOpen, onKeyDown, hourStep, minuteStep, secondStep, inputReadOnly,
    } = this.props
    const {
      value, currentSelectPanel,
    } = this.state
    const disabledHourOptions = this.disabledHours()
    const disabledMinuteOptions = disabledMinutes(value ? value.hour() : null)
    const disabledSecondOptions = disabledSeconds(value ? value.hour() : null,
      value ? value.minute() : null)
    const hourOptions = generateOptions(
      24, disabledHourOptions, hideDisabledOptions, hourStep
    )
    const minuteOptions = generateOptions(
      60, disabledMinuteOptions, hideDisabledOptions, minuteStep
    )
    const secondOptions = generateOptions(
      60, disabledSecondOptions, hideDisabledOptions, secondStep
    )

    return (
      <div className={classNames({ [`${prefixCls}-inner`]: true, [className]: !!className })}>
        <Header
          clearText={clearText}
          prefixCls={prefixCls}
          defaultOpenValue={defaultOpenValue}
          value={value}
          currentSelectPanel={currentSelectPanel}
          onEsc={onEsc}
          format={format}
          placeholder={placeholder}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={this.disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onChange={this.onChange}
          onClear={onClear}
          allowEmpty={allowEmpty}
          focusOnOpen={focusOnOpen}
          onKeyDown={onKeyDown}
          inputReadOnly={inputReadOnly}
        />
        <Combobox
          prefixCls={prefixCls}
          value={value}
          defaultOpenValue={defaultOpenValue}
          format={format}
          onChange={this.onChange}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={this.disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onCurrentSelectPanelChange={this.onCurrentSelectPanelChange}
          use12Hours={use12Hours}
          isAM={this.isAM()}
        />
        {addon(this)}
      </div>
    )
  }
}

export default Panel
</script>
