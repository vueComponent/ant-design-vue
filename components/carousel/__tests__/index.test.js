import { mount } from '@vue/test-utils';
import { h, createVNode } from 'vue';
import { asyncExpect, sleep } from '../../../tests/utils';
import Carousel from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Carousel', () => {
  mountTest(Carousel);
  // beforeEach(() => {
  //   jest.useFakeTimers();
  // });

  // afterEach(() => {
  //   jest.useRealTimers();
  // });
  it('should has innerSlider', () => {
    const props = {
      slots: {
        default: () => h('div'),
      },
      sync: false,
    };
    const wrapper = mount(Carousel, props);
    const { innerSlider, slick } = wrapper.vm;
    const innerSliderFromRefs = slick.innerSlider;
    expect(innerSlider).toBe(innerSliderFromRefs);
    expect(typeof innerSlider.slickNext).toBe('function');
  });

  it('should has prev, next and go function', async () => {
    const props = {
      slots: {
        default: () => [
          createVNode('div', null, '1'),
          createVNode('div', null, '2'),
          createVNode('div', null, '3'),
        ],
      },
      sync: false,
    };
    const wrapper = mount(Carousel, props);
    const { prev, next, goTo } = wrapper.vm;
    expect(typeof prev).toBe('function');
    expect(typeof next).toBe('function');
    expect(typeof goTo).toBe('function');
    const slick = wrapper.vm.slick;

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
  // TODO
  // it('should trigger autoPlay after window resize', async () => {
  //   const props = {
  //     props: {
  //       autoplay: true,
  //     },
  //     slots: {
  //       default: () => [
  //         createVNode('div', null, '1'),
  //         createVNode('div', null, '2'),
  //         createVNode('div', null, '3'),
  //       ],
  //     },
  //     sync: false,
  //   };
  //   const wrapper = mount(Carousel, props);

  //   const spy = jest.spyOn(wrapper.vm.slick.innerSlider, 'handleAutoPlay');
  //   window.resizeTo(1000);
  //   expect(spy).not.toHaveBeenCalled();
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   expect(spy).toHaveBeenCalled();
  // });

  it('cancel resize listener when unmount', async () => {
    const props = {
      props: {
        autoplay: true,
      },
      slots: {
        default: () => [
          createVNode('div', null, '1'),
          createVNode('div', null, '2'),
          createVNode('div', null, '3'),
        ],
      },
      sync: false,
    };
    const wrapper = mount(Carousel, props);
    const { onWindowResized } = wrapper.vm;
    const spy = jest.spyOn(wrapper.vm.onWindowResized, 'cancel');
    const spy2 = jest.spyOn(window, 'removeEventListener');
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith('resize', onWindowResized);
  });

  describe('should works for dotPosition', () => {
    ['left', 'right', 'top', 'bottom'].forEach(dotPosition => {
      it(dotPosition, async () => {
        const wrapper = mount(
          {
            render() {
              return (
                <Carousel dotPosition={dotPosition}>
                  <div />
                </Carousel>
              );
            },
          },
          { sync: false, attachTo: 'body' },
        );
        await sleep(100);
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });

  it('warning', () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return (
          <Carousel vertical>
            <div />
          </Carousel>
        );
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(
      'Warning: [antdv: Carousel] `vertical` is deprecated, please use `dotPosition` instead.',
    );
    warnSpy.mockRestore();
  });
});
