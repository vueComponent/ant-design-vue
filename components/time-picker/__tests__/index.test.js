import { mount } from '@vue/test-utils';
import TimePicker from '..';
import dayjs from 'dayjs';
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
          return (
            <TimePicker
              open={true}
              addon={() => (
                <button class="my-btn" type="button">
                  Ok
                </button>
              )}
            />
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await sleep();
    expect(document.getElementsByClassName('my-btn').length).toBeTruthy();
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [ant-design-vue: TimePicker] `addon` is deprecated. Please use `v-slot:renderExtraFooter` instead.',
    );
  });

  it('not render clean icon when allowClear is false', () => {
    const wrapper = mount({
      render() {
        return <TimePicker defaultValue={dayjs('2000-01-01 00:00:00')} allowClear={false} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
