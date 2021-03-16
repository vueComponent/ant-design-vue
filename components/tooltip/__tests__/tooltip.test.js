import { asyncExpect } from '@/tests/utils';
import { mount } from '@vue/test-utils';
import Tooltip from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Tooltip', () => {
  mountTest(Tooltip);
  it('check `onVisibleChange` arguments', async () => {
    const onVisibleChange = jest.fn();
    const wrapper = mount(
      {
        props: ['title', 'visible'],
        render() {
          const props = {
            title: this.title || '',
            mouseEnterDelay: 0,
            mouseLeaveDelay: 0,
            onVisibleChange,
            // TODO test/util 的bug 没有使用 v-model 同样会改变
            'onUpdate:visible': () => {
              props.visible = this.visible;
              this.$forceUpdate();
            },
          };
          if (this.visible !== undefined) {
            props.visible = this.visible;
          }
          return (
            <Tooltip ref="tooltip" {...props}>
              <div id="hello">Hello world!</div>
            </Tooltip>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );

    let div = null;
    let lastCount = null;
    await asyncExpect(() => {
      // `title` is empty.
      div = wrapper.findAll('#hello')[0].element;
      div.dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onVisibleChange).not.toHaveBeenCalled();
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false);
    });
    await asyncExpect(() => {
      div.dispatchEvent(new MouseEvent('mouseleave'));
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
      wrapper.findAll('#hello')[0].element.dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onVisibleChange).toHaveBeenLastCalledWith(true);
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(true);
    }, 0);
    await asyncExpect(() => {
      wrapper.findAll('#hello')[0].element.dispatchEvent(new MouseEvent('mouseleave'));
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
      wrapper.findAll('#hello')[0].element.dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onVisibleChange).toHaveBeenLastCalledWith(true);
      lastCount = onVisibleChange.mock.calls.length;
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false);
    });
    await asyncExpect(() => {
      // always trigger onVisibleChange
      wrapper.findAll('#hello')[0].element.dispatchEvent(new MouseEvent('mouseleave'));
    });
    await asyncExpect(() => {
      expect(onVisibleChange.mock.calls.length).toBe(lastCount); // no change with lastCount
      expect(wrapper.vm.$refs.tooltip.$refs.tooltip.visible).toBe(false);
    });
  });
});
