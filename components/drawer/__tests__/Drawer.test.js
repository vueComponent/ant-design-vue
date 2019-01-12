import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Drawer from '..';

const DrawerCom = {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    getContainer: {
      type: Boolean,
      default: false,
    },
    wrapClassName: {
      type: String,
      default: '',
    },
  },
  render() {
    const drawerProps = {
      props: {
        destroyOnClose: true,
        getContainer: false,
        visible: false,
        wrapClassName: this.wrapClassName,
      },
    };
    return <Drawer {...drawerProps}>Here is content of Drawer</Drawer>;
  },
};

describe('Drawer', () => {
  it('render correctly', async () => {
    const props = {
      propsData: {
        visible: true,
        width: 400,
        getContainer: false,
      },
      slots: {
        default: ['Here is content of Drawer'],
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render top drawer', async () => {
    const props = {
      propsData: {
        visible: true,
        height: 400,
        placement: 'top',
        getContainer: false,
      },
      slots: {
        default: 'Here is content of Drawer',
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('have a title', async () => {
    const props = {
      propsData: {
        visible: true,
        title: 'Test Title',
        getContainer: false,
      },
      slots: {
        default: 'Here is content of Drawer',
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('closable is false', async () => {
    const props = {
      propsData: {
        visible: true,
        closable: false,
        getContainer: false,
      },
      slots: {
        default: 'Here is content of Drawer',
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('destroyOnClose is true', async () => {
    const props = {
      propsData: {
        destroyOnClose: true,
        closable: false,
        getContainer: false,
      },
      slots: {
        default: 'Here is content of Drawer',
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('class is test_drawer', async () => {
    const props = {
      propsData: {
        wrapClassName: 'test_drawer',
      },
      sync: false,
    };
    const wrapper = mount(DrawerCom, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
