import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Layout from '..';

const { Sider, Content } = Layout;

describe('Layout', () => {
  it('detect the sider as children', done => {
    const wrapper = mount({
      render() {
        return (
          <Layout>
            <Sider>Sider</Sider>
            <Content>Content</Content>
          </Layout>
        );
      },
    });
    Vue.nextTick(() => {
      expect(wrapper.find('.ant-layout').classes()).toContain('ant-layout-has-sider');
      done();
    });
  });

  it('detect the sider inside the children', done => {
    const wrapper = mount({
      render() {
        return (
          <Layout>
            <div>
              <Sider>Sider</Sider>
            </div>
            <Content>Content</Content>
          </Layout>
        );
      },
    });
    Vue.nextTick(() => {
      expect(wrapper.find('.ant-layout').classes()).toContain('ant-layout-has-sider');
      done();
    });
  });

  it('detect ant-layout-sider-has-trigger class in sider when ant-layout-sider-trigger div tag exists', done => {
    const wrapper = mount({
      render() {
        return (
          <Layout>
            <div>
              <Sider collapsible>Sider</Sider>
            </div>
            <Content>Content</Content>
          </Layout>
        );
      },
    });
    Vue.nextTick(() => {
      expect(wrapper.find('.ant-layout-sider').classes()).toContain('ant-layout-sider-has-trigger');
      done();
    });
  });
});
