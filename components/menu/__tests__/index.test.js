import { mount } from '@vue/test-utils'
import { asyncExpect } from '@/tests/utils'
import Menu from '..'
import Icon from '../../icon'

const { SubMenu } = Menu
function $$ (className) {
  return document.body.querySelectorAll(className)
}
describe('Menu', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    // jest.useFakeTimers()
  })

  // afterEach(() => {
  //   jest.useRealTimers()
  // })

  it('should accept defaultOpenKeys in mode horizontal', async () => {
    const wrapper = mount({
      render () {
        return (
          <Menu defaultOpenKeys={['1']} mode='horizontal'>
            <SubMenu key='1' title='submenu1'>
              <Menu.Item key='submenu1'>Option 1</Menu.Item>
              <Menu.Item key='submenu2'>Option 2</Menu.Item>
            </SubMenu>
            <Menu.Item key='2'>menu2</Menu.Item>
          </Menu>
        )
      },
    }, { attachToDocument: true, sync: false })
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].className).not.toContain('ant-menu-hidden')
    })
  })

  it('should accept defaultOpenKeys in mode inline', async () => {
    const wrapper = mount({
      render () {
        return (
          <Menu defaultOpenKeys={['1']} mode='inline'>
            <SubMenu key='1' title='submenu1'>
              <Menu.Item key='submenu1'>Option 1</Menu.Item>
              <Menu.Item key='submenu2'>Option 2</Menu.Item>
            </SubMenu>
            <Menu.Item key='2'>menu2</Menu.Item>
          </Menu>
        )
      },
    }, { attachToDocument: true, sync: false })
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].className).not.toContain('ant-menu-hidden')
    })
  })

  it('should accept defaultOpenKeys in mode vertical', async () => {
    const wrapper = mount({
      render () {
        return (
          <Menu defaultOpenKeys={['1']} mode='vertical'>
            <SubMenu key='1' title='submenu1'>
              <Menu.Item key='submenu1'>Option 1</Menu.Item>
              <Menu.Item key='submenu2'>Option 2</Menu.Item>
            </SubMenu>
            <Menu.Item key='2'>menu2</Menu.Item>
          </Menu>
        )
      },
    }, { attachToDocument: true, sync: false })
    await asyncExpect(() => {
      expect($$('.ant-menu-sub')[0].className).not.toContain('ant-menu-hidden')
    })
  })

  // it('horizontal', () => {
  //   const wrapper = mount({
  //     render () {
  //       return (
  //         <Menu openKeys={['1']} mode='horizontal' openTransitionName=''>
  //           <SubMenu key='1' title='submenu1'>
  //             <Menu.Item key='submenu1'>Option 1</Menu.Item>
  //             <Menu.Item key='submenu2'>Option 2</Menu.Item>
  //           </SubMenu>
  //           <Menu.Item key='2'>menu2</Menu.Item>
  //         </Menu>
  //       )
  //     },
  //   })
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  //   wrapper.setProps({ openKeys: [] })
  //   wrapper.update()
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).toBe(true)
  //   wrapper.setProps({ openKeys: ['1'] })
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  // })

  // it('inline', () => {
  //   const wrapper = mount({
  //     render () {
  //       return (
  //         <Menu openKeys={['1']} mode='inline' openAnimation=''>
  //           <SubMenu key='1' title='submenu1'>
  //             <Menu.Item key='submenu1'>Option 1</Menu.Item>
  //             <Menu.Item key='submenu2'>Option 2</Menu.Item>
  //           </SubMenu>
  //           <Menu.Item key='2'>menu2</Menu.Item>
  //         </Menu>
  //       )
  //     },
  //   })
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  //   wrapper.setProps({ openKeys: [] })
  //   wrapper.update()
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).toBe(true)
  //   wrapper.setProps({ openKeys: ['1'] })
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  // })

  // it('vertical', () => {
  //   const wrapper = mount({
  //     render () {
  //       return (
  //         <Menu openKeys={['1']} mode='vertical' openTransitionName=''>
  //           <SubMenu key='1' title='submenu1'>
  //             <Menu.Item key='submenu1'>Option 1</Menu.Item>
  //             <Menu.Item key='submenu2'>Option 2</Menu.Item>
  //           </SubMenu>
  //           <Menu.Item key='2'>menu2</Menu.Item>
  //         </Menu>
  //       )
  //     },
  //   })
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  //   wrapper.setProps({ openKeys: [] })
  //   wrapper.update()
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).toBe(true)
  //   wrapper.setProps({ openKeys: ['1'] })
  //   expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  // })

  // // https://github.com/ant-design/ant-design/pulls/4677
  // // https://github.com/ant-design/ant-design/issues/4692
  // // TypeError: Cannot read property 'indexOf' of undefined
  // it('pr #4677 and issue #4692', () => {
  //   const wrapper = mount({
  //     render () {
  //       return (
  //         <Menu mode='horizontal'>
  //           <SubMenu title='submenu'>
  //             <Menu.Item key='1'>menu1</Menu.Item>
  //             <Menu.Item key='2'>menu2</Menu.Item>
  //           </SubMenu>
  //         </Menu>
  //       )
  //     },
  //   })
  //   wrapper.update()
  //   // just expect no error emit
  // })

  // it('should always follow openKeys when mode is switched', () => {
  //   const wrapper = mount({
  //     render () {
  //       return (
  //         <Menu openKeys={['1']} mode='inline'>
  //           <SubMenu key='1' title='submenu1'>
  //             <Menu.Item key='submenu1'>Option 1</Menu.Item>
  //             <Menu.Item key='submenu2'>Option 2</Menu.Item>
  //           </SubMenu>
  //           <Menu.Item key='2'>menu2</Menu.Item>
  //         </Menu>
  //       )
  //     },
  //   })
  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  //   wrapper.setProps({ mode: 'vertical' })
  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  //   wrapper.setProps({ mode: 'inline' })
  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  // })

  // it('should always follow openKeys when mode is switched', () => {
  //   const wrapper = mount({
  //     render () {
  //       return (
  //         <Menu defaultOpenKeys={['1']} mode='inline'>
  //           <Menu.Item key='menu1'>
  //             <Icon type='inbox' />
  //             <span>Option</span>
  //           </Menu.Item>
  //           <SubMenu key='1' title='submenu1'>
  //             <Menu.Item key='submenu1'>
  //           Option
  //             </Menu.Item>
  //             <Menu.Item key='submenu2'>
  //           Option
  //             </Menu.Item>
  //           </SubMenu>
  //         </Menu>
  //       )
  //     },
  //   })

  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-inline')).toBe(true)
  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-hidden')).toBe(false)

  //   wrapper.setProps({ inlineCollapsed: true })
  //   // 动画结束后套样式;
  //   jest.runAllTimers()
  //   wrapper.update()

  //   expect(wrapper.find('.ant-menu').at(0).hasClass('ant-menu-vertical')).toBe(true)
  //   expect(wrapper.find('.ant-menu-sub').length).toBe(0)

  //   wrapper.setProps({ inlineCollapsed: false })
  //   jest.runAllTimers()
  //   wrapper.update()

  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-inline')).toBe(true)
  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-hidden')).toBe(false)
  // })

  // it('inlineCollapsed should works well when specify a not existed default openKeys', () => {
  //   const wrapper = mount({
  //     render () {
  //       return (
  //         <Menu defaultOpenKeys={['not-existed']} mode='inline'>
  //           <Menu.Item key='menu1'>
  //             <Icon type='inbox' />
  //             <span>Option</span>
  //           </Menu.Item>
  //           <SubMenu key='1' title='submenu1'>
  //             <Menu.Item key='submenu1'>
  //           Option
  //             </Menu.Item>
  //             <Menu.Item key='submenu2'>
  //           Option
  //             </Menu.Item>
  //           </SubMenu>
  //         </Menu>
  //       )
  //     },
  //   })
  //   expect(wrapper.find('.ant-menu-sub').length).toBe(0)
  //   wrapper.setProps({ inlineCollapsed: true })
  //   jest.runAllTimers()
  //   wrapper.update()
  //   wrapper.find('.ant-menu-submenu-title').at(0).simulate('mouseEnter')
  //   jest.runAllTimers()
  //   wrapper.update()
  //   expect(wrapper.find('.ant-menu-submenu').at(0).hasClass('ant-menu-submenu-vertical')).toBe(true)
  //   expect(wrapper.find('.ant-menu-submenu').at(0).hasClass('ant-menu-submenu-open')).toBe(true)
  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-vertical')).toBe(true)
  //   expect(wrapper.find('.ant-menu-sub').at(0).hasClass('ant-menu-hidden')).toBe(false)
  // })

  // describe('open submenu when click submenu title', () => {
  //   beforeEach(() => {
  //     jest.useFakeTimers()
  //   })

  //   afterEach(() => {
  //     jest.useRealTimers()
  //   })

  //   const toggleMenu = (wrapper, index, event) => {
  //     wrapper.find('.ant-menu-submenu-title').at(index).simulate(event)
  //     jest.runAllTimers()
  //     wrapper.update()
  //   }

  //   it('inline', () => {
  //     const wrapper = mount({
  //       render () {
  //         return (
  //           <Menu mode='inline'>
  //             <SubMenu key='1' title='submenu1'>
  //               <Menu.Item key='submenu1'>Option 1</Menu.Item>
  //               <Menu.Item key='submenu2'>Option 2</Menu.Item>
  //             </SubMenu>
  //             <Menu.Item key='2'>menu2</Menu.Item>
  //           </Menu>
  //         )
  //       },
  //     })
  //     expect(wrapper.find('.ant-menu-sub').length).toBe(0)
  //     toggleMenu(wrapper, 0, 'click')
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().length).toBe(1)
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  //     toggleMenu(wrapper, 0, 'click')
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).toBe(true)
  //   })

  //   it('vertical', () => {
  //     const wrapper = mount({
  //       render () {
  //         return (
  //           <Menu mode='vertical'>
  //             <SubMenu key='1' title='submenu1'>
  //               <Menu.Item key='submenu1'>Option 1</Menu.Item>
  //               <Menu.Item key='submenu2'>Option 2</Menu.Item>
  //             </SubMenu>
  //             <Menu.Item key='2'>menu2</Menu.Item>
  //           </Menu>
  //         )
  //       },
  //     })
  //     expect(wrapper.find('.ant-menu-sub').length).toBe(0)
  //     toggleMenu(wrapper, 0, 'mouseenter')
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().length).toBe(1)
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  //     toggleMenu(wrapper, 0, 'mouseleave')
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).toBe(true)
  //   })

  //   it('horizontal', () => {
  //     jest.useFakeTimers()
  //     const wrapper = mount({
  //       render () {
  //         return (
  //           <Menu mode='horizontal'>
  //             <SubMenu key='1' title='submenu1'>
  //               <Menu.Item key='submenu1'>Option 1</Menu.Item>
  //               <Menu.Item key='submenu2'>Option 2</Menu.Item>
  //             </SubMenu>
  //             <Menu.Item key='2'>menu2</Menu.Item>
  //           </Menu>
  //         )
  //       },
  //     })
  //     expect(wrapper.find('.ant-menu-sub').length).toBe(0)
  //     toggleMenu(wrapper, 0, 'mouseenter')
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().length).toBe(1)
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).not.toBe(true)
  //     toggleMenu(wrapper, 0, 'mouseleave')
  //     expect(wrapper.find('.ant-menu-sub').hostNodes().at(0).hasClass('ant-menu-hidden')).toBe(true)
  //   })
  // })
})
