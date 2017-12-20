<script>
export default {
  name: 'Page',
  props: {
    rootPrefixCls: String,
    page: Number,
    active: Boolean,
    showTitle: Boolean,
    itemRender: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    classes () {
      const prefixCls = `${this.rootPrefixCls}-item`
      let cls = `${prefixCls} ${prefixCls}-${this.page}`
      if (this.active) {
        cls = `${cls} ${prefixCls}-active`
      }
      if (this.className) {
        cls = `${cls} ${this.className}`
      }
      return cls
    },
  },
  methods: {
    handleClick () {
      this.$emit('click', this.page)
    },
    handleKeyPress (event) {
      this.$emit('keyPress', event, this.handleClick, this.page)
    },
  },
  render () {
    return (
      <li
        class={this.classes}
        onClick={this.handleClick}
        onKeypress={this.handleKeyPress}
        title={this.showTitle ? this.page : null}>
        {this.itemRender(this.page, 'page', <a>{this.page}</a>)}
      </li>
    )
  },
}
</script>
