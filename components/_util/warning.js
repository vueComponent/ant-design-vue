import warning from 'warning'

const warned = {}
export default (valid, message, throwError) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!valid && !warned[message]) {
      warning(false, message)
      warned[message] = true
      if (throwError) {
        throw Error(message)
      }
    }
  }
}
