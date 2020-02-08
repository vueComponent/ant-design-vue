import { mount } from '@vue/test-utils';
import BackTop from '..';
import { sleep } from '../../../tests/utils';

describe('BackTop', () => {
  it('should scroll to top after click it', async () => {
    const wrapper = mount(BackTop, {
      propsData: {
        visibilityHeight: -1,
      },
    });
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      window.scrollY = y;
      window.pageYOffset = y;
    });
    window.scrollTo(0, 400);
    // trigger scroll manually
    wrapper.vm.handleScroll();
    await sleep();
    wrapper.find('.ant-back-top').trigger('click');
    await sleep(500);
    expect(window.pageYOffset).toBe(0);
    scrollToSpy.mockRestore();
  });
  it('support onClick', async () => {
    const onClick = jest.fn();
    const wrapper = mount(BackTop, {
      propsData: {
        visibilityHeight: -1,
      },
      listeners: {
        click: onClick,
      },
    });
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      window.scrollY = y;
      window.pageYOffset = y;
    });
    window.scrollTo(0, 400);
    // trigger scroll manually
    wrapper.vm.handleScroll();
    await sleep();
    wrapper.find('.ant-back-top').trigger('click');
    expect(onClick).toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });
});
