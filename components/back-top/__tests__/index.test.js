import { mount } from '@vue/test-utils';
import BackTop from '..';
import { sleep } from '../../../tests/utils';

describe('BackTop', () => {
  it('should scroll to top after click it', async () => {
    const wrapper = mount(BackTop, {
      props: {
        visibilityHeight: -1,
      },
      attachTo: 'body',
    });
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      window.scrollY = y;
      window.pageYOffset = y;
      document.documentElement.scrollTop = y;
    });
    window.scrollTo(0, 400);
    expect(document.documentElement.scrollTop).toBe(400);
    await sleep(100);
    wrapper.find('.ant-back-top').trigger('click');
    await sleep(500);
    expect(document.documentElement.scrollTop).toBe(0);
    scrollToSpy.mockRestore();
  });
  it('support onClick', async () => {
    const onClick = jest.fn();
    const wrapper = mount(BackTop, {
      props: {
        visibilityHeight: -1,
        onClick,
      },
      attachTo: 'body',
    });
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      window.scrollY = y;
      window.pageYOffset = y;
    });
    document.dispatchEvent(new Event('scroll'));
    window.scrollTo(0, 400);
    await sleep(10);
    wrapper.find('.ant-back-top').trigger('click');
    expect(onClick).toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });
});
