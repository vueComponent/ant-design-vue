import { asyncExpect } from '../../../tests/utils';
import { mount } from '@vue/test-utils';
import Tooltip from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Tooltip', () => {
  mountTest(Tooltip);
  it('check `onOpenChange` arguments', async () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(
      {
        props: ['title', 'open'],
        render() {
          const props = {
            title: this.title || '',
            mouseEnterDelay: 0,
            mouseLeaveDelay: 0,
            onOpenChange,
          };
          if (this.open !== undefined) {
            props.open = this.open;
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
      div = document.getElementById('hello');
      div.dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
    await asyncExpect(() => {
      div.dispatchEvent(new MouseEvent('mouseleave'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
    await asyncExpect(() => {
      // update `title` value.
      wrapper.setProps({ title: 'Have a nice day!' });
    });
    await asyncExpect(() => {
      document.getElementById('hello').dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      expect(wrapper.vm.$refs.tooltip.open).toBe(true);
    }, 0);
    await asyncExpect(() => {
      document.getElementById('hello').dispatchEvent(new MouseEvent('mouseleave'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
    await asyncExpect(() => {
      // add `open` props.
      wrapper.setProps({ open: false });
    });
    await asyncExpect(() => {
      document.getElementById('hello').dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
    await asyncExpect(() => {
      // always trigger onOpenChange
      document.getElementById('hello').dispatchEvent(new MouseEvent('mouseleave'));
      lastCount = onOpenChange.mock.calls.length;
    });
    await asyncExpect(() => {
      expect(onOpenChange.mock.calls.length).toBe(lastCount); // no change with lastCount
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
  });
});
