
import Icon from '../icon'
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)
import buttonTypes from './buttonTypes'
const props = buttonTypes()
export default {
  name: 'AButton',
  __ANT_BUTTON: true,
  props: {
    ...props,
  },
  data () {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm',
      },
      clicked: false,
      sLoading: !!this.loading,
      hasTwoCNChar: false,
    }
  },
  mounted () {
    this.fixTwoCNChar()
  },
  updated () {
    this.fixTwoCNChar()
  },
  watch: {
    loading (val) {
      clearTimeout(this.delayTimeout)
      if (typeof val !== 'boolean' && val && val.delay) {
        this.delayTimeout = setTimeout(() => { this.sLoading = !!val }, val.delay)
      } else {
        this.sLoading = !!val
      }
    },
  },
  computed: {
    classes () {
      const { prefixCls, type, shape, size, hasTwoCNChar,
        sLoading, ghost, clicked, sizeMap } = this
      const sizeCls = sizeMap[size] || ''
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-${shape}`]: shape,
        [`${prefixCls}-${sizeCls}`]: sizeCls,
        [`${prefixCls}-loading`]: sLoading,
        [`${prefixCls}-clicked`]: clicked,
        [`${prefixCls}-background-ghost`]: ghost || type === 'ghost',
        [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar,
      }
    },
    iconType () {
      const { sLoading, icon } = this
      return sLoading ? 'loading' : icon
    },
  },
  methods: {
    fixTwoCNChar () {
      // Fix for HOC usage like <FormatMessage />
      const node = this.$el
      const buttonText = node.textContent || node.innerText
      if (this.isNeedInserted() && isTwoCNChar(buttonText)) {
        if (!this.hasTwoCNChar) {
          this.hasTwoCNChar = true
        }
      } else if (this.hasTwoCNChar) {
        this.hasTwoCNChar = false
      }
    },
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
    isNeedInserted () {
      const { loading, icon, $slots } = this
      const iconType = loading ? 'loading' : icon
      return $slots.default && $slots.default.length === 1 && (!iconType || iconType === 'loading')
    },
  },
  render () {
    const { htmlType, classes,
      disabled, handleClick, iconType,
      $slots, $attrs, $listeners } = this
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
        ...$listeners,
        click: handleClick,
      },
    }
    const kids = $slots.default && $slots.default.length === 1 ? this.insertSpace($slots.default[0], this.isNeedInserted()) : $slots.default
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

