import PropTypes from './vue-types';
import { Teleport, defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'Portal',
  props: {
    getContainer: {
      type: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
      required: true,
    },
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
});
