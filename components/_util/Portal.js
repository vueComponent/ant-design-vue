import PropTypes from './vue-types';
import { cloneElement } from './vnode';

export default {
  name: 'Portal',
  props: {
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    didUpdate: PropTypes.func,
  },
  mounted() {
    this.createContainer();
  },
  updated() {
    const { didUpdate } = this.$props;
    if (didUpdate) {
      this.$nextTick(() => {
        didUpdate(this.$props);
      });
    }
  },

  beforeDestroy() {
    this.removeContainer();
  },
  methods: {
    createContainer() {
      this._container = this.$props.getContainer();
      this.$forceUpdate();
    },
    removeContainer() {
      if (this._container && this._container.parentNode) {
        this._container.parentNode.removeChild(this._container);
      }
    },
  },

  render() {
    if (this._container) {
      return cloneElement(this.$props.children, {
        directives: [
          {
            name: 'ant-portal',
            value: this._container,
          },
        ],
      });
    }
    return null;
  },
};
