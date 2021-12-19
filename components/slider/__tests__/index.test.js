import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Slider from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Slider', () => {
  mountTest(Slider);
  it('should show tooltip when hovering slider handler', async () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
      },
      sync: false,
      attachTo: 'body',
    });
    await asyncExpect(() => {
      wrapper.findAll('.ant-slider-handle')[0].trigger('mouseenter');
    }, 1000);
    await asyncExpect(() => {
      expect(document.body.innerHTML).toMatchSnapshot();
      wrapper.findAll('.ant-slider-handle')[0].trigger('mouseleave');
    }, 1000);
    await asyncExpect(() => {
      expect(document.body.innerHTML).toMatchSnapshot();
    }, 1000);
  });
});
