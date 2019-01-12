import PropTypes from '../../_util/vue-types';

export default {
  props: {
    children: PropTypes.func.def(() => null),
  },
  methods: {
    getRef(name) {
      return this[name];
    },

    saveRef(name) {
      return node => {
        if (node) {
          this[name] = node;
        }
      };
    },
  },

  render() {
    // 每次都new一个新的function，避免子节点不能重新渲染
    const saveRef = name => this.saveRef(name);
    const getRef = name => this.getRef(name);
    return this.children(saveRef, getRef);
  },
};
