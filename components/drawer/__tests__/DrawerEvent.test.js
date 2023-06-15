import { mount } from '@vue/test-utils';
import Drawer from '..';
import Button from '../../button';
import { asyncExpect } from '../../../tests/utils';

const DrawerEventTester = {
  props: {
    maskClosable: {
      type: Boolean,
      default: true,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.visible = true;
    });
  },
  methods: {
    onClose() {
      this.visible = false;
    },
    open() {
      this.visible = true;
    },
  },
  render() {
    const drawerProps = {
      visible: this.visible,
      getContainer: false,
      ...this.$props,
      onClose: this.onClose,
    };
    return (
      <div>
        <Button onClick={this.open}>open</Button>
        <Drawer {...drawerProps}>Here is content of Drawer</Drawer>
      </div>
    );
  },
};

describe('Drawer', () => {
  it('render correctly', async () => {
    const wrapper = mount(DrawerEventTester, {
      sync: false,
    });
    await asyncExpect(() => {
      const body = wrapper.find('.ant-drawer-body').exists();
      expect(body).toBe(true);
      wrapper.find('.ant-btn').trigger('click');
      const content = wrapper.find('.ant-drawer-body').element.innerHTML;
      expect(content).toBe('Here is content of Drawer');

      expect(wrapper.html()).toMatchSnapshot();
    });
  }, 1000);

  it('mask trigger onClose', async () => {
    const wrapper = mount(DrawerEventTester, {
      sync: false,
    });

    await asyncExpect(() => {
      wrapper.find('button.ant-btn').trigger('click');
      expect(wrapper.vm.visible).toBe(true);

      wrapper.find('.ant-drawer-mask').trigger('click');
      expect(wrapper.vm.visible).toBe(false);
    });
  });

  it('close button trigger onClose', async () => {
    const wrapper = mount(DrawerEventTester, {
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('button.ant-btn').trigger('click');
      expect(wrapper.vm.visible).toBe(true);

      wrapper.find('.ant-drawer-close').trigger('click');
      expect(wrapper.vm.visible).toBe(false);
    });
  });

  it('maskClosable no trigger onClose', async () => {
    const wrapper = mount(DrawerEventTester, {
      props: {
        maskClosable: false,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('button.ant-btn').trigger('click');
      expect(wrapper.vm.visible).toBe(true);

      wrapper.find('.ant-drawer-mask').trigger('click');
      expect(wrapper.vm.visible).toBe(true);
    });
  });

  fit('destroyOnClose is true onClose', async () => {
    const wrapper = mount(DrawerEventTester, {
      props: {
        destroyOnClose: true,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('button.ant-btn').trigger('click');
      expect(wrapper.find('.ant-drawer-wrapper-body').exists()).toBe(true);

      wrapper.vm.visible = false;
      wrapper
        .find('.ant-drawer-content-wrapper')
        .trigger('transitionend', { propertyName: 'transform' });
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-drawer-wrapper-body').exists()).toBe(false);
    });
  });

  it('no mask and no closable', async () => {
    const wrapper = mount(DrawerEventTester, {
      props: {
        destroyOnClose: true,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('button.ant-btn').trigger('click');
      expect(wrapper.vm.visible).toBe(true);

      wrapper.find('.ant-drawer-close').trigger('click');
      expect(wrapper.vm.visible).toBe(false);
    });
  });
});
