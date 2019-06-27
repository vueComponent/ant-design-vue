import PropTypes from '../_util/vue-types';
import Select from './Select';
import BaseMixin from '../_util/BaseMixin';

const formatOption = (option, disabledOptions) => {
  let value = `${option}`;
  if (option < 10) {
    value = `0${option}`;
  }

  let disabled = false;
  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
    disabled = true;
  }

  return {
    value,
    disabled,
  };
};

const Combobox = {
  mixins: [BaseMixin],
  name: 'Combobox',
  props: {
    format: PropTypes.string,
    defaultOpenValue: PropTypes.object,
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    // onChange: PropTypes.func,
    // onAmPmChange: PropTypes.func,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    // onCurrentSelectPanelChange: PropTypes.func,
    use12Hours: PropTypes.bool,
    isAM: PropTypes.bool,
  },
  methods: {
    onItemChange(type, itemValue) {
      const { defaultOpenValue, use12Hours, value: propValue, isAM } = this;
      const value = (propValue || defaultOpenValue).clone();

      if (type === 'hour') {
        if (use12Hours) {
          if (isAM) {
            value.hour(+itemValue % 12);
          } else {
            value.hour((+itemValue % 12) + 12);
          }
        } else {
          value.hour(+itemValue);
        }
      } else if (type === 'minute') {
        value.minute(+itemValue);
      } else if (type === 'ampm') {
        const ampm = itemValue.toUpperCase();
        if (use12Hours) {
          if (ampm === 'PM' && value.hour() < 12) {
            value.hour((value.hour() % 12) + 12);
          }

          if (ampm === 'AM') {
            if (value.hour() >= 12) {
              value.hour(value.hour() - 12);
            }
          }
        }
        this.__emit('amPmChange', ampm);
      } else {
        value.second(+itemValue);
      }
      this.__emit('change', value);
    },

    onEnterSelectPanel(range) {
      this.__emit('currentSelectPanelChange', range);
    },

    getHourSelect(hour) {
      const { prefixCls, hourOptions, disabledHours, showHour, use12Hours } = this;
      if (!showHour) {
        return null;
      }
      const disabledOptions = disabledHours();
      let hourOptionsAdj;
      let hourAdj;
      if (use12Hours) {
        hourOptionsAdj = [12].concat(hourOptions.filter(h => h < 12 && h > 0));
        hourAdj = hour % 12 || 12;
      } else {
        hourOptionsAdj = hourOptions;
        hourAdj = hour;
      }

      return (
        <Select
          prefixCls={prefixCls}
          options={hourOptionsAdj.map(option => formatOption(option, disabledOptions))}
          selectedIndex={hourOptionsAdj.indexOf(hourAdj)}
          type="hour"
          onSelect={this.onItemChange}
          onMouseenter={() => this.onEnterSelectPanel('hour')}
        />
      );
    },

    getMinuteSelect(minute) {
      const {
        prefixCls,
        minuteOptions,
        disabledMinutes,
        defaultOpenValue,
        showMinute,
        value: propValue,
      } = this;
      if (!showMinute) {
        return null;
      }
      const value = propValue || defaultOpenValue;
      const disabledOptions = disabledMinutes(value.hour());

      return (
        <Select
          prefixCls={prefixCls}
          options={minuteOptions.map(option => formatOption(option, disabledOptions))}
          selectedIndex={minuteOptions.indexOf(minute)}
          type="minute"
          onSelect={this.onItemChange}
          onMouseenter={() => this.onEnterSelectPanel('minute')}
        />
      );
    },

    getSecondSelect(second) {
      const {
        prefixCls,
        secondOptions,
        disabledSeconds,
        showSecond,
        defaultOpenValue,
        value: propValue,
      } = this;
      if (!showSecond) {
        return null;
      }
      const value = propValue || defaultOpenValue;
      const disabledOptions = disabledSeconds(value.hour(), value.minute());

      return (
        <Select
          prefixCls={prefixCls}
          options={secondOptions.map(option => formatOption(option, disabledOptions))}
          selectedIndex={secondOptions.indexOf(second)}
          type="second"
          onSelect={this.onItemChange}
          onMouseenter={() => this.onEnterSelectPanel('second')}
        />
      );
    },

    getAMPMSelect() {
      const { prefixCls, use12Hours, format, isAM } = this;
      if (!use12Hours) {
        return null;
      }

      const AMPMOptions = ['am', 'pm'] // If format has A char, then we should uppercase AM/PM
        .map(c => (format.match(/\sA/) ? c.toUpperCase() : c))
        .map(c => ({ value: c }));

      const selected = isAM ? 0 : 1;

      return (
        <Select
          prefixCls={prefixCls}
          options={AMPMOptions}
          selectedIndex={selected}
          type="ampm"
          onSelect={this.onItemChange}
          onMouseenter={() => this.onEnterSelectPanel('ampm')}
        />
      );
    },
  },

  render() {
    const { prefixCls, defaultOpenValue, value: propValue } = this;
    const value = propValue || defaultOpenValue;
    return (
      <div class={`${prefixCls}-combobox`}>
        {this.getHourSelect(value.hour())}
        {this.getMinuteSelect(value.minute())}
        {this.getSecondSelect(value.second())}
        {this.getAMPMSelect(value.hour())}
      </div>
    );
  },
};

export default Combobox;
