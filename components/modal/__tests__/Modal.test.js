import { mount } from '@vue/test-utils'
import Modal from '..'

const ModalTester = {
  props: ['footer', 'visible'],
  methods: {
    getContainer () {
      return this.$refs.container
    },
  },

  render () {
    const modalProps = {
      props: {
        ...this.$props,
        getContainer: this.getContainer,
      },
    }
    return (
      <div>
        <div ref='container' />
        <Modal
          {...modalProps}
        >
          Here is content of Modal
        </Modal>
      </div>
    )
  },
}

describe('Modal', () => {
  it('render correctly', () => {
    const wrapper = mount(ModalTester)
    expect(wrapper.html()).toMatchSnapshot()
    const wrapper1 = mount(
      {
        render () {
          return <ModalTester visible />
        },
      }
    )
    expect(wrapper1.html()).toMatchSnapshot()
  })

  it('render without footer', () => {
    const wrapper = mount(
      {
        render () {
          return <ModalTester visible footer={null} />
        },
      }
    )
    expect(wrapper.html()).toMatchSnapshot()
  })
})
