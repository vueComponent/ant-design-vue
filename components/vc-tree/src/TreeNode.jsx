import PropTypes from '../../_util/vue-types'
import classNames from 'classnames'
import warning from 'warning'
import { getPosition, getNodeChildren, isCheckDisabled, traverseTreeNodes, mapChildren } from './util'
import { initDefaultProps, getOptionProps, filterEmpty, getComponentFromProp } from '../../_util/props-util'
import BaseMixin from '../../_util/BaseMixin'
import getTransitionProps from '../../_util/getTransitionProps'

function noop () {}
const ICON_OPEN = 'open'
const ICON_CLOSE = 'close'

const defaultTitle = '---'

let onlyTreeNodeWarned = false // Only accept TreeNode

const TreeNode = {
  name: 'TreeNode',
  mixins: [BaseMixin],
  __ANT_TREE_NODE: true,
  props: initDefaultProps({
    eventKey: PropTypes.string, // Pass by parent `cloneElement`
    prefixCls: PropTypes.string,
    // className: PropTypes.string,
    root: PropTypes.object,
    // onSelect: PropTypes.func,

    // By parent
    expanded: PropTypes.bool,
    selected: PropTypes.bool,
    checked: PropTypes.bool,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    halfChecked: PropTypes.bool,
    title: PropTypes.any,
    pos: PropTypes.string,
    dragOver: PropTypes.bool,
    dragOverGapTop: PropTypes.bool,
    dragOverGapBottom: PropTypes.bool,

    // By user
    isLeaf: PropTypes.bool,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    disableCheckbox: PropTypes.bool,
    icon: PropTypes.any,
    dataRef: PropTypes.object,
  }, {}),

  data () {
    return {
      dragNodeHighlight: false,
    }
  },
  inject: {
    vcTree: { default: {}},
    vcTreeNode: { default: {}},
  },
  provide () {
    return {
      vcTreeNode: this,
    }
  },

  // Isomorphic needn't load data in server side
  mounted () {
    this.syncLoadData(this.$props)
  },
  watch: {
    expanded (val) {
      this.syncLoadData({ expanded: val })
    },
  },

  methods: {
    onUpCheckConduct (treeNode, nodeChecked, nodeHalfChecked, e) {
      const { pos: nodePos } = getOptionProps(treeNode)
      const { eventKey, pos, checked, halfChecked } = this
      const {
        vcTree: { checkStrictly, isKeyChecked, onBatchNodeCheck, onCheckConductFinished },
        vcTreeNode: { onUpCheckConduct } = {},
      } = this

      // Stop conduct when current node is disabled
      if (isCheckDisabled(this)) {
        onCheckConductFinished(e)
        return
      }

      const children = this.getNodeChildren()

      let checkedCount = nodeChecked ? 1 : 0

      // Statistic checked count
      children.forEach((node, index) => {
        const childPos = getPosition(pos, index)

        if (nodePos === childPos || isCheckDisabled(node)) {
          return
        }
        if (isKeyChecked(node.key || childPos)) {
          checkedCount += 1
        }
      })

      // Static enabled children count
      const enabledChildrenCount = children
        .filter(node => !isCheckDisabled(node))
        .length

      // checkStrictly will not conduct check status
      const nextChecked = checkStrictly ? checked : enabledChildrenCount === checkedCount
      const nextHalfChecked = checkStrictly // propagated or child checked
        ? halfChecked : (nodeHalfChecked || (checkedCount > 0 && !nextChecked))

      // Add into batch update
      if (checked !== nextChecked || halfChecked !== nextHalfChecked) {
        onBatchNodeCheck(eventKey, nextChecked, nextHalfChecked)

        if (onUpCheckConduct) {
          onUpCheckConduct(this, nextChecked, nextHalfChecked, e)
        } else {
          // Flush all the update
          onCheckConductFinished(e)
        }
      } else {
        // Flush all the update
        onCheckConductFinished(e)
      }
    },

    onDownCheckConduct (nodeChecked) {
      const { $slots } = this
      const children = $slots.default || []
      const { vcTree: { checkStrictly, isKeyChecked, onBatchNodeCheck }} = this
      if (checkStrictly) return

      traverseTreeNodes(children, ({ node, key }) => {
        if (isCheckDisabled(node)) return false

        if (nodeChecked !== isKeyChecked(key)) {
          onBatchNodeCheck(key, nodeChecked, false)
        }
      })
    },

    onSelectorClick (e) {
      // Click trigger before select/check operation
      const { vcTree: { onNodeClick }} = this
      onNodeClick(e, this)
      if (this.isSelectable()) {
        this.onSelect(e)
      } else {
        this.onCheck(e)
      }
    },

    onSelectorDoubleClick (e) {
      const { vcTree: { onNodeDoubleClick }} = this
      onNodeDoubleClick(e, this)
    },

    onSelect (e) {
      if (this.isDisabled()) return

      const { vcTree: { onNodeSelect }} = this
      e.preventDefault()
      onNodeSelect(e, this)
    },

    onCheck (e) {
      if (this.isDisabled()) return

      const { disableCheckbox, checked, eventKey } = this
      const {
        vcTree: { checkable, onBatchNodeCheck, onCheckConductFinished },
        vcTreeNode: { onUpCheckConduct } = {},
      } = this

      if (!checkable || disableCheckbox) return

      e.preventDefault()
      const targetChecked = !checked
      onBatchNodeCheck(eventKey, targetChecked, false, this)

      // Children conduct
      this.onDownCheckConduct(targetChecked)

      // Parent conduct
      if (onUpCheckConduct) {
        onUpCheckConduct(this, targetChecked, false, e)
      } else {
        onCheckConductFinished(e)
      }
    },

    onMouseEnter (e) {
      const { vcTree: { onNodeMouseEnter }} = this
      onNodeMouseEnter(e, this)
    },

    onMouseLeave (e) {
      const { vcTree: { onNodeMouseLeave }} = this
      onNodeMouseLeave(e, this)
    },

    onContextMenu  (e) {
      const { vcTree: { onNodeContextMenu }} = this
      onNodeContextMenu(e, this)
    },

    onDragStart  (e) {
      const { vcTree: { onNodeDragStart }} = this

      e.stopPropagation()
      this.setState({
        dragNodeHighlight: true,
      })
      onNodeDragStart(e, this)

      try {
        // ie throw error
        // firefox-need-it
        e.dataTransfer.setData('text/plain', '')
      } catch (error) {
        // empty
      }
    },

    onDragEnter  (e) {
      const { vcTree: { onNodeDragEnter }} = this

      e.preventDefault()
      e.stopPropagation()
      onNodeDragEnter(e, this)
    },

    onDragOver (e) {
      const { vcTree: { onNodeDragOver }} = this

      e.preventDefault()
      e.stopPropagation()
      onNodeDragOver(e, this)
    },

    onDragLeave (e) {
      const { vcTree: { onNodeDragLeave }} = this

      e.stopPropagation()
      onNodeDragLeave(e, this)
    },

    onDragEnd (e) {
      const { vcTree: { onNodeDragEnd }} = this

      e.stopPropagation()
      this.setState({
        dragNodeHighlight: false,
      })
      onNodeDragEnd(e, this)
    },

    onDrop (e) {
      const { vcTree: { onNodeDrop }} = this

      e.preventDefault()
      e.stopPropagation()
      this.setState({
        dragNodeHighlight: false,
      })
      onNodeDrop(e, this)
    },

    // Disabled item still can be switch
    onExpand (e) {
      const { vcTree: { onNodeExpand }} = this
      onNodeExpand(e, this)
    },

    getNodeChildren () {
      const { $slots: { default: children }} = this
      const originList = filterEmpty(children)
      const targetList = getNodeChildren(originList)

      if (originList.length !== targetList.length && !onlyTreeNodeWarned) {
        onlyTreeNodeWarned = true
        warning(false, 'Tree only accept TreeNode as children.')
      }

      return targetList
    },

    getNodeState () {
      const { expanded } = this

      if (this.isLeaf2()) {
        return null
      }

      return expanded ? ICON_OPEN : ICON_CLOSE
    },

    isLeaf2 () {
      const { isLeaf, loaded } = this
      const { vcTree: { loadData }} = this

      const hasChildren = this.getNodeChildren().length !== 0
      if (isLeaf === false) {
        return false
      }
      return (
        isLeaf ||
        (!loadData && !hasChildren) ||
        (loadData && loaded && !hasChildren)
      )
    },

    isDisabled  () {
      const { disabled } = this
      const { vcTree: { disabled: treeDisabled }} = this

      // Follow the logic of Selectable
      if (disabled === false) {
        return false
      }

      return !!(treeDisabled || disabled)
    },

    isSelectable () {
      const { selectable } = this
      const { vcTree: { selectable: treeSelectable }} = this

      // Ignore when selectable is undefined or null
      if (typeof selectable === 'boolean') {
        return selectable
      }

      return treeSelectable
    },

    // Load data to avoid default expanded tree without data
    syncLoadData (props) {
      const { expanded } = this
      const { vcTree: { onNodeLoad }} = this

      // read from state to avoid loadData at same time
      if (expanded && !this.isLeaf2()) {
        // We needn't reload data when has children in sync logic
        // It's only needed in node expanded
        const hasChildren = this.getNodeChildren().length !== 0
        if (!hasChildren) {
          onNodeLoad(this)
        }
      }
    },

    // Switcher
    renderSwitcher () {
      const { expanded } = this
      const { vcTree: { prefixCls }} = this

      if (this.isLeaf2()) {
        return <span class={`${prefixCls}-switcher ${prefixCls}-switcher-noop`} />
      }

      return (
        <span
          class={classNames(
            `${prefixCls}-switcher`,
            `${prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`,
          )}
          onClick={this.onExpand}
        />
      )
    },

    // Checkbox
    renderCheckbox () {
      const { checked, halfChecked, disableCheckbox } = this
      const { vcTree: { prefixCls, checkable }} = this
      const disabled = this.isDisabled()

      if (!checkable) return null

      // [Legacy] Custom element should be separate with `checkable` in future
      const $custom = typeof checkable !== 'boolean' ? checkable : null

      return (
        <span
          class={classNames(
            `${prefixCls}-checkbox`,
            checked && `${prefixCls}-checkbox-checked`,
            !checked && halfChecked && `${prefixCls}-checkbox-indeterminate`,
            (disabled || disableCheckbox) && `${prefixCls}-checkbox-disabled`,
          )}
          onClick={this.onCheck}
        >
          {$custom}
        </span>
      )
    },

    renderIcon () {
      const { loading } = this
      const { vcTree: { prefixCls }} = this

      return (
        <span
          class={classNames(
            `${prefixCls}-iconEle`,
            `${prefixCls}-icon__${this.getNodeState() || 'docu'}`,
            loading && `${prefixCls}-icon_loading`,
          )}
        />
      )
    },

    // Icon + Title
    renderSelector () {
      const { selected, icon, loading, dragNodeHighlight, $scopedSlots } = this
      const { vcTree: { prefixCls, showIcon, draggable, loadData }} = this
      const disabled = this.isDisabled()
      const title = getComponentFromProp(this, 'title') || defaultTitle
      const treeIcon = getComponentFromProp(this, 'icon') || $scopedSlots.icon
      const wrapClass = `${prefixCls}-node-content-wrapper`

      // Icon - Still show loading icon when loading without showIcon
      let $icon

      if (showIcon) {
        const currentIcon = icon || treeIcon
        $icon = currentIcon ? (
          <span
            class={classNames(
              `${prefixCls}-iconEle`,
              `${prefixCls}-icon__customize`,
            )}
          >
            {typeof currentIcon === 'function'
              ? currentIcon({ ...this.$props }) : currentIcon}
          </span>
        ) : this.renderIcon()
      } else if (loadData && loading) {
        $icon = this.renderIcon()
      }

      // Title
      const $title = <span class={`${prefixCls}-title`}>{title}</span>

      return (
        <span
          ref='selectHandle'
          title={typeof title === 'string' ? title : ''}
          class={classNames(
            `${wrapClass}`,
            `${wrapClass}-${this.getNodeState() || 'normal'}`,
            (!disabled && (selected || dragNodeHighlight)) && `${prefixCls}-node-selected`,
            (!disabled && draggable) && 'draggable'
          )}
          draggable={(!disabled && draggable) || undefined}
          aria-grabbed={(!disabled && draggable) || undefined}
          onMouseenter={this.onMouseEnter}
          onMouseleave={this.onMouseLeave}
          onContextmenu={this.onContextMenu}
          onClick={this.onSelectorClick}
          onDoubleclick={this.onSelectorDoubleClick}
          onDragstart={draggable ? this.onDragStart : noop}
        >
          {$icon}{$title}
        </span>
      )
    },

    // Children list wrapped with `Animation`
    renderChildren () {
      const { expanded, pos } = this
      const { vcTree: {
        prefixCls,
        openTransitionName, openAnimation,
        renderTreeNode,
      }} = this

      // [Legacy] Animation control
      const renderFirst = this.renderFirst
      this.renderFirst = 1
      let transitionAppear = true
      if (!renderFirst && expanded) {
        transitionAppear = false
      }

      let animProps = {}
      if (openTransitionName) {
        animProps = getTransitionProps(openTransitionName, { appear: transitionAppear })
      } else if (typeof openAnimation === 'object') {
        animProps = { ...openAnimation }
        animProps.props = { css: false, ...animProps.props }
        if (!transitionAppear) {
          delete animProps.props.appear
        }
      }

      // Children TreeNode
      const nodeList = this.getNodeChildren()

      if (nodeList.length === 0) {
        return null
      }

      let $children
      if (expanded) {
        $children = (
          <ul
            class={classNames(
              `${prefixCls}-child-tree`,
              expanded && `${prefixCls}-child-tree-open`,
            )}
            data-expanded={expanded}
          >
            {mapChildren(nodeList, (node, index) => (
              renderTreeNode(node, index, pos)
            ))}
          </ul>
        )
      }

      return (
        <transition
          {...animProps}
        >
          {$children}
        </transition>
      )
    },
  },

  render () {
    const {
      dragOver, dragOverGapTop, dragOverGapBottom,
      isLeaf,
      expanded, selected, checked, halfChecked, loading,
    } = this.$props
    const { vcTree: {
      prefixCls,
      filterTreeNode,
      draggable,
    }} = this
    const disabled = this.isDisabled()
    return (
      <li
        class={{
          [`${prefixCls}-treenode-disabled`]: disabled,
          [`${prefixCls}-treenode-switcher-${expanded ? 'open' : 'close'}`]: !isLeaf,
          [`${prefixCls}-treenode-checkbox-checked`]: checked,
          [`${prefixCls}-treenode-checkbox-indeterminate`]: halfChecked,
          [`${prefixCls}-treenode-selected`]: selected,
          [`${prefixCls}-treenode-loading`]: loading,
          'drag-over': !disabled && dragOver,
          'drag-over-gap-top': !disabled && dragOverGapTop,
          'drag-over-gap-bottom': !disabled && dragOverGapBottom,
          'filter-node': filterTreeNode && filterTreeNode(this),
        }}
        onDragenter={draggable ? this.onDragEnter : noop}
        onDragover={draggable ? this.onDragOver : noop}
        onDragleave={draggable ? this.onDragLeave : noop}
        onDrop={draggable ? this.onDrop : noop}
        onDragend={draggable ? this.onDragEnd : noop}
      >
        {this.renderSwitcher()}
        {this.renderCheckbox()}
        {this.renderSelector()}
        {this.renderChildren()}
      </li>
    )
  },
}

TreeNode.isTreeNode = 1

export default TreeNode
