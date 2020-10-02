export default {
  methods: {
    setState(state, callback) {
      Object.assign(this.$data, state);
      this.$nextTick(() => {
        callback && callback();
      });
    },
  },
};
