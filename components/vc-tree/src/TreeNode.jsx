import PropTypes from '../../_util/vue-types'
import classNames from 'classnames'
import warning from 'warning'
import { contextTypes } from './Tree'
import { getPosition, getNodeChildren, isCheckDisabled, traverseTreeNodes } from './util'
import { initDefaultProps, getOptionProps, filterEmpty } from '../../_util/props-util'

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
  rcTreeNode: PropTypes.shape({
    onUpCheckConduct: PropTypes.func,
  }),
}

const TreeNode = {
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
    title: PropTypes.node,
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
    context: { default: {}},
  },
  provide: {
    ...this.context,
    rcTreeNode: this,
  },

  // Isomorphic needn't load data in server side
  mounted () {
    this.$nextTick(() => {
      this.syncLoadData(this.$props)
    })
  },

  componentWillReceiveProps (nextProps) {
    this.syncLoadData(nextProps)
  },

  onUpCheckConduct (treeNode, nodeChecked, nodeHalfChecked) {
    const { pos: nodePos } = getOptionProps(treeNode)
    const { eventKey, pos, checked, halfChecked } = this
    const {
      rcTree: { checkStrictly, isKeyChecked, onBatchNodeCheck, onCheckConductFinished },
      rcTreeNode: { onUpCheckConduct } = {},
    } = this.context

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
    const { rcTree: { checkStrictly, isKeyChecked, onBatchNodeCheck }} = this.context
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

    const { rcTree: { onNodeSelect }} = this.context
    e.preventDefault()
    onNodeSelect(e, this)
  },

  onCheck (e) {
    if (this.isDisabled()) return

    const { disableCheckbox, checked, eventKey } = this
    const {
      rcTree: { checkable, onBatchNodeCheck, onCheckConductFinished },
      rcTreeNode: { onUpCheckConduct } = {},
    } = this.context

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
    const { rcTree: { onNodeMouseEnter }} = this.context
    onNodeMouseEnter(e, this)
  },

  onMouseLeave (e) {
    const { rcTree: { onNodeMouseLeave }} = this.context
    onNodeMouseLeave(e, this)
  },

  onContextMenu  (e) {
    const { rcTree: { onNodeContextMenu }} = this.context
    onNodeContextMenu(e, this)
  },

  onDragStart  (e) {
    const { rcTree: { onNodeDragStart }} = this.context

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
    const { rcTree: { onNodeDragEnter }} = this.context

    e.preventDefault()
    e.stopPropagation()
    onNodeDragEnter(e, this)
  },

  onDragOver (e) {
    const { rcTree: { onNodeDragOver }} = this.context

    e.preventDefault()
    e.stopPropagation()
    onNodeDragOver(e, this)
  },

  onDragLeave (e) {
    const { rcTree: { onNodeDragLeave }} = this.context

    e.stopPropagation()
    onNodeDragLeave(e, this)
  },

  onDragEnd (e) {
    const { rcTree: { onNodeDragEnd }} = this.context

    e.stopPropagation()
    this.setState({
      dragNodeHighlight: false,
    })
    onNodeDragEnd(e, this)
  },

  onDrop (e) {
    const { rcTree: { onNodeDrop }} = this.context

    e.preventDefault()
    e.stopPropagation()
    this.setState({
      dragNodeHighlight: false,
    })
    onNodeDrop(e, this)
  },

  // Disabled item still can be switch
  onExpand (e) {
    const { rcTree: { onNodeExpand }} = this.context
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

    if (this.isLeaf()) {
      return null
    }

    return expanded ? ICON_OPEN : ICON_CLOSE
  },

  isLeaf () {
    const { isLeaf, loadStatus } = this
    const { rcTree: { loadData }} = this.context

    const hasChildren = this.getNodeChildren().length !== 0

    return (
      isLeaf ||
      (!loadData && !hasChildren) ||
      (loadData && loadStatus === LOAD_STATUS_LOADED && !hasChildren)
    )
  },

  isDisabled  () {
    const { disabled } = this
    const { rcTree: { disabled: treeDisabled }} = this.context

    // Follow the logic of Selectable
    if (disabled === false) {
      return false
    }

    return !!(treeDisabled || disabled)
  },

  isSelectable () {
    const { selectable } = this
    const { rcTree: { selectable: treeSelectable }} = this.context

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
    const { rcTree: { loadData }} = this.context

    if (loadData && loadStatus === LOAD_STATUS_NONE && expanded && !this.isLeaf()) {
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
    const { rcTree: { prefixCls }} = this.context

    if (this.isLeaf()) {
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
    const { rcTree: { prefixCls, checkable }} = this.context
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
    const { rcTree: { prefixCls }} = this.context

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
    const { rcTree: { prefixCls, showIcon, draggable, loadData }} = this.context
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
    const { rcTree: {
      prefixCls,
      openTransitionName, openAnimation,
      renderTreeNode,
    }} = this.context

    // [Legacy] Animation control
    const renderFirst = this.renderFirst
    this.renderFirst = 1
    let transitionAppear = true
    if (!renderFirst && expanded) {
      transitionAppear = false
    }

    const animProps = {}
    if (openTransitionName) {
      animProps.transitionName = openTransitionName
    } else if (typeof openAnimation === 'object') {
      animProps.animation = { ...openAnimation }
      if (!transitionAppear) {
        delete animProps.animation.appear
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
          {nodeList.map((node, index) => (
            renderTreeNode(node, index, pos)
          ))}
        </ul>
      )
    }

    return (
      <Animate
        {...animProps}
        showProp='data-expanded'
        transitionAppear={transitionAppear}
        component=''
      >
        {$children}
      </Animate>
    )
  },

  render () {
    const {
      dragOver, dragOverGapTop, dragOverGapBottom,
    } = this
    const { rcTree: {
      prefixCls,
      filterTreeNode,
    }} = this.context
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
