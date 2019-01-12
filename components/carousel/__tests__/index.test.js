import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Carousel from '..';

describe('Carousel', () => {
  it('should has innerSlider', () => {
    const props = {
      slots: {
        default: '<div />',
      },
      sync: true,
    };
    const wrapper = mount(Carousel, props);
    const { innerSlider, $refs } = wrapper.vm;
    const innerSliderFromRefs = $refs.slick.innerSlider;
    expect(innerSlider).toBe(innerSliderFromRefs);
    expect(typeof innerSlider.slickNext).toBe('function');
  });

  it('should has prev, next and go function', async () => {
    const props = {
      slots: {
        default: '<div>1</div><div>2</div><div>3</div>',
      },
      sync: true,
    };
    const wrapper = mount(Carousel, props);
    const { prev, next, goTo } = wrapper.vm;
    expect(typeof prev).toBe('function');
    expect(typeof next).toBe('function');
    expect(typeof goTo).toBe('function');
    const slick = wrapper.vm.$refs.slick;

    expect(slick.innerSlider.currentSlide).toBe(0);
    wrapper.vm.goTo(2);
    await asyncExpect(() => {
      expect(slick.innerSlider.currentSlide).toBe(2);
    }, 1000);
    prev();
    await asyncExpect(() => {
      expect(slick.innerSlider.currentSlide).toBe(1);
    }, 1000);

    next();

    await asyncExpect(() => {
      expect(slick.innerSlider.currentSlide).toBe(2);
    }, 1000);
  });

  it('should trigger autoPlay after window resize', async () => {
    const props = {
      propsData: {
        autoplay: true,
      },
      slots: {
        default: '<div>1</div><div>2</div><div>3</div>',
      },
      sync: true,
    };
    const wrapper = mount(Carousel, props);
    const spy = jest.spyOn(wrapper.vm.$refs.slick.innerSlider, 'handleAutoPlay');
    window.resizeTo(1000);
    expect(spy).not.toBeCalled();
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(spy).toBeCalled();
  });

  it('cancel resize listener when unmount', async () => {
    const props = {
      propsData: {
        autoplay: true,
      },
      slots: {
        default: '<div>1</div><div>2</div><div>3</div>',
      },
      sync: true,
    };
    const wrapper = mount(Carousel, props);
    const { onWindowResized } = wrapper.vm;
    const spy = jest.spyOn(wrapper.vm.onWindowResized, 'cancel');
    const spy2 = jest.spyOn(window, 'removeEventListener');
    wrapper.destroy();
    expect(spy).toBeCalled();
    expect(spy2).toBeCalledWith('resize', onWindowResized);
  });
});
