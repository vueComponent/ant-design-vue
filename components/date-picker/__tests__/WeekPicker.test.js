import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import DatePicker from '..';
import focusTest from '../../../tests/shared/focusTest';

const { WeekPicker } = DatePicker;

describe('WeekPicker', () => {
  focusTest(WeekPicker);

  it('should support style prop', async () => {
    const wrapper = mount(
      {
        render() {
          return <WeekPicker style={{ width: '400px' }} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
