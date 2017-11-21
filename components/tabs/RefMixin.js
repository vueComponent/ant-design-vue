export default {
  saveRef (name) {
    return node => {
      this[name] = node
    }
  },
}
