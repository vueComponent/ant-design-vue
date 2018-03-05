<script>
import Dialog from './Dialog'
import ContainerRender from 'rc-util/lib/ContainerRender'
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

  getContainer () {
    if (this.getContainer) {
      return this.getContainer()
    }
    const container = document.createElement('div')
    document.body.appendChild(container)
    return container
  },

  render () {
    const { visible } = this

    return (
      <ContainerRender
        parent={this}
        visible={visible}
        autoDestroy={false}
        getComponent={this.getComponent}
        getContainer={this.getContainer}
      >
        {({ renderComponent, removeContainer }) => {
          this.renderComponent = renderComponent
          this.removeContainer = removeContainer
          return null
        }}
      </ContainerRender>
    )
  },
}

export default DialogWrap

</script>
