<script>
/* eslint react/no-multi-comp:0, no-console:0, no-unused-vars:0 */

import '../assets/index.less';
import '@/components/vc-time-picker/assets/index.less';
import Picker from '../src/Picker';
import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
import '../../vc-time-picker/assets/index.less';
import TimePickerPanel from '../../vc-time-picker/Panel';
import BaseMixin from '@/components/_util/BaseMixin';

import RangeCalendar from '../src/RangeCalendar';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const cn = window.location.search.indexOf('cn') !== -1;

if (cn) {
  moment.locale('zh-cn');
} else {
  moment.locale('en-gb');
}

const now = moment();
if (cn) {
  now.utcOffset(8);
} else {
  now.utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = h => (
  <TimePickerPanel
    defaultValue={[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}
  />
);

function newArray(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.isBefore(date); // can not select days before today
}

function disabledTime(time, type) {
  console.log('disabledTime', time, type);
  if (type === 'start') {
    return {
      disabledHours() {
        const hours = newArray(0, 60);
        hours.splice(20, 4);
        return hours;
      },
      disabledMinutes(h) {
        if (h === 20) {
          return newArray(0, 31);
        } else if (h === 23) {
          return newArray(30, 60);
        }
        return [];
      },
      disabledSeconds() {
        return [55, 56];
      },
    };
  }
  return {
    disabledHours() {
      const hours = newArray(0, 60);
      hours.splice(2, 6);
      return hours;
    },
    disabledMinutes(h) {
      if (h === 20) {
        return newArray(0, 31);
      } else if (h === 23) {
        return newArray(30, 60);
      }
      return [];
    },
    disabledSeconds() {
      return [55, 56];
    },
  };
}

const formatStr = 'YYYY-MM-DD HH:mm:ss';
function format(v) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

function onStandaloneChange(value) {
  console.log('onChange');
  console.log(value[0] && format(value[0]), value[1] && format(value[1]));
}

function onStandaloneSelect(value) {
  console.log('onSelect');
  console.log(format(value[0]), format(value[1]));
}

const Demo = {
  mixins: [BaseMixin],
  data() {
    return {
      value: [],
      hoverValue: [],
    };
  },
  methods: {
    onChange(value) {
      console.log('onChange', value);
      this.setState({ value });
    },

    onHoverChange(hoverValue) {
      this.setState({ hoverValue });
    },
  },
  render(h) {
    const state = this.$data;
    const calendar = (
      <RangeCalendar
        hoverValue={state.hoverValue}
        onHoverChange={this.onHoverChange}
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        defaultValue={[now, now.clone().add(1, 'months')]}
        locale={cn ? zhCN : enUS}
        disabledTime={disabledTime}
        timePicker={timePickerElement(h)}
        renderFooter={() => 'extra footer'}
      />
    );
    return (
      <Picker value={state.value} onChange={this.onChange} animation="slide-up" calendar={calendar}>
        {({ value }) => {
          return (
            <span>
              <input
                placeholder="please select"
                style={{ width: '350px' }}
                disabled={state.disabled}
                readOnly
                className="ant-calendar-picker-input ant-input"
                value={(isValidRange(value) && `${format(value[0])} - ${format(value[1])}`) || ''}
              />
            </span>
          );
        }}
      </Picker>
    );
  },
};

export default {
  render(h) {
    return (
      <div>
        <h2>calendar</h2>
        <div style={{ margin: '10px' }}>
          <RangeCalendar
            showToday={false}
            showWeekNumber
            dateInputPlaceholder={['start', 'end']}
            locale={cn ? zhCN : enUS}
            showOk={false}
            showClear
            format={formatStr}
            onChange={onStandaloneChange}
            onSelect={onStandaloneSelect}
            disabledDate={disabledDate}
            timePicker={timePickerElement(h)}
            disabledTime={disabledTime}
          />
        </div>
        <br />

        <div style={{ margin: '20px' }}>
          <Demo />
        </div>
      </div>
    );
  },
};
</script>
