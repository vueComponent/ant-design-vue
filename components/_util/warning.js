import warning from 'warning'

const warned = {}
export default (valid, message) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!valid && !warned[message]) {
      warning(false, message)
      warned[message] = true
    }
  }
}
