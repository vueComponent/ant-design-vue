import { mount } from '@vue/test-utils';
import VcTimePicker from '../../vc-time-picker/TimePicker';
import TimePicker from '..';
import focusTest from '../../../tests/shared/focusTest';

describe('TimePicker', () => {
  focusTest(TimePicker);

  it('renders addon correctly', () => {
    const wrapper = mount({
      render() {
        return <TimePicker addon={() => <button type="button">Ok</button>} />;
      },
    });
    const vcTimePicker = wrapper.find({ name: VcTimePicker.name });
    const addonWrapper = mount({
      render() {
        return vcTimePicker.vm.addon();
      },
    });
    expect(addonWrapper.html()).toMatchSnapshot();
  });
});
