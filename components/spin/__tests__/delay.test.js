import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Spin from '..';

describe('delay spinning', () => {
  it("should render with delay when it's mounted with spinning=true and delay", async () => {
    const props = {
      props: {
        delay: 500,
        spinning: true,
      },
      sync: false,
    };
    const wrapper = mount(Spin, props);
    await asyncExpect(() => {
      expect(wrapper.find('.ant-spin').classes().includes('ant-spin-spinning')).toEqual(false);
    });
  });

  it('should render when delay is init set', async () => {
    const props = {
      props: {
        delay: 100,
        spinning: true,
      },
      sync: false,
    };
    const wrapper = mount(Spin, props);

    expect(wrapper.findAll('.ant-spin')[0].classes().includes('ant-spin-spinning')).toEqual(false);

    // use await not jest.runAllTimers()
    // because of https://github.com/facebook/jest/issues/3465
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(wrapper.findAll('.ant-spin')[0].classes().includes('ant-spin-spinning')).toEqual(true);
  });

  it('should cancel debounce function when unmount', async () => {
    const props = {
      props: {
        delay: 100,
        spinning: true,
      },
      sync: false,
    };
    const wrapper = mount(Spin, props);
    const spy = jest.spyOn(wrapper.vm.updateSpinning, 'cancel');
    expect(wrapper.vm.updateSpinning.cancel).toEqual(expect.any(Function));
    expect(spy).not.toHaveBeenCalled();
  });
});
