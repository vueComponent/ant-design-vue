import supportsPassive from './supportsPassive'

export default function addEventListenerWrap(
  target: HTMLElement | Window,
  eventType: string,
  cb: EventListener,
  option?: boolean | AddEventListenerOptions,
) {
  if (target && target.addEventListener) {
    let opt = option
    if (
      opt === undefined &&
      supportsPassive &&
      (eventType === 'touchstart' || eventType === 'touchmove' || eventType === 'wheel')
    ) {
      opt = { passive: false }
    }
    target.addEventListener(eventType, cb, opt)
  }
  return {
    remove: () => {
      if (target && target.removeEventListener) {
        target.removeEventListener(eventType, cb)
      }
    },
  }
}
