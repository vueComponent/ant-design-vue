<script>
  import PropTypes from '../_util/vue-types'

  export default {
    name: 'Breadcrumb',
    props: {
      prefixCls: PropTypes.string.def('ant-breadcrumb'),
      separator: PropTypes.string.def('/'),
      styles: PropTypes.Object,
    },
    provide () {
      return {
        breadCrumbParent: this,
      }
    },
    render () {
      const { prefixCls, styles } = this
      return (
        <div class={prefixCls} style={styles}>
          {this.$slots.default}
        </div>
      )
    },
  }
</script>
