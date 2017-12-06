<script>
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
      const eventKeyCode = e.keyCode
      if (eventKeyCode === 13) {
        // const { onSearch } = this.$props
        // if (onSearch) {
        //   onSearch(this.$refs.input.value)
        // }
        this.$emit('search', this.$refs.input.value)
        this.$refs.input.focus()
      }
    },
  },
  render () {
    const { inputPrefixCls, prefixCls, ...others } = this.$props
    delete others.onSearch
    // const searchSuffix = (
    //   <Icon
    //     class={`${prefixCls}-icon`}
    //     onClick={this.onSearch}
    //     type='search'
    //   />
    // )
    return (
      <Input
        onKeyup={this.onSearch}
        {...others}
        class={prefixCls}
        prefixCls={inputPrefixCls}
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
</script>
