import { mount } from '@vue/test-utils';
import TimePicker from '..';
import moment from 'moment';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
import { sleep } from '../../../tests/utils';

describe('TimePicker', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  focusTest(TimePicker);
  mountTest(TimePicker);

  it('renders addon correctly', async () => {
    mount(
      {
        render() {
          return <TimePicker open addon={() => <button type="button">Ok</button>} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await sleep();
    expect(document.body.querySelector('.ant-time-picker-panel-addon').outerHTML).toMatchSnapshot();
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
