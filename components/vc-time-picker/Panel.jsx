import moment from 'moment';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import Header from './Header';
import Combobox from './Combobox';
import { getComponentFromProp, getListeners } from '../_util/props-util';

function noop() {}

function generateOptions(length, disabledOptions, hideDisabledOptions, step = 1) {
  const arr = [];
  for (let value = 0; value < length; value += step) {
    if (!disabledOptions || disabledOptions.indexOf(value) < 0 || !hideDisabledOptions) {
      arr.push(value);
    }
  }
  return arr;
}

function toNearestValidTime(time, hourOptions, minuteOptions, secondOptions) {
  const hour = hourOptions
    .slice()
    .sort((a, b) => Math.abs(time.hour() - a) - Math.abs(time.hour() - b))[0];
  const minute = minuteOptions
    .slice()
    .sort((a, b) => Math.abs(time.minute() - a) - Math.abs(time.minute() - b))[0];
  const second = secondOptions
    .slice()
    .sort((a, b) => Math.abs(time.second() - a) - Math.abs(time.second() - b))[0];
  return moment(`${hour}:${minute}:${second}`, 'HH:mm:ss');
}

const Panel = {
  mixins: [BaseMixin],
  props: {
    clearText: PropTypes.string,
    prefixCls: PropTypes.string.def('rc-time-picker-panel'),
    defaultOpenValue: {
      type: Object,
      default: () => {
        return moment();
      },
    },
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    placeholder: PropTypes.string,
    format: PropTypes.string,
    inputReadOnly: PropTypes.bool.def(false),
    disabledHours: PropTypes.func.def(noop),
    disabledMinutes: PropTypes.func.def(noop),
    disabledSeconds: PropTypes.func.def(noop),
    hideDisabledOptions: PropTypes.bool,
    // onChange: PropTypes.func,
    // onEsc: PropTypes.func,
    allowEmpty: PropTypes.bool,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    // onClear: PropTypes.func,
    use12Hours: PropTypes.bool.def(false),
    hourStep: PropTypes.number,
    minuteStep: PropTypes.number,
    secondStep: PropTypes.number,
    addon: PropTypes.func.def(noop),
    focusOnOpen: PropTypes.bool,
    // onKeydown: PropTypes.func,
    clearIcon: PropTypes.any,
  },
  data() {
    return {
      sValue: this.value,
      selectionRange: [],
      currentSelectPanel: '',
    };
  },
  watch: {
    value(val) {
      if (val) {
        this.setState({
          sValue: val,
        });
      }
    },
  },

  methods: {
    onChange(newValue) {
      this.setState({ sValue: newValue });
      this.__emit('change', newValue);
    },

    onAmPmChange(ampm) {
      this.__emit('amPmChange', ampm);
    },

    onCurrentSelectPanelChange(currentSelectPanel) {
      this.setState({ currentSelectPanel });
    },

    // https://github.com/ant-design/ant-design/issues/5829
    close() {
      this.__emit('esc');
    },

    disabledHours2() {
      const { use12Hours, disabledHours } = this;
      let disabledOptions = disabledHours();
      if (use12Hours && Array.isArray(disabledOptions)) {
        if (this.isAM()) {
          disabledOptions = disabledOptions.filter(h => h < 12).map(h => (h === 0 ? 12 : h));
        } else {
          disabledOptions = disabledOptions.map(h => (h === 12 ? 12 : h - 12));
        }
      }
      return disabledOptions;
    },

    isAM() {
      const value = this.sValue || this.defaultOpenValue;
      return value.hour() >= 0 && value.hour() < 12;
    },
  },

  render() {
    const {
      prefixCls,
      placeholder,
      disabledMinutes,
      addon,
      disabledSeconds,
      hideDisabledOptions,
      allowEmpty,
      showHour,
      showMinute,
      showSecond,
      format,
      defaultOpenValue,
      clearText,
      use12Hours,
      focusOnOpen,
      hourStep,
      minuteStep,
      secondStep,
      inputReadOnly,
      sValue,
      currentSelectPanel,
    } = this;
    const clearIcon = getComponentFromProp(this, 'clearIcon');
    const { esc = noop, clear = noop, keydown = noop } = getListeners(this);

    const disabledHourOptions = this.disabledHours2();
    const disabledMinuteOptions = disabledMinutes(sValue ? sValue.hour() : null);
    const disabledSecondOptions = disabledSeconds(
      sValue ? sValue.hour() : null,
      sValue ? sValue.minute() : null,
    );
    const hourOptions = generateOptions(24, disabledHourOptions, hideDisabledOptions, hourStep);
    const minuteOptions = generateOptions(
      60,
      disabledMinuteOptions,
      hideDisabledOptions,
      minuteStep,
    );
    const secondOptions = generateOptions(
      60,
      disabledSecondOptions,
      hideDisabledOptions,
      secondStep,
    );
    const validDefaultOpenValue = toNearestValidTime(
      defaultOpenValue,
      hourOptions,
      minuteOptions,
      secondOptions,
    );
    return (
      <div class={`${prefixCls}-inner`}>
        <Header
          clearText={clearText}
          prefixCls={prefixCls}
          defaultOpenValue={validDefaultOpenValue}
          value={sValue}
          currentSelectPanel={currentSelectPanel}
          onEsc={esc}
          format={format}
          placeholder={placeholder}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={this.disabledHours2}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onChange={this.onChange}
          allowEmpty={allowEmpty}
          focusOnOpen={focusOnOpen}
          onKeydown={keydown}
          inputReadOnly={inputReadOnly}
          clearIcon={clearIcon}
        />
        <Combobox
          prefixCls={prefixCls}
          value={sValue}
          defaultOpenValue={validDefaultOpenValue}
          format={format}
          onChange={this.onChange}
          onAmPmChange={this.onAmPmChange}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={this.disabledHours2}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onCurrentSelectPanelChange={this.onCurrentSelectPanelChange}
          use12Hours={use12Hours}
          isAM={this.isAM()}
        />
        {addon(this)}
      </div>
    );
  },
};

export default Panel;
