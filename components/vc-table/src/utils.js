import warning from 'warning'

let scrollbarSize

// Measure scrollbar width for padding body during modal show/hide
const scrollbarMeasure = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px',
  overflow: 'scroll',
}

export function measureScrollbar (direction = 'vertical') {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 0
  }
  if (scrollbarSize) {
    return scrollbarSize
  }
  const scrollDiv = document.createElement('div')
  for (const scrollProp in scrollbarMeasure) {
    if (scrollbarMeasure.hasOwnProperty(scrollProp)) {
      scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp]
    }
  }
  document.body.appendChild(scrollDiv)
  let size = 0
  if (direction === 'vertical') {
    size = scrollDiv.offsetWidth - scrollDiv.clientWidth
  } else if (direction === 'horizontal') {
    size = scrollDiv.offsetHeight - scrollDiv.clientHeight
  }

  document.body.removeChild(scrollDiv)
  scrollbarSize = size
  return scrollbarSize
}

export function debounce (func, wait, immediate) {
  let timeout
  function debounceFunc () {
    const context = this
    const args = arguments
    // https://fb.me/react-event-pooling
    if (args[0] && args[0].persist) {
      args[0].persist()
    }
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
  debounceFunc.cancel = function cancel () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  return debounceFunc
}

const warned = {}
export function warningOnce (condition, format, args) {
  if (!warned[format]) {
    warning(condition, format, args)
    warned[format] = !condition
  }
}

export function remove (array, item) {
  const index = array.indexOf(item)
  const front = array.slice(0, index)
  const last = array.slice(index + 1, array.length)
  return front.concat(last)
}
