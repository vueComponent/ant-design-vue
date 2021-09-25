import { mount } from '@vue/test-utils';
import DatePicker from '..';
import focusTest from '../../../tests/shared/focusTest';

const { QuarterPicker } = DatePicker;

describe('QuarterPicker', () => {
  focusTest(QuarterPicker);
  fit('reset select item when popup close', async () => {
    const wrapper = mount(DatePicker, {
      props: { style: { width: '400px' }, picker: 'quarter' },
      sync: false,
      attachTo: 'body',
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
