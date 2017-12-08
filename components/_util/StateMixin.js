export default {
  methods: {
    setState (state, callback) {
      Object.assign(this.$date, state)
      this.$nextTick(() => {
        callback()
      })
    },
  },
}
