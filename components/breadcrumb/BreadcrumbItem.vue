<script>
  import PropTypes from '../_util/vue-types'
  import hasProp from '../_util/props-util'

  export default {
    name: 'BreadcrumbItem',
    inject: ['breadCrumbParent'],
    props: {
      prefixCls: PropTypes.string.def('ant-breadcrumb'),
      href: PropTypes.string,
    },
    render () {
      const { prefixCls, ...restProps } = this.$props
      const { breadCrumbParent = {}} = this
      const { separator = '/' } = breadCrumbParent
      const solt = this.$slots.default
      let link
      if (hasProp(this, 'href')) {
        link = <a class={`${prefixCls}-link`} {...restProps}>{solt}</a>
      } else {
        link = <span class={`${prefixCls}-link`} {...restProps}>{solt}</span>
      }
      if (solt) {
        return (
          <span>
            {link}
            <span class={`${prefixCls}-separator`}>{separator}</span>
          </span>
        )
      }
      return null
    },
  }
</script>
