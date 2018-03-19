
import PropTypes from '../_util/vue-types'
import align from 'dom-align'
import addEventListener from '../_util/Dom/addEventListener'
import { cloneElement } from '../_util/vnode.js'
import isWindow from './isWindow'
import clonedeep from 'lodash.clonedeep'
import shallowequal from 'shallowequal'
function noop () {
}

function buffer (fn, ms) {
  let timer

  function clear () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function bufferFn () {
    clear()
    timer = setTimeout(fn, ms)
  }

  bufferFn.clear = clear

  return bufferFn
}

export default {
  props: {
    childrenProps: PropTypes.object,
    align: PropTypes.object.isRequired,
    target: PropTypes.func.def(noop),
    monitorBufferTime: PropTypes.number.def(50),
    monitorWindowResize: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    visible: PropTypes.bool.def(false),
  },
  data () {
    this.aligned = false
    return {
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.prevProps = { ...this.$props }
      const props = this.$props
      // if parent ref not attached .... use document.getElementById
      !this.aligned && this.forceAlign()
      if (!props.disabled && props.monitorWindowResize) {
        this.startMonitorWindowResize()
      }
    })
  },
  updated () {
    this.$nextTick(() => {
      const prevProps = this.prevProps
      const props = this.$props
      let reAlign = false
      if (!props.disabled && this.visible) {
        if (prevProps.disabled || !shallowequal(prevProps.align, props.align)) {
          reAlign = true
        } else {
          const lastTarget = prevProps.target()
          const currentTarget = props.target()
          if (isWindow(lastTarget) && isWindow(currentTarget)) {
            reAlign = false
          } else if (lastTarget !== currentTarget) {
            reAlign = true
          }
        }
      }

      if (reAlign) {
        this.forceAlign()
      }

      if (props.monitorWindowResize && !props.disabled) {
        this.startMonitorWindowResize()
      } else {
        this.stopMonitorWindowResize()
      }
      this.prevProps = { ...this.$props, align: clonedeep(this.$props.align) }
    })
  },
  beforeDestroy () {
    this.stopMonitorWindowResize()
  },
  methods: {
    startMonitorWindowResize () {
      if (!this.resizeHandler) {
        this.bufferMonitor = buffer(this.forceAlign, this.$props.monitorBufferTime)
        this.resizeHandler = addEventListener(window, 'resize', this.bufferMonitor)
      }
    },

    stopMonitorWindowResize () {
      if (this.resizeHandler) {
        this.bufferMonitor.clear()
        this.resizeHandler.remove()
        this.resizeHandler = null
      }
    },

    forceAlign () {
      const props = this.$props
      if (!props.disabled) {
        const source = this.$el
        this.aligned = true
        this.$listeners.align && this.$listeners.align(source, align(source, props.target(), props.align))
      }
    },
  },

  render () {
    const { childrenProps } = this.$props
    const child = this.$slots.default[0]
    if (childrenProps) {
      return cloneElement(child, { props: childrenProps })
    }
    return child
  },
}


