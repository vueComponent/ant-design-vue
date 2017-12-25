import Vue from 'vue'
function defaultGetContainer () {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return container
}

export default function getContainerRenderMixin (config) {
  const {
    autoMount = true,
    autoDestroy = true,
    isVisible,
    isForceRender,
    getComponent,
    getContainer = defaultGetContainer,
  } = config

  let mixin
  if (autoMount) {
    mixin = {
      ...mixin,
      mounted () {
        // this.renderComponent()
      },
    }
  }

  if (autoDestroy) {
    mixin = {
      ...mixin,
      beforeDestroy () {
        // this.removeContainer()
      },
    }
  }
  mixin = {
    ...mixin,
    methods: {
      removeContainer () {
        if (this._container) {
          const container = this._container
          container.parentNode.removeChild(container)
          this._container = null
        }
      },
      renderComponent (componentArg) {
        if (
          !isVisible || this._component || isVisible(this) ||
            (isForceRender && isForceRender(this))
        ) {
          if (!this._container) {
            this._container = getContainer(this)
          }
          let component
          if (this.getComponent) {
            component = this.getComponent(componentArg)
          } else {
            component = getComponent(this, componentArg)
          }
          this._component = component
          const vmC = document.createElement('div')
          this._container.appendChild(vmC)

          new Vue({
            el: vmC,
            render () {
              return component
            },
          })
        }
      },
    },
  }

  return mixin
}
