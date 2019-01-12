import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Slider from '..';

describe('Slider', () => {
  it('should show tooltip when hovering slider handler', async () => {
    const wrapper = mount(Slider, {
      propsData: {
        defaultValue: 30,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper
        .findAll('.ant-slider-handle')
        .at(0)
        .trigger('mouseenter');
    });
    let dropdownWrapper = null;
    await asyncExpect(() => {
      dropdownWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      expect(dropdownWrapper.html()).toMatchSnapshot();
      wrapper
        .findAll('.ant-slider-handle')
        .at(0)
        .trigger('mouseleave');
    });
    await asyncExpect(() => {
      dropdownWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      expect(dropdownWrapper.html()).toMatchSnapshot();
    });
  });
});
