<script>
/* eslint no-console:0 */
import '../assets/index.less';
import PropTypes from '@/components/_util/vue-types';
import DatePicker from '../src/Picker';
import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
import '../../vc-time-picker/assets/index.less';
import BaseMixin from '@/components/_util/BaseMixin';

import MonthCalendar from '../src/MonthCalendar';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM';
const cn = window.location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const Demo = {
  mixins: [BaseMixin],
  props: {
    defaultValue: PropTypes.object,
  },

  data() {
    return {
      showTime: true,
      disabled: false,
      value: this.defaultValue,
    };
  },
  methods: {
    onChange(value) {
      console.log(`DatePicker change: ${value && value.format(format)}`);
      this.setState({
        value,
      });
    },

    onShowTimeChange(e) {
      this.setState({
        showTime: e.target.checked,
      });
    },

    toggleDisabled() {
      this.setState({
        disabled: !this.disabled,
      });
    },
  },

  render() {
    const state = this.$data;
    const calendar = <MonthCalendar locale={cn ? zhCN : enUS} style={{ zIndex: 1000 }} />;
    return (
      <div style={{ width: '240px', margin: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input checked={state.disabled} onChange={this.toggleDisabled} type="checkbox" />{' '}
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
                  <input
                    style={{ width: '200px' }}
                    readOnly
                    disabled={state.disabled}
                    value={value && value.format(format)}
                    placeholder="请选择日期"
                  />
                );
              },
            }}
          ></DatePicker>
        </div>
      </div>
    );
  },
};

function onStandaloneSelect(value) {
  console.log('month-calendar select', value && value.format(format));
}

function onStandaloneChange(value) {
  console.log('month-calendar change', value && value.format(format));
}

function disabledDate(value) {
  return value.year() > now.year() || (value.year() === now.year() && value.month() > now.month());
}

function onMonthCellContentRender(value) {
  // console.log('month-calendar onMonthCellContentRender', (value && value.format(format)));
  return `${value.month() + 1}月`;
}
export default {
  render() {
    return (
      <div
        style={{
          zIndex: 1000,
          position: 'relative',
          width: '600px',
          margin: '0 auto',
        }}
      >
        <MonthCalendar
          locale={cn ? zhCN : enUS}
          style={{ zIndex: 1000 }}
          disabledDate={disabledDate}
          onSelect={onStandaloneSelect}
          onChange={onStandaloneChange}
          monthCellContentRender={onMonthCellContentRender}
          defaultValue={defaultCalendarValue}
          renderFooter={() => 'extra footer'}
        />

        <div style={{ marginTop: '200px' }}>
          <Demo defaultValue={now} />
        </div>
      </div>
    );
  },
};
</script>
