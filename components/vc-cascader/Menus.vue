<script>
import PropTypes from '../_util/vue-types'
import arrayTreeFilter from 'array-tree-filter'
import BaseMixin from '../_util/BaseMixin'

export default {
  mixins: [BaseMixin],
  props: {
    value: PropTypes.array.def([]),
    activeValue: PropTypes.array.def([]),
    options: PropTypes.array.isRequired,
    prefixCls: PropTypes.string.def('rc-cascader-menus'),
    expandTrigger: PropTypes.string.def('click'),
    // onSelect: PropTypes.func,
    visible: PropTypes.bool.def(false),
    dropdownMenuColumnStyle: PropTypes.object,
  },
  data () {
    this.menuItems = {}
    return {}
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollActiveItemToView()
    })
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.scrollActiveItemToView()
        })
      }
    },
  },
  methods: {
    getOption (option, menuIndex) {
      const { prefixCls, expandTrigger } = this
      const onSelect = (e) => {
        this.__emit('select', option, menuIndex, e)
      }
      const expandProps = {
        attrs: {
        },
        on: {
          click: onSelect,
        },
        key: option.value,
      }
      let menuItemCls = `${prefixCls}-menu-item`
      const hasChildren = option.children && option.children.length > 0
      if (hasChildren || option.isLeaf === false) {
        menuItemCls += ` ${prefixCls}-menu-item-expand`
      }
      if (expandTrigger === 'hover' && hasChildren) {
        expandProps.on = {
          mouseenter: this.delayOnSelect.bind(this, onSelect),
          mouseleave: this.delayOnSelect.bind(this),
          click: onSelect,
        }
      }
      if (this.isActiveOption(option, menuIndex)) {
        menuItemCls += ` ${prefixCls}-menu-item-active`
        expandProps.ref = this.getMenuItemRef(menuIndex)
      }
      if (option.disabled) {
        menuItemCls += ` ${prefixCls}-menu-item-disabled`
      }
      if (option.loading) {
        menuItemCls += ` ${prefixCls}-menu-item-loading`
      }
      let title = ''
      if (option.title) {
        title = option.title
      } else if (typeof option.label === 'string') {
        title = option.label
      }
      expandProps.attrs.title = title
      expandProps.class = menuItemCls
      return (
        <li {...expandProps}>
          {option.label}
        </li>
      )
    },

    getActiveOptions (values) {
      const activeValue = values || this.activeValue
      const options = this.options
      return arrayTreeFilter(options, (o, level) => o.value === activeValue[level])
    },

    getShowOptions () {
      const { options } = this
      const result = this.getActiveOptions()
        .map(activeOption => activeOption.children)
        .filter(activeOption => !!activeOption)
      result.unshift(options)
      return result
    },

    delayOnSelect (onSelect, ...args) {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer)
        this.delayTimer = null
      }
      if (typeof onSelect === 'function') {
        this.delayTimer = setTimeout(() => {
          onSelect(args)
          this.delayTimer = null
        }, 150)
      }
    },

    scrollActiveItemToView () {
    // scroll into view
      const optionsLength = this.getShowOptions().length
      for (let i = 0; i < optionsLength; i++) {
        const itemComponent = this.$refs[`menuItems_${i}`]
        if (itemComponent) {
          const target = itemComponent
          target.parentNode.scrollTop = target.offsetTop
        }
      }
    },

    isActiveOption (option, menuIndex) {
      const { activeValue = [] } = this
      return activeValue[menuIndex] === option.value
    },

    getMenuItemRef (index) {
      return `menuItems_${index}`
    },
  },

  render () {
    const { prefixCls, dropdownMenuColumnStyle } = this
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) =>
          <ul class={`${prefixCls}-menu`} key={menuIndex} style={dropdownMenuColumnStyle}>
            {options.map(option => this.getOption(option, menuIndex))}
          </ul>
        )}
      </div>
    )
  },
}
</script>
