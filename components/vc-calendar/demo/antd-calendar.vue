<script>
/* eslint no-console:0, no-unused-vars:0 */

import '../assets/index.less';
import PropTypes from '@/components/_util/vue-types';
import Calendar from '../';
import DatePicker from '../src/Picker';
import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
import '../../vc-time-picker/assets/index.less';
import TimePickerPanel from '../../vc-time-picker/Panel';
import BaseMixin from '@/components/_util/BaseMixin';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD HH:mm:ss';
const cn = window.location.search.indexOf('cn') !== -1;
const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

function getFormat(time) {
  return time ? format : 'YYYY-MM-DD';
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = h => <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;

function disabledTime(date) {
  console.log('disabledTime', date);
  if (date && date.date() === 15) {
    return {
      disabledHours() {
        return [3, 4];
      },
    };
  }
  return {
    disabledHours() {
      return [1, 2];
    },
  };
}

function disabledDate(current) {
  if (!current) {
    // allow empty select
    return false;
  }
  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.valueOf() < date.valueOf(); // can not select days before today
}

const Demo = {
  props: {
    defaultValue: PropTypes.object,
    defaultCalendarValue: PropTypes.object,
  },
  mixins: [BaseMixin],
  data() {
    return {
      showTime: true,
      showDateInput: true,
      disabled: false,
      value: this.defaultValue,
    };
  },
  methods: {
    onChange(value) {
      console.log('DatePicker change: ', value && value.format(format));
      this.setState({
        value,
      });
    },

    onShowTimeChange(e) {
      this.setState({
        showTime: e.target.checked,
      });
    },

    onShowDateInputChange(e) {
      this.setState({
        showDateInput: e.target.checked,
      });
    },

    toggleDisabled() {
      this.setState({
        disabled: !this.disabled,
      });
    },
  },

  render(h) {
    const state = this.$data;
    const calendar = (
      <Calendar
        locale={cn ? zhCN : enUS}
        style={{ zIndex: 1000 }}
        dateInputPlaceholder="please input"
        formatter={getFormat(state.showTime)}
        disabledTime={state.showTime ? disabledTime : null}
        timePicker={state.showTime ? timePickerElement(h) : null}
        defaultValue={this.defaultCalendarValue}
        showDateInput={state.showDateInput}
        disabledDate={disabledDate}
      />
    );
    return (
      <div style={{ width: '400px', margin: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input type="checkbox" checked={state.showTime} onChange={this.onShowTimeChange} />
            showTime
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              checked={state.showDateInput}
              onChange={this.onShowDateInputChange}
            />
            showDateInput
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input checked={state.disabled} onChange={this.toggleDisabled} type="checkbox" />
            disabled
          </label>
        </div>
        <div
          style={{
            boxSizing: 'border-box',
            position: 'relative',
            display: 'block',
            lineHeight: 1.5,
            marginBottom: '22px',
          }}
        >
          <DatePicker
            animation="slide-up"
            disabled={state.disabled}
            calendar={calendar}
            value={state.value}
            onChange={this.onChange}
            scopedSlots={{
              default: ({ value }) => {
                return (
                  <span tabIndex="0">
                    <input
                      placeholder="please select"
                      style={{ width: '250px' }}
                      disabled={state.disabled}
                      readOnly
                      tabIndex="-1"
                      class="ant-calendar-picker-input ant-input"
                      value={(value && value.format(getFormat(state.showTime))) || ''}
                    />
                  </span>
                );
              },
            }}
          ></DatePicker>
        </div>
      </div>
    );
  },
};

const multiFormats = ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYY', 'D/M/YY'];

const DemoMultiFormat = {
  data: () => ({
    value: now,
  }),
  methods: {
    onChange(value) {
      console.log('Calendar change: ', value && value.format(format));
      this.value = value;
    },
  },

  render() {
    const state = this.$data;
    return (
      <div style={{ width: '400px', margin: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          Accepts multiple input formats
          <br />
          <small>{multiFormats.join(', ')}</small>
        </div>
        <Calendar
          locale={cn ? zhCN : enUS}
          style={{ zIndex: 1000 }}
          dateInputPlaceholder="please input"
          format={multiFormats}
          value={state.value}
          onChange={this.onChange}
          focusablePanel={false}
        />
      </div>
    );
  },
};

function onStandaloneSelect(value) {
  console.log('onStandaloneSelect');
  console.log(value && value.format(format));
}

function onStandaloneChange(value) {
  console.log('onStandaloneChange');
  console.log(value && value.format(format));
}

export default {
  render(h) {
    return (
      <div
        style={{
          zIndex: 1000,
          position: 'relative',
          width: '900px',
          margin: '20px auto',
        }}
      >
        <div>
          <div style={{ margin: '10px' }}>
            <Calendar
              showWeekNumber={false}
              locale={cn ? zhCN : enUS}
              defaultValue={now}
              disabledTime={disabledTime}
              showToday
              format={getFormat(true)}
              showOk={false}
              timePicker={timePickerElement(h)}
              onChange={onStandaloneChange}
              disabledDate={disabledDate}
              onSelect={onStandaloneSelect}
              renderFooter={mode => <span>{mode} extra footer</span>}
            />
          </div>
          <div style={{ float: 'left', width: '300px' }}>
            <Demo defaultValue={now} />
          </div>
          <div style={{ float: 'right', width: '300px' }}>
            <Demo defaultCalendarValue={defaultCalendarValue} />
          </div>
          <div style={{ clear: 'both' }}></div>
          <div>
            <DemoMultiFormat />
          </div>
        </div>
      </div>
    );
  },
};
</script>
