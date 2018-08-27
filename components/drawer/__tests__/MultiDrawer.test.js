import { mount } from '@vue/test-utils'
import Drawer from '..'
import Button from '../../button'
import { asyncExpect } from '@/tests/utils'

const MultiDrawer = {
  props: {
    placement: {
      type: String,
      default: 'right',
    },
  },
  data () {
    return {
      visible: false,
      childrenDrawer: false,
    }
  },
  methods: {
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    showChildrenDrawer () {
      this.childrenDrawer = true
    },
    onChildrenDrawerClose () {
      this.childrenDrawer = false
    },
  },
  render () {
    const drawerProps = {
      props: {
        title: 'Multi-level drawer',
        width: 520,
        closable: false,
        visible: this.visible,
        getContainer: false,
        wrapClassName: 'test_drawer',
        placement: this.placement,
      },
      on: {
        close: this.onClose,
      },
    }
    const childrenDrawerProps = {
      props: {
        title: 'Two-level Drawer',
        width: 320,
        closable: false,
        visible: this.childrenDrawer,
        getContainer: false,
        placement: this.placement,
      },
      on: {
        close: this.onChildrenDrawerClose,
      },
    }
    const buttonProps = {
      props: {
        type: 'primary',
      },
      attrs: {
        id: 'open_drawer',
      },
      on: {
        click: this.showDrawer,
      },
    }
    return (
      <div>
        <Button {...buttonProps}>open</Button>
        <Drawer
          {...drawerProps}
        >
          <Button type='primary' id='open_two_drawer' onClick={this.showChildrenDrawer}>
              Two-level drawer
          </Button>
          <Drawer
            {...childrenDrawerProps}
          >
            <div id='two_drawer_text'>
              This is two-level drawer
            </div>
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
            <Button onClick={this.onClose} type='primary'>
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    )
  },
}

describe('Drawer', () => {
  it('render right MultiDrawer', async () => {
    const wrapper = mount(MultiDrawer, {
      propsData: {
        placement: 'right',
      },
      sync: false,
    })
    await asyncExpect(() => {
      wrapper.find('#open_drawer').trigger('click')
    }, 0)
    await asyncExpect(() => {
      wrapper.find('#open_two_drawer').trigger('click')
    }, 0)
    await asyncExpect(() => {
      const translateX = wrapper.find('.ant-drawer.test_drawer').element.parentElement.style.transform
      expect(translateX).toEqual('translateX(-180px)')
      expect(wrapper.find('#two_drawer_text').exists()).toBe(true)
    }, 1000)
  })

  it('render right MultiDrawer', async () => {
    document.body.innerHTML = ''
    const wrapper = mount(MultiDrawer, {
      propsData: {
        placement: 'left',
      },
      sync: false,
    })
    await asyncExpect(() => {
      wrapper.find('#open_drawer').trigger('click')
    }, 0)
    await asyncExpect(() => {
      wrapper.find('#open_two_drawer').trigger('click')
    }, 0)
    await asyncExpect(() => {
      const translateX = wrapper.find('.ant-drawer.test_drawer').element.parentElement.style.transform
      expect(translateX).toEqual('translateX(180px)')
      expect(wrapper.find('#two_drawer_text').exists()).toBe(true)
    }, 1000)
  })
})
