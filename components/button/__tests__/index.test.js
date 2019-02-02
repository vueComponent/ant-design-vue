import Button from '../index';
import Icon from '../../icon';
import { mount } from '@vue/test-utils';
import Vue from 'vue';
import { asyncExpect } from '@/tests/utils';

describe('Button', () => {
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
    expect(wrapper.contains('.ant-btn-primary')).toBe(true);
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
        return <Button icon="search">按钮</Button>;
      },
    });

    expect(wrapper1.html()).toMatchSnapshot();

    const wrapper2 = mount({
      render() {
        return (
          <Button>
            <Icon type="search" />
            按钮
          </Button>
        );
      },
    });
    expect(wrapper2.html()).toMatchSnapshot();
    // should not insert space when there is icon
    const wrapper3 = mount({
      render() {
        return <Button icon="search">按钮</Button>;
      },
    });
    expect(wrapper3.html()).toMatchSnapshot();
    // should not insert space when there is icon while loading
    const wrapper4 = mount({
      render() {
        return (
          <Button icon="search" loading>
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
    Vue.nextTick(() => {
      expect(wrapper6.find('.ant-btn').contains('.ant-btn-two-chinese-chars')).toBe(true);
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
      expect(wrapper.contains('.ant-btn-loading')).toBe(false);
    });
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
});
