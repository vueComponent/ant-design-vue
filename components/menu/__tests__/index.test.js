import { mount } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';
import Menu from '..';
import { InboxOutlined, PieChartOutlined } from '@ant-design/icons-vue';
import mountTest from '../../../tests/shared/mountTest';

const { SubMenu } = Menu;
function $$(className) {
  return document.body.querySelectorAll(className);
}
describe('Menu', () => {
  window.requestAnimationFrame = callback => window.setTimeout(callback, 16);
  window.cancelAnimationFrame = window.clearTimeout;
  mountTest({
    render() {
      return (
        <div>
          <Menu>
            <Menu.Item />
            <Menu.ItemGroup />
            <Menu.SubMenu />
          </Menu>
        </div>
      );
    },
  });
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
            <Menu selectedKeys={['1-3-2']} mode="vertical">
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
      { attachTo: 'body', sync: false },
    );
    await asyncExpect(() => {
      expect($$('li.ant-menu-submenu-selected').length).toBe(1);
    });
  });
  it('should accept openKeys in mode horizontal', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Menu openKeys={['1']} mode="horizontal">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachTo: 'body', sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.exists('.ant-menu-sub')).toBe(true);
    });
  });

  it('should accept openKeys in mode inline', async () => {
    mount(
      {
        render() {
          return (
            <Menu openKeys={['1']} mode="inline">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachTo: 'body', sync: false },
    );
    await asyncExpect(() => {
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    });
  });

  // it('should accept openKeys in mode vertical', async () => {
  //   mount(
  //     {
  //       render() {
  //         return (
  //           <Menu openKeys={['1']} mode="vertical">
  //             <SubMenu key="1" title="submenu1">
  //               <Menu.Item key="submenu1">Option 1</Menu.Item>
  //               <Menu.Item key="submenu2">Option 2</Menu.Item>
  //             </SubMenu>
  //             <Menu.Item key="2">menu2</Menu.Item>
  //           </Menu>
  //         );
  //       },
  //     },
  //     { attachTo: 'body', sync: false },
  //   );
  //   await asyncExpect(() => {
  //     expect($$('.ant-menu-submenu-popup')[0].style.display).not.toBe('none');
  //   }, 100);
  // });

  it('horizontal', async () => {
    mount(
      {
        props: {
          openKeys: {
            type: Array,
            default() {
              return ['1'];
            },
          },
        },
        render() {
          return (
            <Menu openKeys={this.openKeys} mode="horizontal">
              <SubMenu key="1" title="submenu1">
                <Menu.Item key="submenu1">Option 1</Menu.Item>
                <Menu.Item key="submenu2">Option 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="2">menu2</Menu.Item>
            </Menu>
          );
        },
      },
      { attachTo: 'body', sync: false },
    );
    await sleep(100);
    expect($$('.ant-menu-submenu-popup')[0].style.display).not.toBe('none');
  });

  // it('inline', async () => {
  //   const openKeys = ref(['1']);
  //   // eslint-disable-next-line no-unused-vars
  //   const wrapper = mount(
  //     {
  //       setup() {
  //         return () => {
  //           return (
  //             <Menu openKeys={openKeys.value} mode="inline">
  //               <SubMenu key="1" title="submenu1">
  //                 <Menu.Item key="submenu1">Option 1</Menu.Item>
  //                 <Menu.Item key="submenu2">Option 2</Menu.Item>
  //               </SubMenu>
  //               <Menu.Item key="2">menu2</Menu.Item>
  //             </Menu>
  //           );
  //         };
  //       },
  //     },
  //     { attachTo: 'body', sync: false },
  //   );
  //   await asyncExpect(() => {
  //     expect($$('.ant-menu-sub')[0].style.display).not.toBe('none');
  //   }, 0);
  //   openKeys.value = [];
  //   await asyncExpect(() => {
  //     expect($$('.ant-menu-sub')[0].style.display).toBe('none');
  //   }, 100);
  //   openKeys.value = ['1'];
  //   await asyncExpect(() => {
  //     expect($$('.ant-menu-sub')[0].style.display).not.toBe('none');
  //   }, 100);
  // });

  it('vertical', async () => {
    const wrapper = mount(
      {
        props: {
          openKeys: {
            type: Array,
            default() {
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
      { attachTo: 'body', sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-submenu-popup')[0].style.display).not.toBe('none');
    }, 100);
    wrapper.setProps({ openKeys: [] });
    await asyncExpect(() => {
      expect($$('.ant-menu-submenu-popup')[0].style.display).toBe('none');
    }, 500);
    wrapper.setProps({ openKeys: ['1'] });
    await asyncExpect(() => {
      expect($$('.ant-menu-submenu-popup')[0].style.display).not.toBe('none');
    }, 100);
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
      { attachTo: 'body', sync: false },
    );
    wrapper.vm.$forceUpdate();
    // just expect no error emit
  });

  xit('should always follow openKeys when mode is switched', async () => {
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
      { attachTo: 'body', sync: false },
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
            <Menu ref="menu" openKeys={['1']} mode="inline" inlineCollapsed={this.inlineCollapsed}>
              <Menu.Item key="menu1">
                <InboxOutlined />
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
      { attachTo: 'body', sync: false },
    );
    await asyncExpect(() => {
      expect($$('ul.ant-menu-sub')[0].className).toContain('ant-menu-inline');
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    }, 0);
    wrapper.setProps({ inlineCollapsed: true });
    await asyncExpect(() => {
      // 动画完成后的回调
      wrapper.vm.$refs.menu.switchModeFromInline = false;
      wrapper.vm.$forceUpdate();
    });
    // await asyncExpect(() => {
    //   wrapper.trigger('transitionend', { propertyName: 'width' });
    // });
    // await asyncExpect(() => {
    //   expect(wrapper.findAll('ul.ant-menu-root')[0].classes()).toContain('ant-menu-vertical');
    //   expect(wrapper.findAll('ul.ant-menu-sub').length).toBe(0);
    // }, 500);
    wrapper.setProps({ inlineCollapsed: false });
    await asyncExpect(() => {
      expect($$('ul.ant-menu-sub')[0].className).toContain('ant-menu-inline');
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    }, 0);
  });

  xit('inlineCollapsed should works well when specify a not existed default openKeys', async () => {
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
              openKeys={['not-existed']}
              mode="inline"
              inlineCollapsed={this.inlineCollapsed}
            >
              <Menu.Item key="menu1">
                <InboxOutlined />
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
      { attachTo: 'body', sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-menu-sub').length).toBe(1);
    });
    wrapper.setProps({ inlineCollapsed: true });
    // await asyncExpect(() => {
    //   // 动画完成后的回调
    //   wrapper.vm.$refs.menu.switchModeFromInline = false;
    //   wrapper.vm.$forceUpdate();
    // });
    // await asyncExpect(() => {
    //   wrapper.trigger('transitionend', { propertyName: 'width' });
    // });
    await asyncExpect(() => {
      $$('.ant-menu-submenu-title')[0].dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-menu-submenu')[0].classes()).toContain(
        'ant-menu-submenu-vertical',
      );
      expect(wrapper.findAll('.ant-menu-submenu')[0].classes()).toContain('ant-menu-submenu-open');
      expect($$('ul.ant-menu-sub')[0].className).toContain('ant-menu-vertical');
      expect($$('ul.ant-menu-sub')[0].style.display).not.toBe('none');
    }, 500);
  });

  // describe('open submenu when click submenu title', () => {
  //   beforeEach(() => {
  //     document.body.innerHTML = '';
  //   });

  const toggleMenu = (wrapper, index, event) => {
    $$('.ant-menu-submenu-title')[index].dispatchEvent(new MouseEvent(event));
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
      { attachTo: 'body', sync: false },
    );
    await asyncExpect(() => {
      expect($$('.ant-menu-sub').length).toBe(1);
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

  //   it('vertical', async () => {
  //     const wrapper = mount(
  //       {
  //         render() {
  //           return (
  //             <Menu mode="vertical">
  //               <SubMenu key="1" title="submenu1">
  //                 <Menu.Item key="submenu1">Option 1</Menu.Item>
  //                 <Menu.Item key="submenu2">Option 2</Menu.Item>
  //               </SubMenu>
  //               <Menu.Item key="2">menu2</Menu.Item>
  //             </Menu>
  //           );
  //         },
  //       },
  //       { attachTo: 'body', sync: false },
  //     );
  //     await asyncExpect(() => {
  //       expect($$('.ant-menu-sub').length).toBe(0);
  //       toggleMenu(wrapper, 0, 'mouseenter');
  //     }, 0);
  //     await asyncExpect(() => {
  //       expect($$('.ant-menu-sub').length).toBe(1);
  //       expect($$('.ant-menu-submenu-popup')[0].style.display).not.toBe('none');
  //       toggleMenu(wrapper, 0, 'mouseleave');
  //     }, 500);
  //     await asyncExpect(() => {
  //       expect($$('.ant-menu-submenu-popup')[0].style.display).toBe('none');
  //     }, 500);
  //   });

  //   it('horizontal', async () => {
  //     const wrapper = mount(
  //       {
  //         render() {
  //           return (
  //             <Menu mode="horizontal">
  //               <SubMenu key="1" title="submenu1">
  //                 <Menu.Item key="submenu1">Option 1</Menu.Item>
  //                 <Menu.Item key="submenu2">Option 2</Menu.Item>
  //               </SubMenu>
  //               <Menu.Item key="2">menu2</Menu.Item>
  //             </Menu>
  //           );
  //         },
  //       },
  //       { attachTo: 'body', sync: false },
  //     );
  //     await asyncExpect(() => {
  //       expect($$('.ant-menu-sub').length).toBe(0);
  //       toggleMenu(wrapper, 1, 'mouseenter');
  //     }, 100);
  //     await asyncExpect(() => {
  //       expect($$('.ant-menu-sub').length).toBe(1);
  //       expect($$('.ant-menu-submenu-popup')[0].style.display).not.toBe('none');
  //       toggleMenu(wrapper, 1, 'mouseleave');
  //     }, 500);
  //     await asyncExpect(() => {
  //       expect($$('.ant-menu-submenu-popup')[0].style.display).toBe('none');
  //     }, 500);
  //   });
  // });

  it('inline title', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Menu mode="inline" inlineCollapsed>
              <Menu.Item key="1" title="bamboo lucky">
                <PieChartOutlined />
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
      { sync: false, attachTo: 'body' },
    );

    wrapper.find('.ant-menu-item').trigger('mouseenter');
    await asyncExpect(() => {
      const text = $$('.ant-tooltip-inner')[0].textContent;
      expect(text).toBe('bamboo lucky');
    }, 500);
  });
});
