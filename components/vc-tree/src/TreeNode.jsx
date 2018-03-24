import PropTypes from '../../_util/vue-types'
import classNames from 'classnames'
import warning from 'warning'
import { contextTypes } from './Tree'
import { getPosition, getNodeChildren, isCheckDisabled, traverseTreeNodes } from './util'
import { initDefaultProps, getOptionProps, filterEmpty } from '../../_util/props-util'
import BaseMixin from '../../_util/BaseMixin'
import getTransitionProps from '../../_util/getTransitionProps'

const ICON_OPEN = 'open'
const ICON_CLOSE = 'close'

const LOAD_STATUS_NONE = 0
const LOAD_STATUS_LOADING = 1
const LOAD_STATUS_LOADED = 2
const LOAD_STATUS_FAILED = 0 // Action align, let's make failed same as init.

const defaultTitle = '---'

let onlyTreeNodeWarned = false // Only accept TreeNode

export const nodeContextTypes = {
  ...contextTypes,
  vcTreeNode: PropTypes.shape({
    onUpCheckConduct: PropTypes.func,
  }),
}

const TreeNode = {
  name: 'TreeNode',
  mixins: [BaseMixin],
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
  }, {
    title: defaultTitle,
  }),

  data () {
    return {
      loadStatus: LOAD_STATUS_NONE,
      dragNodeHighlight: false,
    }
  },
  inject: {
    vcTree: { default: {}},
  },
  provide () {
    return {
      vcTree: this.vcTree,
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
    onUpCheckConduct (treeNode, nodeChecked, nodeHalfChecked) {
      const { pos: nodePos } = getOptionProps(treeNode)
      const { eventKey, pos, checked, halfChecked } = this
      const {
        vcTree: { checkStrictly, isKeyChecked, onBatchNodeCheck, onCheckConductFinished },
        vcTreeNode: { onUpCheckConduct } = {},
      } = this

      // Stop conduct when current node is disabled
      if (isCheckDisabled(this)) {
        onCheckConductFinished()
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
          onUpCheckConduct(this, nextChecked, nextHalfChecked)
        } else {
          // Flush all the update
          onCheckConductFinished()
        }
      } else {
        // Flush all the update
        onCheckConductFinished()
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
      if (this.isSelectable()) {
        this.onSelect(e)
      } else {
        this.onCheck(e)
      }
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
        onUpCheckConduct(this, targetChecked, false)
      } else {
        onCheckConductFinished()
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
      const callbackPromise = onNodeExpand(e, this)

      // Promise like
      if (callbackPromise && callbackPromise.then) {
        this.setState({ loadStatus: LOAD_STATUS_LOADING })

        callbackPromise.then(() => {
          this.setState({ loadStatus: LOAD_STATUS_LOADED })
        }).catch(() => {
          this.setState({ loadStatus: LOAD_STATUS_FAILED })
        })
      }
    },

    // Drag usage
    setSelectHandle (node) {
      this.selectHandle = node
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
      const { isLeaf, loadStatus } = this
      const { vcTree: { loadData }} = this

      const hasChildren = this.getNodeChildren().length !== 0

      return (
        isLeaf ||
        (!loadData && !hasChildren) ||
        (loadData && loadStatus === LOAD_STATUS_LOADED && !hasChildren)
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
      const { loadStatus } = this
      const { expanded } = props
      const { vcTree: { loadData }} = this

      if (loadData && loadStatus === LOAD_STATUS_NONE && expanded && !this.isLeaf2()) {
        this.setState({ loadStatus: LOAD_STATUS_LOADING })

        loadData(this).then(() => {
          this.setState({ loadStatus: LOAD_STATUS_LOADED })
        }).catch(() => {
          this.setState({ loadStatus: LOAD_STATUS_FAILED })
        })
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
      const { loadStatus } = this
      const { vcTree: { prefixCls }} = this

      return (
        <span
          class={classNames(
            `${prefixCls}-iconEle`,
            `${prefixCls}-icon__${this.getNodeState() || 'docu'}`,
            (loadStatus === LOAD_STATUS_LOADING) && `${prefixCls}-icon_loading`,
          )}
        />
      )
    },

    // Icon + Title
    renderSelector () {
      const { title, selected, icon, loadStatus, dragNodeHighlight } = this
      const { vcTree: { prefixCls, showIcon, draggable, loadData }} = this
      const disabled = this.isDisabled()

      const wrapClass = `${prefixCls}-node-content-wrapper`

      // Icon - Still show loading icon when loading without showIcon
      let $icon

      if (showIcon) {
        $icon = icon ? (
          <span
            class={classNames(
              `${prefixCls}-iconEle`,
              `${prefixCls}-icon__customize`,
            )}
          >
            {typeof icon === 'function'
              ? icon(this.$props) : icon}
          </span>
        ) : this.renderIcon()
      } else if (loadData && loadStatus === LOAD_STATUS_LOADING) {
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
          onContexmenu={this.onContextMenu}
          onClick={this.onSelectorClick}
          onDragstart={this.onDragStart}
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
            v-show={expanded}
            class={classNames(
              `${prefixCls}-child-tree`,
              expanded && `${prefixCls}-child-tree-open`,
            )}
            data-expanded={expanded}
          >
            {nodeList.map((node, index) => (
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
    } = this
    const { vcTree: {
      prefixCls,
      filterTreeNode,
    }} = this
    const disabled = this.isDisabled()

    return (
      <li
        class={{
          [`${prefixCls}-treenode-disabled`]: disabled,
          'drag-over': !disabled && dragOver,
          'drag-over-gap-top': !disabled && dragOverGapTop,
          'drag-over-gap-bottom': !disabled && dragOverGapBottom,
          'filter-node': filterTreeNode && filterTreeNode(this),
        }}
        onDragenter={this.onDragEnter}
        onDragover={this.onDragOver}
        onDragleave={this.onDragLeave}
        onDrop={this.onDrop}
        onDragend={this.onDragEnd}
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
