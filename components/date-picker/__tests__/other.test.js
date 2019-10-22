import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import moment from 'moment';
import DatePicker from '../';
import LocaleProvider from '../../locale-provider';
import locale from '../../locale-provider/zh_CN';

const { MonthPicker, WeekPicker } = DatePicker;

describe('Picker format by locale', () => {
  const myLocale = {
    ...locale,
    DatePicker: {
      ...locale.DatePicker,
      dateFormat: 'YYYY 年 M 月 D 日',
      dateTimeFormat: 'YYYY 年 M 月 D 日 H 时 m 分 s 秒',
      weekFormat: 'YYYY 年 W 周',
      monthFormat: 'YYYY 年 M 月',
    },
  };

  const date = moment('2000-01-01', 'YYYY-MM-DD');
  function matchPicker(name, Picker, props) {
    it(name, async () => {
      const wrapper = mount(
        {
          render() {
            return (
              <LocaleProvider locale={myLocale}>
                <Picker {...{ value: date, ...props }} />
              </LocaleProvider>
            );
          },
        },
        { sync: false },
      );
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  }

  matchPicker('date', DatePicker);
  matchPicker('dateTime', DatePicker, { showTime: true });
  matchPicker('week', WeekPicker);
  matchPicker('month', MonthPicker);
});

describe('MonthPicker and WeekPicker', () => {
  it('render MonthPicker', async () => {
    const birthday = moment('2000-01-01', 'YYYY-MM-DD').locale('zh-cn');
    const wrapper = mount(MonthPicker, { propsData: { open: true }, sync: false });
    await asyncExpect(() => {
      wrapper.setProps({ value: birthday });
    });

    const calendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(calendarWrapper.html()).toMatchSnapshot();
    });
  });

  it('render WeekPicker', async () => {
    const birthday = moment('2000-01-01', 'YYYY-MM-DD').locale('zh-cn');
    const wrapper = mount(WeekPicker, { propsData: { open: true }, sync: false });
    await asyncExpect(() => {
      wrapper.setProps({ value: birthday });
    });
    const calendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(calendarWrapper.html()).toMatchSnapshot();
    });
  });
});
