<script>
import Icon from '../icon'
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)
export default {
  name: 'Button',
  components: { Icon },
  props: {
    prefixCls: {
      default: 'ant-btn',
      type: String,
    },
    type: {
      validator (value) {
        return ['primary', 'danger', 'dashed', 'ghost', 'default'].includes(value)
      },
    },
    htmlType: {
      default: 'button',
      validator (value) {
        return ['button', 'submit', 'reset'].includes(value)
      },
    },
    icon: String,
    shape: {
      validator (value) {
        return ['circle', 'circle-outline'].includes(value)
      },
    },
    size: {
      validator (value) {
        return ['small', 'large', 'default'].includes(value)
      },
    },
    loading: [Boolean, Object],
    disabled: Boolean,
    ghost: Boolean,
  },
  data () {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm',
      },
      clicked: false,
      sLoading: !!this.loading,
    }
  },
  watch: {
    loading: {
      handler: function (val) {
        clearTimeout(this.delayTimeout)
        if (typeof val !== 'boolean' && val && val.delay) {
          this.delayTimeout = setTimeout(() => { this.sLoading = !!val }, val.delay)
        } else {
          this.sLoading = !!val
        }
      },
      deep: true,
    },
  },
  computed: {
    classes () {
      const { prefixCls, type, shape, size, sLoading, ghost, clicked, sizeMap } = this
      const sizeCls = sizeMap[size] || ''
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-${shape}`]: shape,
        [`${prefixCls}-${sizeCls}`]: sizeCls,
        [`${prefixCls}-loading`]: sLoading,
        [`${prefixCls}-clicked`]: clicked,
        [`${prefixCls}-background-ghost`]: ghost || type === 'ghost',
      }
    },
    iconType () {
      const { sLoading, icon } = this
      return sLoading ? 'loading' : icon
    },
  },
  methods: {
    handleClick (event) {
      this.clicked = true
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => (this.clicked = false), 500)
      this.$emit('click', event)
    },
    insertSpace (child, needInserted) {
      const SPACE = needInserted ? ' ' : ''
      if (typeof child.text === 'string') {
        let text = child.text.trim()
        if (isTwoCNChar(text)) {
          text = text.split('').join(SPACE)
        }
        return <span>{text}</span>
      }
      return child
    },
  },
  render () {
    const { htmlType, classes, disabled, handleClick, iconType, $slots, $attrs, _events } = this
    const buttonProps = {
      props: {
      },
      attrs: {
        ...$attrs,
        type: htmlType,
        disabled,
      },
      class: classes,
      on: {
        click: handleClick,
      },
    }
    for (const [k, event] of Object.entries(_events)) {
      if (!buttonProps.on[k]) {
        buttonProps.on[k] = event
      }
    }
    const needInserted = $slots.default && $slots.default.length === 1 && (!iconType || iconType === 'loading')
    const kids = $slots.default && $slots.default.length === 1 ? this.insertSpace($slots.default[0], needInserted) : $slots.default
    return (
      <button {...buttonProps}>
        {iconType ? <Icon type={iconType}></Icon> : null}
        {kids}
      </button>
    )
  },
  beforeDestroy () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout)
    }
  },
}
</script>
