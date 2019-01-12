import { asyncExpect } from '@/tests/utils';
import { mount } from '@vue/test-utils';
import KeyCode from '../../_util/KeyCode';
import Cascader from '..';
import focusTest from '../../../tests/shared/focusTest';

function $$(className) {
  return document.body.querySelectorAll(className);
}
const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

function filter(inputValue, path) {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

describe('Cascader', () => {
  focusTest(Cascader);

  it('popup correctly when panel is hidden', async () => {
    const wrapper = mount(Cascader, { propsData: { options }, sync: false });
    const CascaderWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(CascaderWrapper.html()).toMatchSnapshot();
    });
  });

  it('popup correctly when panel is open', async () => {
    const wrapper = mount(Cascader, { propsData: { options }, sync: false });
    await asyncExpect(() => {
      wrapper.find('input').trigger('click');
    });
    let CascaderWrapper = null;
    await asyncExpect(() => {
      CascaderWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      expect(CascaderWrapper.html()).toMatchSnapshot();
    });
  });

  it('support controlled mode', async () => {
    const wrapper = mount(Cascader, { propsData: { options }, sync: false });
    await asyncExpect(() => {
      wrapper.setProps({
        value: ['zhejiang', 'hangzhou', 'xihu'],
      });
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('popup correctly with defaultValue', async () => {
    const wrapper = mount(Cascader, {
      propsData: {
        options,
        defaultValue: ['zhejiang', 'hangzhou'],
      },
      sync: false,
    });

    await asyncExpect(() => {
      wrapper.find('input').trigger('click');
    });
    let CascaderWrapper = null;
    await asyncExpect(() => {
      CascaderWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });

    await asyncExpect(() => {
      expect(CascaderWrapper.html()).toMatchSnapshot();
    });
  });

  it('can be selected', async () => {
    const wrapper = mount(Cascader, { propsData: { options }, sync: false });
    await asyncExpect(() => {
      wrapper.find('input').trigger('click');
    });
    let popupWrapper = null;
    await asyncExpect(() => {
      popupWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      popupWrapper
        .findAll('.ant-cascader-menu')
        .at(0)
        .findAll('.ant-cascader-menu-item')
        .at(0)
        .trigger('click');
    });
    await asyncExpect(() => {
      popupWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });

    await asyncExpect(() => {
      expect(popupWrapper.html()).toMatchSnapshot();
    });
    await asyncExpect(() => {
      popupWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      popupWrapper
        .findAll('.ant-cascader-menu')
        .at(1)
        .findAll('.ant-cascader-menu-item')
        .at(0)
        .trigger('click');
    });
    await asyncExpect(() => {
      popupWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      expect(popupWrapper.html()).toMatchSnapshot();
    });
    await asyncExpect(() => {
      popupWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      popupWrapper
        .findAll('.ant-cascader-menu')
        .at(2)
        .findAll('.ant-cascader-menu-item')
        .at(0)
        .trigger('click');
    });
    await asyncExpect(() => {
      popupWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      expect(popupWrapper.html()).toMatchSnapshot();
    });
  });

  it('backspace should work with `Cascader[showSearch]`', async () => {
    const wrapper = mount(Cascader, { propsData: { options, showSearch: true }, sync: false });
    await asyncExpect(() => {
      wrapper.find('input').element.value = '123';
      wrapper.find('input').trigger('input');
    });
    await asyncExpect(() => {
      expect(wrapper.vm.inputValue).toBe('123');
    });
    await asyncExpect(() => {
      wrapper.find('input').element.keyCode = KeyCode.BACKSPACE;
      wrapper.find('input').trigger('keydown');
    });
    await asyncExpect(() => {
      // trigger onKeyDown will not trigger onChange by default, so the value is still '123'
      expect(wrapper.vm.inputValue).toBe('123');
    });
  });

  describe('limit filtered item count', () => {
    beforeEach(() => {
      document.body.outerHTML = '';
    });

    afterEach(() => {
      document.body.outerHTML = '';
    });

    it('limit with positive number', async () => {
      const wrapper = mount(Cascader, {
        propsData: { options, showSearch: { filter, limit: 1 } },
        sync: false,
        attachToDocument: true,
      });
      wrapper.find('input').trigger('click');
      wrapper.find('input').element.value = 'a';
      wrapper.find('input').trigger('input');
      await asyncExpect(() => {
        expect($$('.ant-cascader-menu-item').length).toBe(1);
      }, 0);
    });

    it('not limit', async () => {
      const wrapper = mount(Cascader, {
        propsData: { options, showSearch: { filter, limit: false } },
        sync: false,
        attachToDocument: true,
      });
      wrapper.find('input').trigger('click');
      wrapper.find('input').element.value = 'a';
      wrapper.find('input').trigger('input');
      await asyncExpect(() => {
        expect($$('.ant-cascader-menu-item').length).toBe(2);
      }, 0);
    });

    it('negative limit', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const wrapper = mount(Cascader, {
        propsData: { options, showSearch: { filter, limit: -1 } },
        sync: false,
        attachToDocument: true,
      });
      wrapper.find('input').trigger('click');
      wrapper.find('input').element.value = 'a';
      wrapper.find('input').trigger('input');
      await asyncExpect(() => {
        expect($$('.ant-cascader-menu-item').length).toBe(2);
      }, 0);
      expect(errorSpy).toBeCalledWith(
        "Warning: 'limit' of showSearch in Cascader should be positive number or false.",
      );
    });
  });
});
