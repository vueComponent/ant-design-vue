import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Radio from '../Radio';
import focusTest from '../../../tests/shared/focusTest';

describe('Radio', () => {
  focusTest(Radio);

  it('should render correctly', () => {
    const wrapper = mount({
      render() {
        return <Radio class="customized">Test</Radio>;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('responses hover events', async () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = mount(
      {
        render() {
          return <Radio onMouseenter={onMouseEnter} onMouseleave={onMouseLeave} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      wrapper.find('label').trigger('mouseenter');
    });
    await asyncExpect(() => {
      expect(onMouseEnter).toHaveBeenCalled();
    });
    wrapper.find('label').trigger('mouseleave');
    await asyncExpect(() => {
      expect(onMouseLeave).toHaveBeenCalled();
    });
  });
});
