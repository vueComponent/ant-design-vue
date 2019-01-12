import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Menu from '..';
import Icon from '../../icon';

jest.mock('mutationobserver-shim', () => {
  global.MutationObserver = function MutationObserver() {
    this.observe = () => {};
    this.disconnect = () => {};
  };
});

const { SubMenu } = Menu;
function $$(className) {
  return document.body.querySelectorAll(className);
}
describe('Menu', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // jest.useFakeTimers()
  });

  afterEach(() => {
    // jest.useRealTimers()
  });
  it('If has select nested submenu item ,the menu items on the grandfather level should be highlight', async () => {
    mount(
      {
        render() {
          return (
            <Menu defaultSelectedKeys={['1-3-2']} mode="vertical">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="1-1">Option 1</Menu.Item>
                <Menu.Item key="1-2">Option 2</Menu.Item>
                <SubMenu key="1-3" title="submenu1-3">
                  <Menu.Item key="1-3-1">Option 3</Menu.Item>
                  <Menu.Item key="1-3-2">Option 4</Menu.Item>
                </SubMenu>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-submenu-selected').length).toBe(1);
    });
  });
  it('should accept defaultOpenKeys in mode horizontal', async () => {
    mount(
      {
        render() {
          return (
            <Menu defaultOpenKeys={['1']} mode="horizontal">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
    });
  });

  it('should accept defaultOpenKeys in mode inline', async () => {
    mount(
      {
        render() {
          return (
            <Menu defaultOpenKeys={['1']} mode="inline">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
    });
  });

  it('should accept defaultOpenKeys in mode vertical', async () => {
    mount(
      {
        render() {
          return (
            <Menu defaultOpenKeys={['1']} mode="vertical">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
    });
  });

  it('horizontal', async () => {
    const wrapper = mount(
      {
        props: {
          openKeys: {
            type: Array,
            default: function() {
              return ['1'];
            },
          },
        },
        render() {
          return (
            <Menu openKeys={this.openKeys} mode="horizontal" openTransitionName="">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
    });
    wrapper.setProps({ openKeys: [] });
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).toBe('none');
    }, 0);

    wrapper.setProps({ openKeys: ['1'] });
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
    }, 0);
  });

  it('inline', async () => {
    const wrapper = mount(
      {
        props: {
          openKeys: {
            type: Array,
            default: function() {
              return ['1'];
            },
          },
        },
        render() {
          return (
            <Menu openKeys={this.openKeys} mode="inline" openAnimation="">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].style.display).not.toBe('none');
    });
    wrapper.setProps({ openKeys: [] });
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].style.display).toBe('none');
    }, 0);
    wrapper.setProps({ openKeys: ['1'] });
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].style.display).not.toBe('none');
    }, 0);
  });

  it('vertical', async () => {
    const wrapper = mount(
      {
        props: {
          openKeys: {
            type: Array,
            default: function() {
              return ['1'];
            },
          },
        },
        render() {
          return (
            <Menu openKeys={this.openKeys} mode="vertical" openTransitionName="">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
    });
    wrapper.setProps({ openKeys: [] });
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).toBe('none');
    }, 0);
    wrapper.setProps({ openKeys: ['1'] });
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
    }, 0);
  });

  // https://github.com/ant-design/ant-design/pulls/4677
  // https://github.com/ant-design/ant-design/issues/4692
  // TypeError: Cannot read property 'indexOf' of undefined
  it('pr #4677 and issue #4692', () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Menu mode="horizontal">
              <SubMenu title="submenu">
                <Menu.Item key="1">menu1</Menu.Item>
                <Menu.Item key="2">menu2</Menu.Item>
              </SubMenu>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    wrapper.vm.$forceUpdate();
    // just expect no error emit
  });

  it('should always follow openKeys when mode is switched', async () => {
    const wrapper = mount(
      {
        props: {
          mode: {
            type: String,
            default: 'inline',
          },
        },
        render() {
          return (
            <Menu openKeys={['1']} mode={this.mode}>
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    });
    wrapper.setProps({ mode: 'vertical' });
    await asyncExpect(() => {
      expect($$('ul.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
    }, 0);
    wrapper.setProps({ mode: 'inline' });
    await asyncExpect(() => {
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    }, 0);
  });

  it('should always follow openKeys when inlineCollapsed is switched', async () => {
    const wrapper = mount(
      {
        props: {
          inlineCollapsed: {
            type: Boolean,
            default: false,
          },
        },
        render() {
          return (
            <Menu
              ref="menu"
              defaultOpenKeys={['1']}
              mode="inline"
              inlineCollapsed={this.inlineCollapsed}
            >
              <Menu.Item key="menu1">
                <Icon type="inbox" />
                <span>Option</span>
              </Menu.Item>
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option</Menu.Item>
                <Menu.Item key="submenu2">Option</Menu.Item>
              </SubMenu>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect(
        wrapper
          .findAll('ul.ant-menu-sub')
          .at(0)
          .classes(),
      ).toContain('ant-menu-inline');
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    }, 0);
    wrapper.setProps({ inlineCollapsed: true });
    await asyncExpect(() => {
      // 动画完成后的回调
      wrapper.vm.$refs.menu.switchModeFromInline = false;
      wrapper.vm.$forceUpdate();
    });
    await asyncExpect(() => {
      wrapper.trigger('transitionend', { propertyName: 'width' });
    });
    await asyncExpect(() => {
      expect(
        wrapper
          .findAll('ul.ant-menu-root')
          .at(0)
          .classes(),
      ).toContain('ant-menu-vertical');
      expect(wrapper.findAll('ul.ant-menu-sub').length).toBe(0);
    }, 0);
    wrapper.setProps({ inlineCollapsed: false });
    await asyncExpect(() => {
      expect(
        wrapper
          .findAll('ul.ant-menu-sub')
          .at(0)
          .classes(),
      ).toContain('ant-menu-inline');
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    }, 0);
  });

  it('inlineCollapsed should works well when specify a not existed default openKeys', async () => {
    const wrapper = mount(
      {
        props: {
          inlineCollapsed: {
            type: Boolean,
            default: false,
          },
        },
        render() {
          return (
            <Menu
              ref="menu"
              defaultOpenKeys={['not-existed']}
              mode="inline"
              inlineCollapsed={this.inlineCollapsed}
            >
              <Menu.Item key="menu1">
                <Icon type="inbox" />
                <span>Option</span>
              </Menu.Item>
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option</Menu.Item>
                <Menu.Item key="submenu2">Option</Menu.Item>
              </SubMenu>
            </Menu>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-menu-sub').length).toBe(0);
    });
    wrapper.setProps({ inlineCollapsed: true });
    await asyncExpect(() => {
      // 动画完成后的回调
      wrapper.vm.$refs.menu.switchModeFromInline = false;
      wrapper.vm.$forceUpdate();
    });
    await asyncExpect(() => {
      wrapper.trigger('transitionend', { propertyName: 'width' });
    });
    await asyncExpect(() => {
      wrapper
        .findAll('.ant-menu-submenu-title')
        .at(0)
        .trigger('mouseenter');
    });
    await asyncExpect(() => {
      expect(
        wrapper
          .findAll('.ant-menu-submenu')
          .at(0)
          .classes(),
      ).toContain('ant-menu-submenu-vertical');
      expect(
        wrapper
          .findAll('.ant-menu-submenu')
          .at(0)
          .classes(),
      ).toContain('ant-menu-submenu-open');
      expect($$('ul.ant-menu-sub')[0].className).toContain('ant-menu-vertical');
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    }, 300);
  });

  describe('open submenu when click submenu title', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    const toggleMenu = (wrapper, index, event) => {
      wrapper
        .findAll('.ant-menu-submenu-title')
        .at(index)
        .trigger(event);
    };

    it('inline', async () => {
      const wrapper = mount(
        {
          render() {
            return (
              <Menu mode="inline">
                <SubMenu key="1" title="submenu1">
                  <Menu.Item key="submenu1">Option 1</Menu.Item>
                  <Menu.Item key="submenu2">Option 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="2">menu2</Menu.Item>
              </Menu>
            );
          },
        },
        { attachToDocument: true, sync: false },
      );
      await asyncExpect(() => {
        expect($$('.ant-menu-sub').length).toBe(0);
        toggleMenu(wrapper, 0, 'click');
      }, 0);
      await asyncExpect(() => {
        expect($$('.ant-menu-sub').length).toBe(1);
        expect($$('.ant-menu-sub')[0].style.display).not.toBe('none');
        toggleMenu(wrapper, 0, 'click');
      }, 500);
      await asyncExpect(() => {
        expect($$('.ant-menu-sub')[0].style.display).toBe('none');
      }, 500);
    });

    it('vertical', async () => {
      const wrapper = mount(
        {
          render() {
            return (
              <Menu mode="vertical">
                <SubMenu key="1" title="submenu1">
                  <Menu.Item key="submenu1">Option 1</Menu.Item>
                  <Menu.Item key="submenu2">Option 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="2">menu2</Menu.Item>
              </Menu>
            );
          },
        },
        { attachToDocument: true, sync: false },
      );
      await asyncExpect(() => {
        expect($$('.ant-menu-sub').length).toBe(0);
        toggleMenu(wrapper, 0, 'mouseenter');
      }, 0);
      await asyncExpect(() => {
        expect($$('.ant-menu-sub').length).toBe(1);
        expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
        toggleMenu(wrapper, 0, 'mouseleave');
      }, 500);
      await asyncExpect(() => {
        expect($$('.ant-menu-sub')[0].parentElement.style.display).toBe('none');
      }, 500);
    });

    it('horizontal', async () => {
      const wrapper = mount(
        {
          render() {
            return (
              <Menu mode="horizontal">
                <SubMenu key="1" title="submenu1">
                  <Menu.Item key="submenu1">Option 1</Menu.Item>
                  <Menu.Item key="submenu2">Option 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="2">menu2</Menu.Item>
              </Menu>
            );
          },
        },
        { attachToDocument: true, sync: false },
      );
      await asyncExpect(() => {
        expect($$('.ant-menu-sub').length).toBe(0);
        toggleMenu(wrapper, 1, 'mouseenter');
      }, 0);
      await asyncExpect(() => {
        expect($$('.ant-menu-sub').length).toBe(1);
        expect($$('.ant-menu-sub')[0].parentElement.style.display).not.toBe('none');
        toggleMenu(wrapper, 1, 'mouseleave');
      }, 500);
      await asyncExpect(() => {
        expect($$('.ant-menu-sub')[0].parentElement.style.display).toBe('none');
      }, 500);
    });
  });

  it('inline title', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Menu mode="inline" inlineCollapsed>
              <Menu.Item key="1" title="bamboo lucky">
                <Icon type="pie-chart" />
                <span>
                  Option 1
                  <img
                    style={{ width: 20 }}
                    alt="test"
                    src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                  />
                </span>
              </Menu.Item>
            </Menu>
          );
        },
      },
      { sync: false, attachToDocument: true },
    );

    wrapper.find('.ant-menu-item').trigger('mouseenter');
    await asyncExpect(() => {
      const text = $$('.ant-tooltip-inner')[0].textContent;
      expect(text).toBe('bamboo lucky');
    }, 500);
  });
});
