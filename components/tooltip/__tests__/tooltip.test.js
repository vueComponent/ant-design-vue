import { asyncExpect } from '@/tests/utils';
import { mount } from '@vue/test-utils';
import Tooltip from '..';

describe('Tooltip', () => {
  it('check `onVisibleChange` arguments', async () => {
    const onVisibleChange = jest.fn();
    const wrapper = mount(
      {
        props: ['title', 'visible'],
        render() {
          const props = {
            props: {
              title: this.title || '',
              mouseEnterDelay: 0,
              mouseLeaveDelay: 0,
            },
            on: {
              visibleChange: onVisibleChange,
            },
          };
          if (this.visible !== undefined) {
            props.props.visible = this.visible;
          }
          return (
            <Tooltip ref="tooltip" {...props}>
              <div id="hello">Hello world!</div>
            </Tooltip>
          );
        },
      },
      { sync: false },
    );

    let div = null;
    let lastCount = null;
    await asyncExpect(() => {
      // `title` is empty.
      div = wrapper.findAll('#hello').at(0);
      div.trigger('mouseenter');
    });
    await asyncExpect(() => {
      expect(onVisibleChange).not.toHaveBeenCalled();
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false);
    });
    await asyncExpect(() => {
      div.trigger('mouseleave');
    });
    await asyncExpect(() => {
      expect(onVisibleChange).not.toHaveBeenCalled();
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false);
    });
    await asyncExpect(() => {
      // update `title` value.
      wrapper.setProps({ title: 'Have a nice day!' });
    });
    await asyncExpect(() => {
      wrapper
        .findAll('#hello')
        .at(0)
        .trigger('mouseenter');
    });
    await asyncExpect(() => {
      expect(onVisibleChange).toHaveBeenLastCalledWith(true);
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(true);
    }, 0);
    await asyncExpect(() => {
      wrapper.find('#hello').trigger('mouseleave');
    });
    await asyncExpect(() => {
      expect(onVisibleChange).toHaveBeenLastCalledWith(false);
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false);
    });
    await asyncExpect(() => {
      // add `visible` props.
      wrapper.setProps({ visible: false });
    });
    await asyncExpect(() => {
      wrapper.find('#hello').trigger('mouseenter');
    });
    await asyncExpect(() => {
      expect(onVisibleChange).toHaveBeenLastCalledWith(true);
      lastCount = onVisibleChange.mock.calls.length;
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false);
    });
    await asyncExpect(() => {
      // always trigger onVisibleChange
      wrapper.trigger('mouseleave');
    });
    await asyncExpect(() => {
      expect(onVisibleChange.mock.calls.length).toBe(lastCount); // no change with lastCount
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false);
    });
    await asyncExpect(() => {});
  });

  // it('should hide when mouse leave native disabled button', () => {
  //   const onVisibleChange = jest.fn()
  //   const wrapper = mount(
  //     <Tooltip
  //       title='xxxxx'
  //       mouseEnterDelay={0}
  //       mouseLeaveDelay={0}
  //       onVisibleChange={onVisibleChange}
  //     >
  //       <button disabled>Hello world!</button>
  //     </Tooltip>
  //   )

  //   expect(wrapper.find('span')).toHaveLength(1)
  //   const button = wrapper.find('span').at(0)
  //   button.dispatchEvent(new MouseEvent('mouseenter'))
  //   expect(onVisibleChange).toBeCalledWith(true)
  //   expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(true)

  //   button.trigger('mouseleave')
  //   expect(onVisibleChange).toBeCalledWith(false)
  //   expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false)
  // })

  // it('should hide when mouse leave antd disabled Button', () => {
  //   const onVisibleChange = jest.fn()
  //   const wrapper = mount(
  //     <Tooltip
  //       title='xxxxx'
  //       mouseEnterDelay={0}
  //       mouseLeaveDelay={0}
  //       onVisibleChange={onVisibleChange}
  //     >
  //       <Button disabled>Hello world!</Button>
  //     </Tooltip>
  //   )

  //   expect(wrapper.render()).toMatchSnapshot()
  //   const button = wrapper.find('span').at(0)
  //   button.dispatchEvent(new MouseEvent('mouseenter'))
  //   expect(onVisibleChange).toBeCalledWith(true)
  //   expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(true)

  //   button.trigger('mouseleave')
  //   expect(onVisibleChange).toBeCalledWith(false)
  //   expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false)
  // })

  // it('should render disabled Button style properly', () => {
  //   const wrapper1 = mount(
  //     <Tooltip title='xxxxx'>
  //       <Button disabled>Hello world!</Button>
  //     </Tooltip>
  //   )
  //   const wrapper2 = mount(
  //     <Tooltip title='xxxxx'>
  //       <Button disabled style={{ display: 'block' }}>Hello world!</Button>
  //     </Tooltip>
  //   )
  //   expect(wrapper1.find('span').at(0).element.style.display).toBe('inline-block')
  //   expect(wrapper2.find('span').at(0).element.style.display).toBe('block')
  // })

  // it('should works for arrowPointAtCenter', () => {
  //   const arrowWidth = 5
  //   const horizontalArrowShift = 16
  //   const triggerWidth = 200

  //   const suit = () => {
  //     const wrapper = mount(
  //       <Tooltip
  //         title='xxxxx'
  //         trigger='click'
  //         mouseEnterDelay={0}
  //         mouseLeaveDelay={0}
  //         placement='bottomLeft'
  //       >
  //         <button style={{ width: triggerWidth }}>
  //           Hello world!
  //         </button>
  //       </Tooltip>
  //     )
  //     wrapper.find('button').at(0).trigger('click')
  //     const popupLeftDefault = parseInt(wrapper.instance().getPopupDomNode().style.left, 10)

  //     const wrapper2 = mount(
  //       <Tooltip
  //         title='xxxxx'
  //         trigger='click'
  //         mouseEnterDelay={0}
  //         mouseLeaveDelay={0}
  //         placement='bottomLeft'
  //         arrowPointAtCenter
  //       >
  //         <button style={{ width: triggerWidth }}>
  //           Hello world!
  //         </button>
  //       </Tooltip>
  //     )
  //     wrapper2.find('button').at(0).trigger('click')
  //     const popupLeftArrowPointAtCenter = parseInt(wrapper2.instance().getPopupDomNode().style.left, 10)
  //     expect(popupLeftArrowPointAtCenter - popupLeftDefault).toBe((triggerWidth / 2) - horizontalArrowShift - arrowWidth)
  //   }
  //   jest.dontMock('rc-trigger', suit)
  // })
});
