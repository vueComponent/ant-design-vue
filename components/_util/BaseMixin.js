export default {
  methods: {
    setState (state, callback) {
      Object.assign(this.$data, state)
      this.$nextTick(() => {
        callback && callback()
      })
    },
    __emit () { // 直接调用listeners，底层组件不需要vueTool记录events
      const args = [].slice.call(arguments, 0)
      if (args.length && this.$listeners[args[0]]) {
        this.$listeners[args[0]](...args.slice(1))
      }
    },
  },
}
