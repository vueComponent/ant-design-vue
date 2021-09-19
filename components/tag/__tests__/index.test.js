import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Tag from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Tag', () => {
  mountTest(Tag);
  mountTest(Tag.CheckableTag);
  it('should be closable', async () => {
    const onClose = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <Tag closable onClose={onClose} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-close').length).toBe(1);
      expect(
        wrapper.findAll('.ant-tag').filter(w => w.element.classList.contains('ant-tag-hidden'))
          .length,
      ).toBe(0);
      wrapper.find('.anticon-close').trigger('click');
      expect(onClose).toBeCalled();
    });
    await asyncExpect(() => {
      expect(
        wrapper.findAll('.ant-tag').filter(w => w.element.classList.contains('ant-tag-hidden'))
          .length,
      ).toBe(1);
    });
  });

  it('should not be closed when prevent default', async () => {
    const onClose = e => {
      e.preventDefault();
    };
    const wrapper = mount(
      {
        render() {
          return <Tag closable onClose={onClose} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-close').length).toBe(1);
      expect(
        wrapper.findAll('.ant-tag').filter(w => w.element.classList.contains('ant-tag-hidden'))
          .length,
      ).toBe(0);
      wrapper.find('.anticon-close').trigger('click');
    });
    // await asyncExpect(() => {
    //   expect(
    //     wrapper.findAll('.ant-tag').filter(w => {
    //       const style = window.getComputedStyle(w.element, null);
    //       return style.display !== 'none';
    //     }).length,
    //   ).toBe(1);
    // });
  });
  describe('visibility', () => {
    it('can be controlled by visible with visible as initial value', async () => {
      const wrapper = mount(Tag, { props: { visible: true }, sync: false });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.setProps({ visible: false });
      });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.setProps({ visible: true });
      });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    it('can be controlled by visible with hidden as initial value', async () => {
      const wrapper = mount(Tag, { props: { visible: false }, sync: false });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.setProps({ visible: true });
      });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.setProps({ visible: false });
      });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });
});
