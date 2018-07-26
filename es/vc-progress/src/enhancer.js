function enhancer(Component) {
  return {
    mixins: [Component],
    updated: function updated() {
      var _this = this;

      this.$nextTick(function () {
        if (!_this.$refs.svgPathRef) {
          return;
        }
        var pathStyle = _this.$refs.svgPathRef.style;
        pathStyle.transitionDuration = '.3s, .3s, .3s, .06s';
        var now = Date.now();
        if (_this.prevTimeStamp && now - _this.prevTimeStamp < 100) {
          pathStyle.transitionDuration = '0s, 0s';
        }
        _this.prevTimeStamp = Date.now();
      });
    }
  };
}

export default enhancer;