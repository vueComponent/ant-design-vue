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
  it('should not throw error when value is reset to `[]`', async () => {
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

  it('customize separator', () => {
    const wrapper = mount(RangePicker, { props: { separator: 'test' } });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
