<script>
import PropTypes from 'prop-types'
import Select from './Select'

const formatOption = (option, disabledOptions) => {
  let value = `${option}`
  if (option < 10) {
    value = `0${option}`
  }

  let disabled = false
  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
    disabled = true
  }

  return {
    value,
    disabled,
  }
}

class Combobox extends Component {
  static propTypes = {
    format: PropTypes.string,
    defaultOpenValue: PropTypes.object,
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    onCurrentSelectPanelChange: PropTypes.func,
    use12Hours: PropTypes.bool,
    isAM: PropTypes.bool,
  };

  onItemChange = (type, itemValue) => {
    const { onChange, defaultOpenValue, use12Hours } = this.props
    const value = (this.props.value || defaultOpenValue).clone()

    if (type === 'hour') {
      if (use12Hours) {
        if (this.props.isAM) {
          value.hour(+itemValue % 12)
        } else {
          value.hour((+itemValue % 12) + 12)
        }
      } else {
        value.hour(+itemValue)
      }
    } else if (type === 'minute') {
      value.minute(+itemValue)
    } else if (type === 'ampm') {
      const ampm = itemValue.toUpperCase()
      if (use12Hours) {
        if (ampm === 'PM' && value.hour() < 12) {
          value.hour((value.hour() % 12) + 12)
        }

        if (ampm === 'AM') {
          if (value.hour() >= 12) {
            value.hour(value.hour() - 12)
          }
        }
      }
    } else {
      value.second(+itemValue)
    }
    onChange(value)
  }

  onEnterSelectPanel = (range) => {
    this.props.onCurrentSelectPanelChange(range)
  }

  getHourSelect (hour) {
    const { prefixCls, hourOptions, disabledHours, showHour, use12Hours } = this.props
    if (!showHour) {
      return null
    }
    const disabledOptions = disabledHours()
    let hourOptionsAdj
    let hourAdj
    if (use12Hours) {
      hourOptionsAdj = [12].concat(hourOptions.filter(h => h < 12 && h > 0))
      hourAdj = (hour % 12) || 12
    } else {
      hourOptionsAdj = hourOptions
      hourAdj = hour
    }

    return (
      <Select
        prefixCls={prefixCls}
        options={hourOptionsAdj.map(option => formatOption(option, disabledOptions))}
        selectedIndex={hourOptionsAdj.indexOf(hourAdj)}
        type='hour'
        onSelect={this.onItemChange}
        onMouseEnter={this.onEnterSelectPanel.bind(this, 'hour')}
      />
    )
  }

  getMinuteSelect (minute) {
    const { prefixCls, minuteOptions, disabledMinutes, defaultOpenValue, showMinute } = this.props
    if (!showMinute) {
      return null
    }
    const value = this.props.value || defaultOpenValue
    const disabledOptions = disabledMinutes(value.hour())

    return (
      <Select
        prefixCls={prefixCls}
        options={minuteOptions.map(option => formatOption(option, disabledOptions))}
        selectedIndex={minuteOptions.indexOf(minute)}
        type='minute'
        onSelect={this.onItemChange}
        onMouseEnter={this.onEnterSelectPanel.bind(this, 'minute')}
      />
    )
  }

  getSecondSelect (second) {
    const { prefixCls, secondOptions, disabledSeconds, showSecond, defaultOpenValue } = this.props
    if (!showSecond) {
      return null
    }
    const value = this.props.value || defaultOpenValue
    const disabledOptions = disabledSeconds(value.hour(), value.minute())

    return (
      <Select
        prefixCls={prefixCls}
        options={secondOptions.map(option => formatOption(option, disabledOptions))}
        selectedIndex={secondOptions.indexOf(second)}
        type='second'
        onSelect={this.onItemChange}
        onMouseEnter={this.onEnterSelectPanel.bind(this, 'second')}
      />
    )
  }

  getAMPMSelect () {
    const { prefixCls, use12Hours, format } = this.props
    if (!use12Hours) {
      return null
    }

    const AMPMOptions = ['am', 'pm'] // If format has A char, then we should uppercase AM/PM
      .map(c => format.match(/\sA/) ? c.toUpperCase() : c)
      .map(c => ({ value: c }))

    const selected = this.props.isAM ? 0 : 1

    return (
      <Select
        prefixCls={prefixCls}
        options={AMPMOptions}
        selectedIndex={selected}
        type='ampm'
        onSelect={this.onItemChange}
        onMouseEnter={this.onEnterSelectPanel.bind(this, 'ampm')}
      />
    )
  }

  render () {
    const { prefixCls, defaultOpenValue } = this.props
    const value = this.props.value || defaultOpenValue
    return (
      <div className={`${prefixCls}-combobox`}>
        {this.getHourSelect(value.hour())}
        {this.getMinuteSelect(value.minute())}
        {this.getSecondSelect(value.second())}
        {this.getAMPMSelect(value.hour())}
      </div>
    )
  }
}

export default Combobox

</script>