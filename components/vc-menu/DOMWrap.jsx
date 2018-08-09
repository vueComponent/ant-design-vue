
import omit from 'omit.js'
export default {
  name: 'DOMWrap',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: 'div',
    },
    hiddenClassName: {
      type: String,
      default: '',
    },
  },
  computed: {
    class () {
      const { visible, hiddenClassName } = this.$props
      return {
        // [hiddenClassName]: !visible,
      }
    },
  },
  render () {
    const otherProps = omit(this.$props, [
      'tag',
      'hiddenClassName',
      'visible',
    ])
    const Tag = this.$props.tag
    const tagProps = {
      attr: { ...otherProps, ...this.$attrs },
      on: this.$listeners,
    }
    return <Tag {...tagProps} class={this.class}>{this.$slots.default}</Tag>
  },
}

