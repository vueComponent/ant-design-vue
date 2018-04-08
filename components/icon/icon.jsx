
export default {
  name: 'AIcon',
  props: {
    prefixCls: {
      default: 'anticon',
      type: String,
    },
    type: String,
    title: String,
    spin: Boolean,
  },
  data () {
    return {
    }
  },
  computed: {
    classes () {
      const { prefixCls, type, spin } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-spin`]: !!spin || type === 'loading',
      }
    },
  },
  methods: {
    handleClick (event) {
      if (this.clicked) {
        return
      }

      this.clicked = true
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => (this.clicked = false), 500)
      this.$emit('click', event)
    },
  },
  render () {
    const { title, classes, handleClick, $listeners } = this
    const iconProps = {
      attrs: {
        title,
      },
      class: classes,
      on: {
        ...$listeners,
        click: handleClick,
      },
    }
    return (
      <i {...iconProps}/>
    )
  },
  beforeDestroy () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },
}

