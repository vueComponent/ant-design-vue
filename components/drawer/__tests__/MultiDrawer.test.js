import { mount } from '@vue/test-utils';
import Drawer from '..';
import Button from '../../button';
import { asyncExpect } from '../../../tests/utils';
export function $$(className) {
  return document.body.querySelectorAll(className);
}
const MultiDrawer = {
  props: {
    placement: {
      type: String,
      default: 'right',
    },
  },
  data() {
    return {
      visible: false,
      childrenDrawer: false,
    };
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    showChildrenDrawer() {
      this.childrenDrawer = true;
    },
    onChildrenDrawerClose() {
      this.childrenDrawer = false;
    },
  },
  render() {
    const drawerProps = {
      title: 'Multi-level drawer',
      width: 520,
      visible: this.visible,
      getContainer: false,
      class: 'test_drawer',
      placement: this.placement,
      onClose: this.onClose,
    };
    const childrenDrawerProps = {
      title: 'Two-level Drawer',
      width: 320,
      class: 'Two-level',
      visible: this.childrenDrawer,
      getContainer: false,
      placement: this.placement,
      onClose: this.onChildrenDrawerClose,
    };
    const buttonProps = {
      type: 'primary',
      id: 'open_drawer',
      onClick: this.showDrawer,
    };
    return (
      <div>
        <Button {...buttonProps}>open</Button>
        <Drawer {...drawerProps}>
          <Button type="primary" id="open_two_drawer" onClick={this.showChildrenDrawer}>
            Two-level drawer
          </Button>
          <Drawer {...childrenDrawerProps}>
            <div id="two_drawer_text">This is two-level drawer</div>
          </Drawer>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.onClose}
            >
              Cancel
            </Button>
            <Button onClick={this.onClose} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  },
};

describe('Drawer', () => {
  it('render right MultiDrawer', async () => {
    const wrapper = mount(MultiDrawer, {
      props: {
        placement: 'right',
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('#open_drawer').trigger('click');
    }, 0);
    await asyncExpect(() => {
      wrapper.find('#open_two_drawer').trigger('click');
    }, 0);
    await asyncExpect(() => {
      const translateX = wrapper.find('.test_drawer').element.style.transform;
      expect(translateX).toEqual('translateX(-180px)');
      expect(wrapper.find('#two_drawer_text').exists()).toBe(true);
    }, 1000);
  });

  it('render left MultiDrawer', async () => {
    document.body.innerHTML = '';
    const wrapper = mount(MultiDrawer, {
      props: {
        placement: 'left',
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('#open_drawer').trigger('click');
    }, 0);
    await asyncExpect(() => {
      wrapper.find('#open_two_drawer').trigger('click');
    }, 0);
    await asyncExpect(() => {
      const translateX = wrapper.find('.test_drawer').element.style.transform;
      expect(translateX).toEqual('translateX(180px)');
      expect(wrapper.find('#two_drawer_text').exists()).toBe(true);
    }, 1000);
  });

  it('render top MultiDrawer', async () => {
    const wrapper = mount(MultiDrawer, {
      props: {
        placement: 'top',
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('#open_drawer').trigger('click');
    }, 0);
    await asyncExpect(() => {
      wrapper.find('#open_two_drawer').trigger('click');
    }, 0);
    await asyncExpect(() => {
      const translateY = wrapper.find('.test_drawer').element.style.transform;
      expect(translateY).toEqual('translateY(180px)');
      expect(wrapper.find('#two_drawer_text').exists()).toBe(true);
    }, 1000);
  });
});
