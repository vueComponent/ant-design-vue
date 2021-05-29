import { mount } from '@vue/test-utils';
import Breadcrumb from '../index';

describe('Breadcrumb', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  // // https://github.com/airbnb/enzyme/issues/875
  it('warns on non-Breadcrumb.Item and non-Breadcrumb.Separator children', () => {
    mount({
      render() {
        return (
          <Breadcrumb>
            <div>foo</div>
          </Breadcrumb>
        );
      },
    });
    expect(errorSpy.mock.calls).toHaveLength(1);
    expect(errorSpy.mock.calls[0][0]).toMatch(
      "Warning: [antdv: Breadcrumb] Only accepts Breadcrumb.Item and Breadcrumb.Separator as it's children",
    );
  });

  // https:// github.com/ant-design/ant-design/issues/5015
  it('should allow Breadcrumb.Item is null or undefined', () => {
    const wrapper = mount({
      render() {
        return (
          <Breadcrumb>
            {null}
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {undefined}
          </Breadcrumb>
        );
      },
    });
    expect(errorSpy).not.toHaveBeenCalled();
    expect(wrapper.html()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/5542
  it('should not display Breadcrumb Item when its children is falsy', () => {
    const wrapper = mount({
      render() {
        return (
          <Breadcrumb>
            <Breadcrumb.Item />
            <Breadcrumb.Item>xxx</Breadcrumb.Item>
            <Breadcrumb.Item>yyy</Breadcrumb.Item>
          </Breadcrumb>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should render a menu', () => {
    const routes = [
      {
        path: 'index',
        breadcrumbName: 'home',
      },
      {
        path: 'first',
        breadcrumbName: 'first',
        children: [
          {
            path: '/general',
            breadcrumbName: 'General',
          },
          {
            path: '/layout',
            breadcrumbName: 'Layout',
          },
          {
            path: '/navigation',
            breadcrumbName: 'Navigation',
          },
        ],
      },
      {
        path: 'second',
        breadcrumbName: 'second',
      },
    ];
    const wrapper = mount(Breadcrumb, { props: { routes } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should support custom attribute', () => {
    const wrapper = mount({
      render() {
        return (
          <Breadcrumb data-custom="custom">
            <Breadcrumb.Item data-custom="custom-item">xxx</Breadcrumb.Item>
            <Breadcrumb.Item>yyy</Breadcrumb.Item>
          </Breadcrumb>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/25975
  it('should support Breadcrumb.Item default separator', () => {
    const MockComponent = () => (
      <span>
        <Breadcrumb.Item>Mock Node</Breadcrumb.Item>
      </span>
    );
    const wrapper = mount({
      render() {
        return (
          <Breadcrumb>
            <Breadcrumb.Item>Location</Breadcrumb.Item>
            <MockComponent />
            <Breadcrumb.Item>Application Center</Breadcrumb.Item>
          </Breadcrumb>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
