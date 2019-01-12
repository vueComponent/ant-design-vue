import { mount } from '@vue/test-utils';
import BackTop from '..';

describe('BackTop', () => {
  it('should scroll to top after click it', async () => {
    const wrapper = mount(BackTop, {
      propsData: {
        visibilityHeight: -1,
      },
    });
    document.documentElement.scrollTop = 400;
    // trigger scroll manually
    wrapper.vm.handleScroll();
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.find('.ant-back-top').trigger('click');
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(Math.abs(Math.round(document.documentElement.scrollTop))).toBe(0);
  });
});
