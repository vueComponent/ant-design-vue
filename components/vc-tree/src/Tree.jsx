import PropTypes from '../../_util/vue-types'
import classNames from 'classnames'
import warning from 'warning'
import { initDefaultProps, getOptionProps, filterEmpty } from '../../_util/props-util'
import {
  traverseTreeNodes, getStrictlyValue,
  getFullKeyList, getPosition, getDragNodesKeys,
  calcExpandedKeys, calcSelectedKeys,
  calcCheckedKeys, calcDropPosition,
  arrAdd, arrDel, posToArr,
} from './util'

/**
 * Thought we still use `cloneElement` to pass `key`,
 * other props can pass with context for future refactor.
 */
export const contextTypes = {
  rcTree: PropTypes.shape({
    root: PropTypes.object,

    prefixCls: PropTypes.string,
    selectable: PropTypes.bool,
    showIcon: PropTypes.bool,
    draggable: PropTypes.bool,
    checkable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    checkStrictly: PropTypes.bool,
    disabled: PropTypes.bool,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    loadData: PropTypes.func,
    filterTreeNode: PropTypes.func,
    renderTreeNode: PropTypes.func,

    isKeyChecked: PropTypes.func,

    // onNodeExpand: PropTypes.func,
    // onNodeSelect: PropTypes.func,
    // onNodeMouseEnter: PropTypes.func,
    // onNodeMouseLeave: PropTypes.func,
    // onNodeContextMenu: PropTypes.func,
    // onNodeDragStart: PropTypes.func,
    // onNodeDragEnter: PropTypes.func,
    // onNodeDragOver: PropTypes.func,
    // onNodeDragLeave: PropTypes.func,
    // onNodeDragEnd: PropTypes.func,
    // onNodeDrop: PropTypes.func,
    // onBatchNodeCheck: PropTypes.func,
    // onCheckConductFinished: PropTypes.func,
  }),
}

const Tree = {
  props: initDefaultProps({
    prefixCls: PropTypes.string,
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    focusable: PropTypes.bool,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    checkable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node,
    ]),
    checkStrictly: PropTypes.bool,
    draggable: PropTypes.bool,
    autoExpandParent: PropTypes.bool,
    defaultExpandAll: PropTypes.bool,
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
    checkedKeys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.object,
    ]),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    //onExpand: PropTypes.func,
    //onCheck: PropTypes.func,
    //onSelect: PropTypes.func,
    loadData: PropTypes.func,
    // onMouseEnter: PropTypes.func,
    // onMouseLeave: PropTypes.func,
    // onRightClick: PropTypes.func,
    // onDragStart: PropTypes.func,
    // onDragEnter: PropTypes.func,
    // onDragOver: PropTypes.func,
    // onDragLeave: PropTypes.func,
    // onDragEnd: PropTypes.func,
    // onDrop: PropTypes.func,
    filterTreeNode: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }, {
    prefixCls: 'rc-tree',
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    disabled: false,
    checkStrictly: false,
    draggable: false,
    autoExpandParent: true,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
  }),

  // static childContextTypes = contextTypes;

  data () {
    const props = getOptionProps(this)
    const {
      defaultExpandAll,
      defaultExpandedKeys,
      defaultCheckedKeys,
      defaultSelectedKeys,
    } = props

    // Sync state with props
    const { checkedKeys = [], halfCheckedKeys = [] } =
      calcCheckedKeys(defaultCheckedKeys, props) || {}

    // Cache for check status to optimize
    this.checkedBatch = null

    return {
      sExpandedKeys: defaultExpandAll
        ? getFullKeyList(this.$slots.default)
        : calcExpandedKeys(defaultExpandedKeys, props),
      sSelectedKeys: calcSelectedKeys(defaultSelectedKeys, props),
      sCheckedKeys,
      sHalfCheckedKeys,

      ...(this.getSyncProps(props) || {}),
    } 
  },
  provide: {
    rcTree: this,
  },


  componentWillReceiveProps (nextProps) {
    // React 16 will not trigger update if new state is null
    this.setState(this.getSyncProps(nextProps, this.props))
  },

  onNodeDragStart (event, node) {
    const { expandedKeys } = this.state
    const { onDragStart } = this.props
    const { eventKey, children } = node.props

    this.dragNode = node

    this.setState({
      dragNodesKeys: getDragNodesKeys(children, node),
      expandedKeys: arrDel(expandedKeys, eventKey),
    })

    if (onDragStart) {
      onDragStart({ event, node })
    }
  },

  /**
   * [Legacy] Select handler is less small than node,
   * so that this will trigger when drag enter node or select handler.
   * This is a little tricky if customize css without padding.
   * Better for use mouse move event to refresh drag state.
   * But let's just keep it to avoid event trigger logic change.
   */
  onNodeDragEnter = (event, node) => {
    const { expandedKeys } = this.state
    const { onDragEnter } = this.props
    const { pos, eventKey } = node.props

    const dropPosition = calcDropPosition(event, node)

    // Skip if drag node is self
    if (
      this.dragNode.props.eventKey === eventKey &&
      dropPosition === 0
    ) {
      this.setState({
        dragOverNodeKey: '',
        dropPosition: null,
      })
      return
    }

    // Ref: https://github.com/react-component/tree/issues/132
    // Add timeout to let onDragLevel fire before onDragEnter,
    // so that we can clean drag props for onDragLeave node.
    // Macro task for this:
    // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script
    setTimeout(() => {
      // Update drag over node
      this.setState({
        dragOverNodeKey: eventKey,
        dropPosition,
      })

      // Side effect for delay drag
      if (!this.delayedDragEnterLogic) {
        this.delayedDragEnterLogic = {}
      }
      Object.keys(this.delayedDragEnterLogic).forEach((key) => {
        clearTimeout(this.delayedDragEnterLogic[key])
      })
      this.delayedDragEnterLogic[pos] = setTimeout(() => {
        const newExpandedKeys = arrAdd(expandedKeys, eventKey)
        this.setState({
          expandedKeys: newExpandedKeys,
        })

        if (onDragEnter) {
          onDragEnter({ event, node, expandedKeys: newExpandedKeys })
        }
      }, 400)
    }, 0)
  };
  onNodeDragOver = (event, node) => {
    const { onDragOver } = this.props
    if (onDragOver) {
      onDragOver({ event, node })
    }
  };
  onNodeDragLeave = (event, node) => {
    const { onDragLeave } = this.props

    this.setState({
      dragOverNodeKey: '',
    })

    if (onDragLeave) {
      onDragLeave({ event, node })
    }
  };
  onNodeDragEnd = (event, node) => {
    const { onDragEnd } = this.props
    this.setState({
      dragOverNodeKey: '',
    })
    if (onDragEnd) {
      onDragEnd({ event, node })
    }
  };
  onNodeDrop = (event, node) => {
    const { dragNodesKeys, dropPosition } = this.state
    const { onDrop } = this.props
    const { eventKey, pos } = node.props

    this.setState({
      dragOverNodeKey: '',
      dropNodeKey: eventKey,
    })

    if (dragNodesKeys.indexOf(eventKey) !== -1) {
      warning(false, 'Can not drop to dragNode(include it\'s children node)')
      return
    }

    const posArr = posToArr(pos)

    const dropResult = {
      event,
      node,
      dragNode: this.dragNode,
      dragNodesKeys: dragNodesKeys.slice(),
      dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
    }

    if (dropPosition !== 0) {
      dropResult.dropToGap = true
    }

    if (onDrop) {
      onDrop(dropResult)
    }
  };

  onNodeSelect = (e, treeNode) => {
    let { selectedKeys } = this.state
    const { onSelect, multiple, children } = this.props
    const { selected, eventKey } = treeNode.props
    const targetSelected = !selected

    // Update selected keys
    if (!targetSelected) {
      selectedKeys = arrDel(selectedKeys, eventKey)
    } else if (!multiple) {
      selectedKeys = [eventKey]
    } else {
      selectedKeys = arrAdd(selectedKeys, eventKey)
    }

    // [Legacy] Not found related usage in doc or upper libs
    // [Legacy] TODO: add optimize prop to skip node process
    const selectedNodes = []
    if (selectedKeys.length) {
      traverseTreeNodes(children, ({ node, key }) => {
        if (selectedKeys.indexOf(key) !== -1) {
          selectedNodes.push(node)
        }
      })
    }

    this.setUncontrolledState({ selectedKeys })

    if (onSelect) {
      const eventObj = {
        event: 'select',
        selected: targetSelected,
        node: treeNode,
        selectedNodes,
      }
      onSelect(selectedKeys, eventObj)
    }
  };

  /**
   * This will cache node check status to optimize update process.
   * When Tree get trigger `onCheckConductFinished` will flush all the update.
   */
  onBatchNodeCheck = (key, checked, halfChecked, startNode) => {
    if (startNode) {
      this.checkedBatch = {
        treeNode: startNode,
        checked,
        list: [],
      }
    }

    // This code should never called
    if (!this.checkedBatch) {
      this.checkedBatch = {
        list: [],
      }
      warning(
        false,
        'Checked batch not init. This should be a bug. Please fire a issue.'
      )
    }

    this.checkedBatch.list.push({ key, checked, halfChecked })
  };

  /**
   * When top `onCheckConductFinished` called, will execute all batch update.
   * And trigger `onCheck` event.
   */
  onCheckConductFinished = () => {
    const { checkedKeys, halfCheckedKeys } = this.state
    const { onCheck, checkStrictly, children } = this.props

    // Use map to optimize update speed
    const checkedKeySet = {}
    const halfCheckedKeySet = {}

    checkedKeys.forEach(key => {
      checkedKeySet[key] = true
    })
    halfCheckedKeys.forEach(key => {
      halfCheckedKeySet[key] = true
    })

    // Batch process
    this.checkedBatch.list.forEach(({ key, checked, halfChecked }) => {
      checkedKeySet[key] = checked
      halfCheckedKeySet[key] = halfChecked
    })
    const newCheckedKeys = Object.keys(checkedKeySet).filter(key => checkedKeySet[key])
    const newHalfCheckedKeys = Object.keys(halfCheckedKeySet).filter(key => halfCheckedKeySet[key])

    // Trigger onChecked
    let selectedObj

    const eventObj = {
      event: 'check',
      node: this.checkedBatch.treeNode,
      checked: this.checkedBatch.checked,
    }

    if (checkStrictly) {
      selectedObj = getStrictlyValue(newCheckedKeys, newHalfCheckedKeys)

      // [Legacy] TODO: add optimize prop to skip node process
      eventObj.checkedNodes = []
      traverseTreeNodes(children, ({ node, key }) => {
        if (checkedKeySet[key]) {
          eventObj.checkedNodes.push(node)
        }
      })

      this.setUncontrolledState({ checkedKeys: newCheckedKeys })
    } else {
      selectedObj = newCheckedKeys

      // [Legacy] TODO: add optimize prop to skip node process
      eventObj.checkedNodes = []
      eventObj.checkedNodesPositions = [] // [Legacy] TODO: not in API
      eventObj.halfCheckedKeys = newHalfCheckedKeys // [Legacy] TODO: not in API
      traverseTreeNodes(children, ({ node, pos, key }) => {
        if (checkedKeySet[key]) {
          eventObj.checkedNodes.push(node)
          eventObj.checkedNodesPositions.push({ node, pos })
        }
      })

      this.setUncontrolledState({
        checkedKeys: newCheckedKeys,
        halfCheckedKeys: newHalfCheckedKeys,
      })
    }

    if (onCheck) {
      onCheck(selectedObj, eventObj)
    }

    // Clean up
    this.checkedBatch = null
  };

  onNodeExpand = (e, treeNode) => {
    let { expandedKeys } = this.state
    const { onExpand, loadData } = this.props
    const { eventKey, expanded } = treeNode.props

    // Update selected keys
    const index = expandedKeys.indexOf(eventKey)
    const targetExpanded = !expanded

    warning(
      (expanded && index !== -1) || (!expanded && index === -1)
      , 'Expand state not sync with index check')

    if (targetExpanded) {
      expandedKeys = arrAdd(expandedKeys, eventKey)
    } else {
      expandedKeys = arrDel(expandedKeys, eventKey)
    }

    this.setUncontrolledState({ expandedKeys })

    if (onExpand) {
      onExpand(expandedKeys, { node: treeNode, expanded: targetExpanded })
    }

    // Async Load data
    if (targetExpanded && loadData) {
      return loadData(treeNode).then(() => {
        // [Legacy] Refresh logic
        this.setUncontrolledState({ expandedKeys })
      })
    }

    return null
  };

  onNodeMouseEnter = (event, node) => {
    const { onMouseEnter } = this.props
    if (onMouseEnter) {
      onMouseEnter({ event, node })
    }
  };

  onNodeMouseLeave = (event, node) => {
    const { onMouseLeave } = this.props
    if (onMouseLeave) {
      onMouseLeave({ event, node })
    }
  };

  onNodeContextMenu = (event, node) => {
    const { onRightClick } = this.props
    if (onRightClick) {
      event.preventDefault()
      onRightClick({ event, node })
    }
  };

  /**
   * Sync state with props if needed
   */
  getSyncProps = (props = {}, prevProps) => {
    let needSync = false
    const newState = {}
    const myPrevProps = prevProps || {}

    function checkSync (name) {
      if (props[name] !== myPrevProps[name]) {
        needSync = true
        return true
      }
      return false
    }

    // Children change will affect check box status.
    // And no need to check when prev props not provided
    if (prevProps && checkSync('children')) {
      const { checkedKeys = [], halfCheckedKeys = [] } =
        calcCheckedKeys(props.checkedKeys || this.state.checkedKeys, props) || {}
      newState.checkedKeys = checkedKeys
      newState.halfCheckedKeys = halfCheckedKeys
    }

    if (checkSync('expandedKeys')) {
      newState.expandedKeys = calcExpandedKeys(props.expandedKeys, props)
    }

    if (checkSync('selectedKeys')) {
      newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props)
    }

    if (checkSync('checkedKeys')) {
      const { checkedKeys = [], halfCheckedKeys = [] } =
      calcCheckedKeys(props.checkedKeys, props) || {}
      newState.checkedKeys = checkedKeys
      newState.halfCheckedKeys = halfCheckedKeys
    }

    return needSync ? newState : null
  };

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = (state) => {
    let needSync = false
    const newState = {}

    Object.keys(state).forEach(name => {
      if (name in this.props) return

      needSync = true
      newState[name] = state[name]
    })

    this.setState(needSync ? newState : null)
  };

  isKeyChecked = (key) => {
    const { checkedKeys = [] } = this.state
    return checkedKeys.indexOf(key) !== -1
  };

  /**
   * [Legacy] Original logic use `key` as tracking clue.
   * We have to use `cloneElement` to pass `key`.
   */
  renderTreeNode = (child, index, level = 0) => {
    const {
      expandedKeys = [], selectedKeys = [], halfCheckedKeys = [],
      dragOverNodeKey, dropPosition,
    } = this.state
    const {} = this.props
    const pos = getPosition(level, index)
    const key = child.key || pos

    return React.cloneElement(child, {
      eventKey: key,
      expanded: expandedKeys.indexOf(key) !== -1,
      selected: selectedKeys.indexOf(key) !== -1,
      checked: this.isKeyChecked(key),
      halfChecked: halfCheckedKeys.indexOf(key) !== -1,
      pos,

      // [Legacy] Drag props
      dragOver: dragOverNodeKey === key && dropPosition === 0,
      dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
      dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1,
    })
  };

  render () {
    const {
      prefixCls, className, focusable,
      showLine,
      children,
    } = this.props
    const domProps = {}

    // [Legacy] Commit: 0117f0c9db0e2956e92cb208f51a42387dfcb3d1
    if (focusable) {
      domProps.tabIndex = '0'
      domProps.onKeyDown = this.onKeyDown
    }

    return (
      <ul
        {...domProps}
        className={classNames(prefixCls, className, {
          [`${prefixCls}-show-line`]: showLine,
        })}
        role='tree-node'
        unselectable='on'
      >
        {React.Children.map(children, this.renderTreeNode, this)}
      </ul>
    )
  }
}

export default Tree
