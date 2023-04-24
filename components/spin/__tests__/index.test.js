import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Spin from '..';

describe('Spin', () => {
  it('should only affect the spin element when set style to a nested <Spin>xx</Spin>', () => {
    const wrapper = mount({
      render() {
        return (
          <Spin style={{ background: 'red' }}>
            <div>content</div>
          </Spin>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    // expect(wrapper.findAll('.ant-spin-nested-loading').at(0).prop('style')).toBe(null)
    // expect(wrapper.findAll('.ant-spin').at(0).prop('style').background).toBe('red')
  });

  it("should render custom indicator when it's set", () => {
    // const customIndicator = <div className='custom-indicator' />
    const wrapper = mount({
      render() {
        return <Spin indicator={<div class="custom-indicator" />}></Spin>;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should be controlled by spinning', async () => {
    const props = {
      props: {
        spinning: false,
      },
      sync: false,
    };
    const wrapper = mount(Spin, props);
    await asyncExpect(() => {
      expect(wrapper.vm.spinning).toBe(false);
      wrapper.setProps({ spinning: true });
    });
    await asyncExpect(() => {
      expect(wrapper.vm.spinning).toBe(true);
    });
  });
});
