
import Vue from 'vue';
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
    children: PropTypes.func.isRequired
  },

  mounted: function mounted() {
    if (this.autoMount) {
      this.renderComponent();
    }
  },
  updated: function updated() {
    if (this.autoMount) {
      this.renderComponent();
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.autoDestroy) {
      this.removeContainer();
    }
  },

  methods: {
    removeContainer: function removeContainer() {
      if (this.container) {
        this._component && this._component.$destroy();
        this.container.parentNode.removeChild(this.container);
        this.container = null;
      }
    },
    renderComponent: function renderComponent() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var ready = arguments[1];
      var visible = this.visible,
          getComponent = this.getComponent,
          forceRender = this.forceRender,
          getContainer = this.getContainer,
          parent = this.parent;

      var self = this;
      if (visible || parent.$refs._component || forceRender) {
        var el = this.componentEl;
        if (!this.container) {
          this.container = getContainer();
          el = document.createElement('div');
          this.componentEl = el;
          this.container.appendChild(el);
        }

        if (!this._component) {
          this._component = new Vue({
            data: {
              comProps: props
            },
            parent: self.parent,
            el: el,
            mounted: function mounted() {
              this.$nextTick(function () {
                if (ready) {
                  ready.call(self);
                }
              });
            },
            updated: function updated() {
              this.$nextTick(function () {
                if (ready) {
                  ready.call(self);
                }
              });
            },
            render: function render() {
              return getComponent(this.comProps);
            }
          });
        } else {
          this._component.comProps = props;
        }
      }
    }
  },

  render: function render() {
    return this.children({
      renderComponent: this.renderComponent,
      removeContainer: this.removeContainer
    });
  }
};