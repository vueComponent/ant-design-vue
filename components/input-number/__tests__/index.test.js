import { mount } from '@vue/test-utils';
import InputNumber from '..';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';

describe('InputNumber', () => {
  focusTest(InputNumber);
  mountTest(InputNumber);

  // https://github.com/ant-design/ant-design/issues/13896
  it('should return null when blur a empty input number', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <InputNumber defaultValue="1" onChange={onChange} />;
        },
      },
      {
        sync: false,
      },
    );
    wrapper.find('input').element.value = '';
    wrapper.find('input').trigger('input');
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
