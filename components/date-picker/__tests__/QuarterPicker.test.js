import { mount } from '@vue/test-utils';
import DatePicker from '..';
import focusTest from '../../../tests/shared/focusTest';

const { QuarterPicker } = DatePicker;
jest.mock('../../_util/Portal');
describe('QuarterPicker', () => {
  focusTest(QuarterPicker);
  it('reset select item when popup close', async () => {
    const wrapper = mount(DatePicker, {
      props: { style: { width: '400px' }, picker: 'quarter' },
      sync: false,
      attachTo: 'body',
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('test QuarterPicker valueFormat', async () => {
    const case1 = '2023-1';
    const wrapper = mount(DatePicker, {
      props: {
        picker: 'quarter',
        format: 'YYYY-Q',
        valueFormat: 'YYYY-Q',
        value: case1,
      },
      sync: false,
      attachTo: 'body',
    });
    const input = wrapper.find('input');
    expect(input.element.value).toBe(case1);
  });
});
