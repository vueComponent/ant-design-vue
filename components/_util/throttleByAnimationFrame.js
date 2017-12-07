import getRequestAnimationFrame, { cancelRequestAnimationFrame } from '../_util/getRequestAnimationFrame'

const reqAnimFrame = getRequestAnimationFrame()

export default function throttleByAnimationFrame (fn) {
  let requestId

  const later = args => () => {
    requestId = null
    fn(...args)
  }

  const throttled = (...args) => {
    if (requestId == null) {
      requestId = reqAnimFrame(later(args))
    }
  }

  throttled.cancel = () => cancelRequestAnimationFrame(requestId)

  return throttled
}

export function throttleByAnimationFrameDecorator () {
  return function (target, key, descriptor) {
    const fn = descriptor.value
    let definingProperty = false
    return {
      configurable: true,
      get () {
        if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
          return fn
        }

        const boundFn = throttleByAnimationFrame(fn.bind(this))
        definingProperty = true
        Object.defineProperty(this, key, {
          value: boundFn,
          configurable: true,
          writable: true,
        })
        definingProperty = false
        return boundFn
      },
    }
  }
}
