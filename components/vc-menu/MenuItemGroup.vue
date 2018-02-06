<script>
import PropTypes from '../_util/vue-types'
import { getComponentFromProp } from '../_util/props-util'

const MenuItemGroup = {
  name: 'MenuItemGroup',

  props: {
    renderMenuItem: PropTypes.func,
    index: PropTypes.number,
    className: PropTypes.string,
    rootPrefixCls: PropTypes.string,
    disabled: PropTypes.bool.def(true),
    title: PropTypes.any,
  },
  isMenuItemGroup: true,
  methods: {
    renderInnerMenuItem (item, subIndex) {
      const { renderMenuItem, index } = this.$props
      return renderMenuItem(item, index, subIndex)
    },
  },
  render () {
    const props = this.$props
    const { rootPrefixCls } = props
    const titleClassName = `${rootPrefixCls}-item-group-title`
    const listClassName = `${rootPrefixCls}-item-group-list`
    return (
      <li class={`${rootPrefixCls}-item-group`}>
        <div
          class={titleClassName}
          title={typeof props.title === 'string' ? props.title : undefined}
        >
          {getComponentFromProp(this, 'title')}
        </div>
        <ul class={listClassName}>
          {this.$slots.default.map(this.renderInnerMenuItem)}
        </ul>
      </li>
    )
  },
}

export default MenuItemGroup
</script>
