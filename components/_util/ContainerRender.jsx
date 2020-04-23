import PropTypes from './vue-types';

export default {
  props: {
    autoMount: PropTypes.bool.def(true),
    autoDestroy: PropTypes.bool.def(true),
    visible: PropTypes.bool,
    forceRender: PropTypes.bool.def(false),
    parent: PropTypes.any,
    getComponent: PropTypes.func.isRequired,
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
  },

  mounted() {
    if (this.autoMount) {
      this.renderComponent();
    }
  },

  updated() {
    if (this.autoMount) {
      this.renderComponent();
    }
  },

  beforeDestroy() {
    if (this.autoDestroy) {
      this.removeContainer();
    }
  },
  methods: {
    removeContainer() {
      if (this.container) {
        this._component && this._component.$destroy();
        this.container.parentNode.removeChild(this.container);
        this.container = null;
        this._component = null;
      }
    },

    renderComponent(props = {}, ready) {
      const { visible, forceRender, getContainer, parent } = this;
      const self = this;
      if (visible || parent._component || parent.$refs._component || forceRender) {
        let el = this.componentEl;
        if (!this.container) {
          this.container = getContainer();
          el = document.createElement('div');
          this.componentEl = el;
          this.container.appendChild(el);
        }
        // self.getComponent 不要放在 render 中，会因为响应式数据问题导致，多次触发 render
        const com = { component: self.getComponent(props) };
        if (!this._component) {
          this._component = new this.$root.constructor({
            el,
            parent: self,
            data: {
              _com: com,
            },
            mounted() {
              this.$nextTick(() => {
                if (ready) {
                  ready.call(self);
                }
              });
            },
            updated() {
              this.$nextTick(() => {
                if (ready) {
                  ready.call(self);
                }
              });
            },
            methods: {
              setComponent(_com) {
                this.$data._com = _com;
              },
            },
            render() {
              return this.$data._com.component;
            },
          });
        } else {
          this._component.setComponent(com);
        }
      }
    },
  },

  render() {
    return this.children({
      renderComponent: this.renderComponent,
      removeContainer: this.removeContainer,
    });
  },
};
