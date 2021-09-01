import Button from '../index';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { asyncExpect, sleep } from '../../../tests/utils';
import mountTest from '../../../tests/shared/mountTest';
import { resetWarned } from '../../_util/warning';

describe('Button', () => {
  mountTest(Button);
  mountTest(Button.Group);
  it('renders correctly', () => {
    const wrapper = mount({
      render() {
        return <Button>Follow</Button>;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create primary button', () => {
    const wrapper = mount({
      render() {
        return <Button type="primary">按钮</Button>;
      },
    });
    expect(wrapper.find('.ant-btn-primary').exists()).toBe(true);
  });

  it('renders Chinese characters correctly', done => {
    const wrapper = mount({
      render() {
        return <Button>按钮</Button>;
      },
    });
    expect(wrapper.text()).toBe('按 钮');

    const wrapper1 = mount({
      render() {
        return (
          <Button>
            {/* <SearchOutlined v-slot:icon /> */}
            按钮
          </Button>
        );
      },
    });

    expect(wrapper1.html()).toMatchSnapshot();

    const wrapper2 = mount({
      render() {
        return (
          <Button>
            <SearchOutlined />
            按钮
          </Button>
        );
      },
    });
    expect(wrapper2.html()).toMatchSnapshot();
    // should not insert space when there is icon
    const wrapper3 = mount({
      render() {
        return (
          <Button>
            {/* <SearchOutlined slot="icon" /> */}
            按钮
          </Button>
        );
      },
    });
    expect(wrapper3.html()).toMatchSnapshot();
    // should not insert space when there is icon while loading
    const wrapper4 = mount({
      render() {
        return (
          <Button loading>
            {/* <SearchOutlined slot="icon" /> */}
            按钮
          </Button>
        );
      },
    });
    expect(wrapper4.html()).toMatchSnapshot();
    // should insert space while loading
    const wrapper5 = mount({
      render() {
        return <Button loading>按钮</Button>;
      },
    });
    expect(wrapper5.html()).toMatchSnapshot();
    const wrapper6 = mount({
      render() {
        return (
          <Button>
            <span>按钮</span>
          </Button>
        );
      },
    });
    nextTick(() => {
      // expect(wrapper6.find('.ant-btn-two-chinese-chars').exists()).toBe(true);
      expect(wrapper6.html()).toMatchSnapshot();
      done();
    });
  });
  it('should change loading state instantly by default', async () => {
    const DefaultButton = {
      data() {
        return {
          loading: false,
        };
      },
      methods: {
        enterLoading() {
          this.loading = true;
        },
      },

      render() {
        return (
          <Button loading={this.loading} onClick={this.enterLoading}>
            Button
          </Button>
        );
      },
    };
    const wrapper = mount(DefaultButton, { sync: false });
    await asyncExpect(() => {
      wrapper.trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-btn-loading').length).toBe(1);
    });
  });

  it('should change loading state with delay', async () => {
    const DefaultButton = {
      data() {
        return {
          loading: false,
        };
      },
      methods: {
        enterLoading() {
          this.loading = { delay: 1000 };
        },
      },

      render() {
        return (
          <Button loading={this.loading} onClick={this.enterLoading}>
            Button
          </Button>
        );
      },
    };
    const wrapper = mount(DefaultButton, { sync: false });
    await asyncExpect(() => {
      wrapper.trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-btn-loading').exists()).toBe(false);
    });
  });
  it('should not clickable when button is loading', () => {
    const onClick = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <Button loading onClick={onClick}>
            button
          </Button>
        );
      },
    });
    wrapper.trigger('click');
    expect(onClick).not.toHaveBeenCalledWith();
  });
  it('should support link button', () => {
    const wrapper = mount({
      render() {
        return (
          <Button target="_blank" href="http://ant.design">
            link button
          </Button>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('fixbug renders {0} , 0 and {false}', () => {
    const wrapper = mount({
      render() {
        return <Button>{0}</Button>;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();

    const wrapper1 = mount({
      render() {
        return <Button>0</Button>;
      },
    });
    expect(wrapper1.html()).toMatchSnapshot();

    const wrapper2 = mount({
      render() {
        return <Button>{false}</Button>;
      },
    });
    expect(wrapper2.html()).toMatchSnapshot();
  });

  it('should not render as link button when href is undefined', async () => {
    const wrapper = mount({
      render() {
        return (
          <Button type="primary" href={undefined}>
            button
          </Button>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should support to change loading', async () => {
    const wrapper = mount(Button);
    wrapper.setProps({ loading: true });
    await sleep();
    expect(wrapper.findAll('.ant-btn-loading').length).toBe(1);
    wrapper.setProps({ loading: false });
    await sleep();
    expect(wrapper.findAll('.ant-btn-loading').length).toBe(0);
    wrapper.setProps({ loading: { delay: 50 } });
    await sleep();
    expect(wrapper.findAll('.ant-btn-loading').length).toBe(0);
    await sleep(50);
    expect(wrapper.findAll('.ant-btn-loading').length).toBe(1);
    wrapper.setProps({ loading: false });
    await sleep(50);
    expect(wrapper.findAll('.ant-btn-loading').length).toBe(0);
    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  it('should warning when pass type=link and ghost=true', () => {
    resetWarned();
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return <Button type="link" ghost />;
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(
      "Warning: [ant-design-vue: Button] `link` or `text` button can't be a `ghost` button.",
    );
    warnSpy.mockRestore();
  });

  it('should warning when pass type=text and ghost=true', () => {
    resetWarned();
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return <Button type="text" ghost />;
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(
      "Warning: [ant-design-vue: Button] `link` or `text` button can't be a `ghost` button.",
    );
    warnSpy.mockRestore();
  });

  it('should not redirect when button is disabled', async () => {
    const onClick = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <Button href="https://ant.design" onClick={onClick} disabled>
            click me
          </Button>
        );
      },
    });
    await asyncExpect(() => {
      wrapper.trigger('click');
    });
    await asyncExpect(() => {
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
