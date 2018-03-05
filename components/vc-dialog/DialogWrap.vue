<script>
import Dialog from './Dialog'
import ContainerRender from '../_util/ContainerRender'
import getDialogPropTypes from './IDialogPropTypes'
const IDialogPropTypes = getDialogPropTypes()
const DialogWrap = {
  props: {
    ...IDialogPropTypes,
    visible: IDialogPropTypes.visible.def(false),
  },
  data () {
    this.renderComponent = () => {}

    this.removeContainer = () => {}
    return {}
  },

  beforeDestroy () {
    if (this.visible) {
      this.renderComponent({
        afterClose: this.removeContainer,
        onClose () {
        },
        visible: false,
      })
    } else {
      this.removeContainer()
    }
  },
  methods: {
    getComponent (extra = {}) {
      const dialogProps = {
        props: {
          ...this.$props,
          ...extra,
        },
        ref: '_component',
        key: 'dialog',
      }
      return (
        <Dialog {...dialogProps}>{this.$slots.default}</Dialog>
      )
    },

    getContainer2 () {
      if (this.getContainer) {
        return this.getContainer()
      }
      const container = document.createElement('div')
      document.body.appendChild(container)
      return container
    },
  },

  render () {
    const { visible } = this
    return (
      <ContainerRender
        parent={this}
        visible={visible}
        autoDestroy={false}
        getComponent={this.getComponent}
        getContainer={this.getContainer2}
        children={({ renderComponent, removeContainer }) => {
          this.renderComponent = renderComponent
          this.removeContainer = removeContainer
          return null
        }}
      />
    )
  },
}

export default DialogWrap

</script>
