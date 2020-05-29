import { getOptionProps } from './props-util';

export default {
  methods: {
    setState(state = {}, callback) {
      let newState = typeof state === 'function' ? state(this.$data, this.$props) : state;
      if (this.getDerivedStateFromProps) {
        const s = this.getDerivedStateFromProps(getOptionProps(this), {
          ...this.$data,
          ...newState,
        });
        if (s === null) {
          return;
        } else {
          newState = { ...newState, ...(s || {}) };
        }
      }
      Object.assign(this.$data, newState);
      this.$forceUpdate();
      this.$nextTick(() => {
        callback && callback();
      });
    },
    __emit() {
      // 直接调用listeners，底层组件不需要vueTool记录events
      const args = [].slice.call(arguments, 0);
      const eventName = args[0];
      const event = this.$listeners[eventName];
      if (args.length && event) {
        if (Array.isArray(event)) {
          for (let i = 0, l = event.length; i < l; i++) {
            event[i](...args.slice(1));
          }
        } else {
          event(...args.slice(1));
        }
      }
    },
  },
};
