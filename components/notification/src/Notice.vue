<script>
import PropTypes from '../../_util/vue-types'
import { getStyle } from '../../_util/vnode'
import BaseMixin from '../../_util/BaseMixin'

export default {
  mixins: [BaseMixin],
  props: {
    duration: PropTypes.number.def(1.5),
  },

  mounted () {
    this.startCloseTimer()
  },

  beforeDestory () {
    this.clearCloseTimer()
  },
  methods: {
    close () {
      this.clearCloseTimer()
      this._emit('close')
    },

    startCloseTimer () {
      if (this.duration) {
        this.closeTimer = setTimeout(() => {
          this.close()
        }, this.duration * 1000)
      }
    },

    clearCloseTimer () {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer)
        this.closeTimer = null
      }
    },
  },

  render () {
    const { prefixCls, closable, clearCloseTimer, startCloseTimer, $slots, close } = this
    const componentClass = `${prefixCls}-notice`
    const className = {
      [`${componentClass}`]: 1,
      [`${componentClass}-closable`]: closable,
    }
    const style = getStyle(this)
    return (
      <div class={className} style={style || { right: '50%' } } onMouseenter={clearCloseTimer}
        onMouseleave={startCloseTimer}
      >
        <div class={`${componentClass}-content`}>{$slots.default}</div>
        {closable
          ? <a tabIndex='0' onClick={close} class={`${componentClass}-close`}>
            <span class={`${componentClass}-close-x`}></span>
          </a> : null
        }
      </div>
    )
  },
}

</script>
