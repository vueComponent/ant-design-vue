<script>
import PropTypes from '../_util/vue-types'
import align from 'dom-align'
import clonedeep from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'
import addEventListener from '../_util/Dom/addEventListener'
import { cloneElement } from '../_util/vnode.js'
import isWindow from './isWindow'
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
  },
  data () {
    return {
      aligned: false,
    }
  },
  mounted () {
    const props = this.$props
    // if parent ref not attached .... use document.getElementById
    !this.aligned && this.forceAlign()
    if (!props.disabled && props.monitorWindowResize) {
      this.startMonitorWindowResize()
    }
  },
  updated () {
    const prevProps = this.prevProps
    const props = this.$props
    let reAlign = false
    if (!props.disabled) {
      if (prevProps.disabled || !isEqual(prevProps.align, props.align)) {
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
        // this.$emit('align', source, align(source, props.target(), props.align))
        this.$listeners.align && this.$listeners.align(source, align(source, props.target(), props.align))
      }
    },
  },

  render () {
    this.prevProps = clonedeep(this.$props)
    const { childrenProps } = this.$props
    const child = this.$slots.default[0]
    if (childrenProps) {
      return cloneElement(child, { props: childrenProps })
    }
    return child
  },
}

</script>
