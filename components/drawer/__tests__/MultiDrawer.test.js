import { mount } from '@vue/test-utils'
import Vue from 'vue'
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
        ...this.$props,
      },
      class: 'test_drawer',
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
        ...this.$props,
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
  // it('render right MultiDrawer', (done) => {
  // Vue.config.errorHandler = done
  // const wrapper = mount(MultiDrawer, {
  //   propsData: {
  //     placement: 'right',
  //   },
  //   aync: true,
  // })
  // wrapper.find('#open_drawer').trigger('click')
  // wrapper.find('#open_two_drawer').trigger('click')
  // Vue.nextTick(() => {
  //   console.log(wrapper.find('#open_drawer').html())
  //   // const translateX = wrapper.find('.ant-drawer.test_drawer').get(0).props.style.transform
  //   // expect(translateX).toEqual('translateX(-180px)')
  //   done()
  // })
  // })
})
