import { mount } from '@vue/test-utils';
import { asyncExpect, setMockDate, resetMockDate, sleep } from '../../../tests/utils';
import dayjs from 'dayjs';
import DatePicker from '../';
import { openPicker, selectCell, closePicker } from './utils';
import focusTest from '../../../tests/shared/focusTest';
jest.mock('../../_util/Portal');
const { RangePicker } = DatePicker;

describe('RangePicker', () => {
  focusTest(RangePicker);

  beforeEach(() => {
    document.body.outerHTML = '';
    setMockDate();
  });

  afterEach(() => {
    resetMockDate();
  });
  // issue: https://github.com/ant-design/ant-design/issues/5872
  xit('should not throw error when value is reset to `[]`', async () => {
    const birthday = dayjs('2000-01-01', 'YYYY-MM-DD');
    const wrapper = mount(
      {
        props: ['value'],
        setup(props) {
          return () => <RangePicker value={props.value} open />;
        },
      },
      { attachTo: 'body', sync: 'false' },
    );
    wrapper.setProps({ value: [birthday, birthday] });
    wrapper.setProps({ value: [] });
    await sleep(0);
    expect(() => {
      openPicker(wrapper);
      selectCell(wrapper, 3);
      closePicker(wrapper);

      openPicker(wrapper, 1);
      selectCell(wrapper, 5, 1);
      closePicker(wrapper, 1);
    }).not.toThrow();
  });

  it('show month panel according to value', async () => {
    const birthday = dayjs('2000-01-01', 'YYYY-MM-DD').locale('zh-cn');
    const wrapper = mount(RangePicker, {
      props: {
        getPopupContainer: trigger => trigger,
        format: 'YYYY/MM/DD',
        showTime: true,
        open: true,
      },
      sync: false,
      attachTo: 'body',
    });
    await asyncExpect(() => {
      wrapper.setProps({ value: [birthday, birthday] });
    });
    await asyncExpect(() => {
      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });

  fit('customize separator', async () => {
    const wrapper = mount(RangePicker, { props: { separator: 'test' } });
    await sleep();
    expect(wrapper.html()).toMatchSnapshot();
  });

  fit('test WeekPicker valueFormat', async () => {
    const case1 = ['2023-22', '2023-24'];
    const case2 = ['2023-27', '2023-28'];
    const wrapper = mount(RangePicker, {
      props: {
        picker: 'week',
        format: 'YYYY-ww',
        valueFormat: 'YYYY-ww',
        value: case1,
      },
      sync: false,
      attachTo: 'body',
    });
    const inputs = wrapper.findAll('input');
    expect((inputs[0].element.value, inputs[1].element.value)).toBe((case1[0], case1[1]));
    await asyncExpect(() => {
      wrapper.setProps({ value: case2 });
    });
    expect((inputs[0].element.value, inputs[1].element.value)).toBe((case2[0], case2[1]));
  });
});
