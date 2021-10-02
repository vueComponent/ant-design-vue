import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
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
    class: {
      type: String,
      default: '',
    },
  },
  render() {
    return <Drawer {...this.$props}>Here is content of Drawer</Drawer>;
  },
};

describe('Drawer', () => {
  it('render correctly', async () => {
    const props = {
      props: {
        visible: true,
        width: 400,
        getContainer: false,
      },
      slots: {
        default: () => ['Here is content of Drawer'],
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
      props: {
        visible: true,
        height: 400,
        placement: 'top',
        getContainer: false,
      },
      slots: {
        default: () => 'Here is content of Drawer',
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
      props: {
        visible: true,
        title: 'Test Title',
        getContainer: false,
      },
      slots: {
        default: () => 'Here is content of Drawer',
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
      props: {
        visible: true,
        closable: false,
        getContainer: false,
      },
      slots: {
        default: () => 'Here is content of Drawer',
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
      props: {
        destroyOnClose: true,
        closable: false,
        getContainer: false,
        visible: true,
      },
      slots: {
        default: () => 'Here is content of Drawer',
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
      props: {
        class: 'test_drawer',
        visible: true,
      },
      sync: false,
    };
    const wrapper = mount(DrawerCom, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
