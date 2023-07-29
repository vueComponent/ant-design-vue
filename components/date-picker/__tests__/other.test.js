import { mount } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';
import dayjs from 'dayjs';
import DatePicker from '../';
import LocaleProvider from '../../locale-provider';
import locale from '../../locale/zh_CN';
jest.mock('../../_util/Portal');
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

  const date = dayjs('2000-01-01', 'YYYY-MM-DD');
  function matchPicker(name, Picker, props) {
    it(name, async () => {
      const wrapper = mount(
        {
          render() {
            return (
              <LocaleProvider locale={myLocale}>
                <Picker value={date} {...props} />
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
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('render MonthPicker', async () => {
    const birthday = dayjs('2000-01-01', 'YYYY-MM-DD').locale('zh-cn');
    const wrapper = mount(MonthPicker, { props: { open: true }, sync: false });
    await asyncExpect(() => {
      wrapper.setProps({ value: birthday });
    });

    await asyncExpect(() => {
      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });

  it('render WeekPicker', async () => {
    const birthday = dayjs('2000-01-01', 'YYYY-MM-DD').locale('zh-cn');
    const wrapper = mount(WeekPicker, { props: { open: false }, sync: false });
    await sleep(10);
    wrapper.setProps({ value: birthday, open: true });
    await sleep(1000);
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
