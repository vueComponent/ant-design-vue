import { nextTick } from 'vue';
import { getOptionProps } from './props-util';

export default {
  methods: {
    setState(state = {}, callback: () => any) {
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
      if (this._.isMounted) {
        this.$forceUpdate();
      }
      nextTick(() => {
        callback && callback();
      });
    },
    __emit() {
      // 直接调用事件，底层组件不需要vueTool记录events
      // eslint-disable-next-line prefer-rest-params
      const args = [].slice.call(arguments, 0);
      let eventName = args[0];
      eventName = `on${eventName[0].toUpperCase()}${eventName.substring(1)}`;
      const event = this.$props[eventName] || this.$attrs[eventName];
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
