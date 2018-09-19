
import VcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from '../vc-tree-select'
import classNames from 'classnames'
import { TreeSelectProps } from './interface'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import warning from '../_util/warning'
import { initDefaultProps, getOptionProps, getComponentFromProp, filterEmpty } from '../_util/props-util'

export { TreeData, TreeSelectProps } from './interface'

const TreeSelect = {
  TreeNode: { ...TreeNode, name: 'ATreeSelectNode' },
  SHOW_ALL,
  SHOW_PARENT,
  SHOW_CHILD,
  name: 'ATreeSelect',
  props: initDefaultProps(TreeSelectProps(), {
    prefixCls: 'ant-select',
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false,
  }),
  model: {
    prop: 'value',
    event: 'change',
  },

  created () {
    warning(
      this.multiple !== false || !this.treeCheckable,
      '`multiple` will alway be `true` when `treeCheckable` is true',
    )
  },
  methods: {
    focus () {
      this.$refs.vcTreeSelect.focus()
    },

    blur () {
      this.$refs.vcTreeSelect.blur()
    },
    onChange () {
      this.$emit('change', ...arguments)
    },
    updateTreeData (list = []) {
      for (let i = 0, len = list.length; i < len; i++) {
        const { label, title, scopedSlots = {}, children } = list[i]
        const { $scopedSlots } = this
        let newLabel = typeof label === 'function' ? label(this.$createElement) : label
        let newTitle = typeof title === 'function' ? title(this.$createElement) : title
        if (!newLabel && scopedSlots.label && $scopedSlots[scopedSlots.label]) {
          newLabel = $scopedSlots.label(list[i])
        }
        if (!newTitle && scopedSlots.title && $scopedSlots[scopedSlots.title]) {
          newTitle = $scopedSlots.title(list[i])
        }
        const item = {
          // label: newLabel,
          title: newTitle || newLabel,
        }
        this.updateTreeData(children || [])
        Object.assign(list[i], item)
      }
    },
    renderTreeSelect (locale) {
      const props = getOptionProps(this)
      const {
        prefixCls,
        size,
        notFoundContent,
        dropdownStyle,
        dropdownClassName,
        ...restProps
      } = props
      this.updateTreeData(props.treeData || [])
      const cls = {
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
      }

      let checkable = getComponentFromProp(this, 'treeCheckable')
      if (checkable) {
        checkable = <span class={`${prefixCls}-tree-checkbox-inner`} />
      }
      const VcTreeSelectProps = {
        props: {
          ...restProps,
          dropdownClassName: classNames(dropdownClassName, `${prefixCls}-tree-dropdown`),
          prefixCls,
          dropdownStyle: { maxHeight: '100vh', overflow: 'auto', ...dropdownStyle },
          treeCheckable: checkable,
          notFoundContent: notFoundContent || locale.notFoundContent,
        },
        class: cls,
        on: { ...this.$listeners, change: this.onChange },
        ref: 'vcTreeSelect',
      }
      return (
        <VcTreeSelect {...VcTreeSelectProps}>{filterEmpty(this.$slots.default)}</VcTreeSelect>
      )
    },
  },

  render () {
    return (
      <LocaleReceiver
        componentName='Select'
        defaultLocale={{}}
        scopedSlots={
          { default: this.renderTreeSelect }
        }
      />
    )
  },
}

/* istanbul ignore next */
TreeSelect.install = function (Vue) {
  Vue.component(TreeSelect.name, TreeSelect)
  Vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode)
}

export default TreeSelect
