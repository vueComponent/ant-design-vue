function enhancer(Component) {
  return {
    mixins: [Component],
    updated() {
      this.$nextTick(() => {
        if (!this.$refs.svgPathRef) {
          return;
        }
        const pathStyle = this.$refs.svgPathRef.style;
        pathStyle.transitionDuration = '.3s, .3s, .3s, .06s';
        const now = Date.now();
        if (this.prevTimeStamp && now - this.prevTimeStamp < 100) {
          pathStyle.transitionDuration = '0s, 0s';
        }
        this.prevTimeStamp = Date.now();
      });
    },
  };
}

export default enhancer;
