<script>
/* eslint react/no-multi-comp:0, no-console:0 */
import '../assets/index.less';
import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
import '../../vc-time-picker/assets/index.less';
import BaseMixin from '@/components/_util/BaseMixin';

import FullCalendar from '@/components/vc-calendar/src/FullCalendar';

import '@/components/vc-select/assets/index.less';
import Select from '@/components/vc-select';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD';
const cn = window.location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

function onSelect(value) {
  console.log('select', value.format(format));
}

export default {
  mixins: [BaseMixin],
  data() {
    return {
      type: 'month',
    };
  },
  methods: {
    onTypeChange(type) {
      this.setState({
        type,
      });
    },
  },

  render() {
    return (
      <div style={{ zIndex: 1000, position: 'relative' }}>
        <FullCalendar
          style={{ margin: '10px' }}
          Select={Select}
          fullscreen={false}
          onSelect={onSelect}
          defaultValue={now}
          locale={cn ? zhCN : enUS}
        />
        <FullCalendar
          style={{ margin: '10px' }}
          Select={Select}
          fullscreen
          defaultValue={now}
          onSelect={onSelect}
          type={this.type}
          onTypeChange={this.onTypeChange}
          locale={cn ? zhCN : enUS}
        />
      </div>
    );
  },
};
</script>
