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
        this.renderComponent()
      },
    }
  }

  if (autoDestroy) {
    mixin = {
      ...mixin,
      beforeDestroy () {
        this.removeContainer()
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
          !isVisible || isVisible(this) ||
            (isForceRender && isForceRender(this))
        ) {
          if (!this._container) {
            this._container = getContainer(this)
          }
          this._container.appendChild(this.$el)
        }
        let component
        if (this.getComponent) {
          component = this.getComponent(componentArg)
        } else {
          component = getComponent(this, componentArg)
        }
        this._component = component
      },
    },
  }

  return mixin
}
