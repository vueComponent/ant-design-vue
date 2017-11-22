export default {
  methods: {
    saveRef (name) {
      return node => {
        this[name] = node
      }
    },
  },
}
