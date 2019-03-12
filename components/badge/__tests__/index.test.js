import { mount } from '@vue/test-utils';
import { render } from '@vue/server-test-utils';
import Badge from '../index';

import { asyncExpect } from '@/tests/utils';
describe('Badge', () => {
  it('badge dot not scaling count > 9', () => {
    const badge = mount({
      render() {
        return <Badge count={10} dot />;
      },
    });
    expect(badge.findAll('.ant-card-multiple-words').length).toBe(0);
  });
  it('badge should support float number', () => {
    let wrapper = render({
      render() {
        return <Badge count={3.5} />;
      },
    });
    expect(wrapper.text()).toMatchSnapshot();
    wrapper = mount({
      render() {
        return <Badge count={3.5} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('badge dot not showing count == 0', () => {
    const badge = mount({
      render() {
        return <Badge count={0} dot />;
      },
    });
    expect(badge.findAll('.ant-badge-dot').length).toBe(0);
  });

  it('should have an overriden title attribute', () => {
    const badge = mount({
      render() {
        return <Badge count={10} title="Custom title" />;
      },
    });
    expect(badge.find('.ant-scroll-number').element.attributes.getNamedItem('title').value).toEqual(
      'Custom title',
    );
  });

  // https://github.com/ant-design/ant-design/issues/10626
  // it('should be composable with Tooltip', async () => {
  //   const wrapper = mount({
  //     render () {
  //       return <Tooltip ref='tooltip' title='Fix the error'>
  //         <Badge status='error' />
  //       </Tooltip>
  //     },
  //   }, { sync: false })
  //   await asyncExpect(() => {
  //     wrapper.find({ name: 'ABadge' }).trigger('mouseenter')
  //   }, 0)

  //   expect(wrapper.vm.$refs.tooltip.sVisible).toBe(true)
  // })

  it('should render when count is changed', async () => {
    const wrapper = mount(Badge, {
      propsData: {
        count: 9,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.setProps({ count: 10 });
    }, 100);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.setProps({ count: 11 });
    }, 100);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.setProps({ count: 11 });
    }, 100);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.setProps({ count: 10 });
    }, 100);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.setProps({ count: 9 });
    }, 100);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    }, 100);
  });

  it('should be compatible with borderColor style', () => {
    const wrapper = mount({
      render() {
        return (
          <Badge
            count={4}
            style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }}
          />
        );
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/13694
  it('should support offset when count is a ReactNode', () => {
    const wrapper = mount({
      render() {
        return (
          <Badge count={<span class="custom" style={{ color: '#f5222d' }} />} offset={[10, 20]}>
            <a href="#" class="head-example" />
          </Badge>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
