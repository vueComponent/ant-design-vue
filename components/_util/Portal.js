import PropTypes from './vue-types';
import { Teleport } from 'vue';

export default {
  name: 'Portal',
  props: {
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    didUpdate: PropTypes.func,
  },
  data() {
    this._container = null;
    return {};
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

  beforeUnmount() {
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
      return <Teleport to={this._container}>{this.$props.children}</Teleport>;
    }
    return null;
  },
};
