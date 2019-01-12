import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import moment from 'moment';
import DatePicker from '../';

const { MonthPicker, WeekPicker } = DatePicker;

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
