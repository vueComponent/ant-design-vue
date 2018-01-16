<script>
  import PropTypes from '../_util/vue-types'

  export default {
    name: 'Breadcrumb',
    props: {
      prefixCls: PropTypes.string.def('ant-breadcrumb'),
      separator: PropTypes.string.def('/'),
    },
    provide () {
      return {
        breadCrumbParent: this,
      }
    },
    render () {
      const { prefixCls } = this
      return (
        <div class={prefixCls}>
          {this.$slots.default}
        </div>
      )
    },
  }
</script>
