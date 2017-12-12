<script>
import PropTypes from 'vue-types'
import align from 'dom-align'
import addEventListener from '../_util/Dom/addEventListener'
import cloneElement from '../_util/cloneElement'
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

  mounted () {
    const props = this.$props
    // if parent ref not attached .... use document.getElementById
    this.forceAlign()
    if (!props.disabled && props.monitorWindowResize) {
      this.startMonitorWindowResize()
    }
  },

  updated () {
    const props = this.$props

    this.forceAlign()

    if (props.monitorWindowResize && !props.disabled) {
      this.startMonitorWindowResize()
    } else {
      this.stopMonitorWindowResize()
    }
  },

  beforeDestory () {
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
        this.$emit('align', source, align(source, props.target(), props.align))
      }
    },
  },

  render () {
    const { childrenProps } = this.$props
    const child = this.$slots.default[0]
    if (childrenProps) {
      const newProps = {}
      for (const prop in childrenProps) {
        if (childrenProps.hasOwnProperty(prop)) {
          newProps[prop] = this.props[childrenProps[prop]]
        }
      }
      return cloneElement(child, newProps)
    }
    return child
  },
}

</script>
