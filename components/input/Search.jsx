
import Input, { InputProps } from './Input'
import Icon from '../icon'

export default {
  name: 'InputSearch',
  props: {
    ...InputProps,
    prefixCls: {
      default: 'ant-input-search',
      type: String,
    },
    inputPrefixCls: {
      default: 'ant-input',
      type: String,
    },
  },
  computed: {
  },
  methods: {
    onSearch (e) {
      this.$emit('search', this.$refs.input.stateValue)
      this.$refs.input.focus()
    },
  },
  render () {
    const { inputPrefixCls, prefixCls, ...others } = this.$props
    const inputProps = {
      props: {
        ...others,
        prefixCls: inputPrefixCls,
      },
      attrs: this.$attrs,
    }
    return (
      <Input
        {...inputProps}
        onPressEnter={this.onSearch}
        class={prefixCls}
        ref='input'
      >
        <Icon
          slot='suffix'
          class={`${prefixCls}-icon`}
          onClick={this.onSearch}
          type='search'
        />
      </Input>
    )
  },
}

