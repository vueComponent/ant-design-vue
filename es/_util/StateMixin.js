import _extends from "babel-runtime/helpers/extends";
export default {
  methods: {
    setState: function setState(state, callback) {
      _extends(this.$data, state);
      this.$nextTick(function () {
        callback && callback();
      });
    }
  }
};