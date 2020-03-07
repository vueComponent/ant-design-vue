import { mount } from '@vue/test-utils';
import VcTimePicker from '../../vc-time-picker/TimePicker';
import TimePicker from '..';
import moment from 'moment';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';

describe('TimePicker', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  focusTest(TimePicker);
  mountTest(TimePicker);

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

  it('allowEmpty deprecated', () => {
    mount({
      render() {
        return <TimePicker allowEmpty />;
      },
    });
    expect(errorSpy).toBeCalledWith(
      'Warning: [antdv: TimePicker] `allowEmpty` is deprecated. Please use `allowClear` instead.',
    );
  });
  it('not render clean icon when allowClear is false', () => {
    const wrapper = mount({
      render() {
        return <TimePicker defaultValue={moment('2000-01-01 00:00:00')} allowClear={false} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
