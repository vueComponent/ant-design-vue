import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Select from '..';
import Icon from '../../icon';
import focusTest from '../../../tests/shared/focusTest';

describe('Select', () => {
  focusTest(Select);

  it('should have default notFoundContent', async () => {
    const wrapper = mount(Select, {
      propsData: {
        mode: 'multiple',
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
    });
    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );

    await asyncExpect(() => {
      expect(dropdownWrapper.findAll({ name: 'MenuItem' }).length).toBe(1);
      expect(
        dropdownWrapper
          .findAll({ name: 'MenuItem' })
          .at(0)
          .text(),
      ).toBe('No Data');
    });
  });

  it('should support set notFoundContent to null', async () => {
    const wrapper = mount(Select, {
      propsData: {
        mode: 'multiple',
        notFoundContent: null,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
    });
    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(dropdownWrapper.findAll({ name: 'MenuItem' }).length).toBe(0);
    });
  });

  it('should not have default notFoundContent when mode is combobox', async () => {
    const wrapper = mount(Select, {
      propsData: {
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
    });

    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(dropdownWrapper.findAll('MenuItem').length).toBe(0);
    });
  });

  it('should not have notFoundContent when mode is combobox and notFoundContent is set', async () => {
    const wrapper = mount(Select, {
      propsData: {
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
        notFoundContent: 'not at all',
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
    });

    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(dropdownWrapper.findAll({ name: 'MenuItem' }).length).toBe(1);
      expect(
        dropdownWrapper
          .findAll({ name: 'MenuItem' })
          .at(0)
          .text(),
      ).toBe('not at all');
    });
  });

  it('should be controlled by open prop', async () => {
    const onDropdownVisibleChange = jest.fn();
    const wrapper = mount(
      {
        props: {
          open: {
            type: Boolean,
            default: true,
          },
        },
        render() {
          return (
            <Select open={this.open} onDropdownVisibleChange={onDropdownVisibleChange}>
              <Option value="1">1</Option>
            </Select>
          );
        },
      },
      { sync: false },
    );
    let triggerComponent = null;
    mount(
      {
        render() {
          triggerComponent = wrapper.find({ name: 'Trigger' }).vm.getComponent();
          return triggerComponent;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      // console.log(triggerComponent.componentInstance.visible)
      expect(triggerComponent.componentInstance.visible).toBe(true);
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
      expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(false);
    });
    await asyncExpect(() => {
      expect(triggerComponent.componentInstance.visible).toBe(true);
      wrapper.setProps({ open: false });
    });
    await asyncExpect(() => {
      mount(
        {
          render() {
            triggerComponent = wrapper.find({ name: 'Trigger' }).vm.getComponent();
            return triggerComponent;
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      expect(triggerComponent.componentInstance.visible).toBe(false);
      wrapper.find('.ant-select').trigger('click');
      expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(true);
      expect(triggerComponent.componentInstance.visible).toBe(false);
    });
  });

  describe('Select Custom Icons', () => {
    it('should support customized icons', () => {
      const wrapper = mount({
        render() {
          return (
            <Select
              removeIcon={<Icon type="close" />}
              clearIcon={<Icon type="close" />}
              menuItemSelectedIcon={<Icon type="close" />}
            >
              <Option value="1">1</Option>
            </Select>
          );
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
