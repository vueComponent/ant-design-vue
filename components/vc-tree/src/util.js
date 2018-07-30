/* eslint no-loop-func: 0*/
import warning from 'warning'
import { getSlotOptions, getOptionProps } from '../../_util/props-util'
const DRAG_SIDE_RANGE = 0.25
const DRAG_MIN_GAP = 2

export function arrDel (list, value) {
  const clone = list.slice()
  const index = clone.indexOf(value)
  if (index >= 0) {
    clone.splice(index, 1)
  }
  return clone
}

export function arrAdd (list, value) {
  const clone = list.slice()
  if (clone.indexOf(value) === -1) {
    clone.push(value)
  }
  return clone
}

export function posToArr (pos) {
  return pos.split('-')
}

export function getPosition (level, index) {
  return `${level}-${index}`
}

export function getNodeChildren (children = []) {
  return children
    .filter(child => getSlotOptions(child).isTreeNode)
}

export function isCheckDisabled (node) {
  const { disabled, disableCheckbox } = getOptionProps(node) || {}
  return !!(disabled || disableCheckbox)
}

export function traverseTreeNodes (treeNodes, subTreeData, callback) {
  if (typeof subTreeData === 'function') {
    callback = subTreeData
    subTreeData = false
  }

  function processNode (node, index, parent) {
    const children = node ? node.componentOptions.children : treeNodes
    const pos = node ? getPosition(parent.pos, index) : 0

    // Filter children
    const childList = getNodeChildren(children)

    // Process node if is not root
    if (node) {
      const data = {
        node,
        index,
        pos,
        key: node.key || pos,
        parentPos: parent.node ? parent.pos : null,
      }

      // Children data is not must have
      if (subTreeData) {
        // Statistic children
        const subNodes = []
        childList.forEach((subNode, subIndex) => {
          // Provide limit snapshot
          const subPos = getPosition(pos, index)
          subNodes.push({
            node: subNode,
            key: subNode.key || subPos,
            pos: subPos,
            index: subIndex,
          })
        })
        data.subNodes = subNodes
      }

      // Can break traverse by return false
      if (callback(data) === false) {
        return
      }
    }

    // Process children node
    childList.forEach((subNode, subIndex) => {
      processNode(subNode, subIndex, { node, pos })
    })
  }

  processNode(null)
}

/**
 * Use `rc-util` `toArray` to get the children list which keeps the key.
 * And return single node if children is only one(This can avoid `key` missing check).
 */
export function mapChildren (children = [], func) {
  const list = children.map(func)
  if (list.length === 1) {
    return list[0]
  }
  return list
}

/**
 * [Legacy] Return halfChecked when it has value.
 * @param checkedKeys
 * @param halfChecked
 * @returns {*}
 */
export function getStrictlyValue (checkedKeys, halfChecked) {
  if (halfChecked) {
    return { checked: checkedKeys, halfChecked }
  }
  return checkedKeys
}

export function getFullKeyList (treeNodes) {
  const keyList = []
  traverseTreeNodes(treeNodes, ({ key }) => {
    keyList.push(key)
  })
  return keyList
}

/**
 * Check position relation.
 * @param parentPos
 * @param childPos
 * @param directly only directly parent can be true
 * @returns {boolean}
 */
export function isParent (parentPos, childPos, directly = false) {
  if (!parentPos || !childPos || parentPos.length > childPos.length) return false

  const parentPath = posToArr(parentPos)
  const childPath = posToArr(childPos)

  // Directly check
  if (directly && parentPath.length !== childPath.length - 1) return false

  const len = parentPath.length
  for (let i = 0; i < len; i += 1) {
    if (parentPath[i] !== childPath[i]) return false
  }

  return true
}

/**
 * Statistic TreeNodes info
 * @param treeNodes
 * @returns {{}}
 */
export function getNodesStatistic (treeNodes) {
  const statistic = {
    keyNodes: {},
    posNodes: {},
    nodeList: [],
  }

  traverseTreeNodes(treeNodes, true, ({ node, index, pos, key, subNodes, parentPos }) => {
    const data = { node, index, pos, key, subNodes, parentPos }
    statistic.keyNodes[key] = data
    statistic.posNodes[pos] = data
    statistic.nodeList.push(data)
  })

  return statistic
}

export function getDragNodesKeys (treeNodes, node) {
  const { eventKey, pos } = getOptionProps(node)
  const dragNodesKeys = []

  traverseTreeNodes(treeNodes, ({ pos: nodePos, key }) => {
    if (isParent(pos, nodePos)) {
      dragNodesKeys.push(key)
    }
  })
  dragNodesKeys.push(eventKey || pos)
  return dragNodesKeys
}

export function calcDropPosition (event, treeNode) {
  const { clientY } = event
  const { top, bottom, height } = treeNode.$refs.selectHandle.getBoundingClientRect()
  const des = Math.max(height * DRAG_SIDE_RANGE, DRAG_MIN_GAP)

  if (clientY <= top + des) {
    return -1
  } else if (clientY >= bottom - des) {
    return 1
  }
  return 0
}

/**
 * Auto expand all related node when sub node is expanded
 * @param keyList
 * @param props
 * @returns [string]
 */
export function calcExpandedKeys (keyList, props, children = []) {
  if (!keyList) {
    return []
  }

  // Fill parent expanded keys
  const { keyNodes, nodeList } = getNodesStatistic(children)
  const needExpandKeys = {}
  const needExpandPathList = []

  // Fill expanded nodes
  keyList.forEach((key) => {
    const node = keyNodes[key]
    if (node) {
      needExpandKeys[key] = true
      needExpandPathList.push(node.pos)
    }
  })

  // Match parent by path
  nodeList.forEach(({ pos, key }) => {
    if (needExpandPathList.some(childPos => isParent(pos, childPos))) {
      needExpandKeys[key] = true
    }
  })

  const calcExpandedKeyList = Object.keys(needExpandKeys)

  // [Legacy] Return origin keyList if calc list is empty
  return calcExpandedKeyList.length ? calcExpandedKeyList : keyList
}

/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
export function calcSelectedKeys (selectedKeys, props) {
  if (!selectedKeys) {
    return undefined
  }

  const { multiple } = props
  if (multiple) {
    return selectedKeys.slice()
  }

  if (selectedKeys.length) {
    return [selectedKeys[0]]
  }
  return selectedKeys
}

/**
 * Check conduct is by key level. It pass though up & down.
 * When conduct target node is check means already conducted will be skip.
 * @param treeNodes
 * @param checkedKeys
 * @returns {{checkedKeys: Array, halfCheckedKeys: Array}}
 */
export function calcCheckStateConduct (treeNodes, checkedKeys) {
  const { keyNodes, posNodes } = getNodesStatistic(treeNodes)

  const tgtCheckedKeys = {}
  const tgtHalfCheckedKeys = {}

  // Conduct up
  function conductUp (key, halfChecked) {
    if (tgtCheckedKeys[key]) return

    const { subNodes = [], parentPos, node } = keyNodes[key]
    if (isCheckDisabled(node)) return

    const allSubChecked = !halfChecked && subNodes
      .filter(sub => !isCheckDisabled(sub.node))
      .every(sub => tgtCheckedKeys[sub.key])

    if (allSubChecked) {
      tgtCheckedKeys[key] = true
    } else {
      tgtHalfCheckedKeys[key] = true
    }

    if (parentPos !== null) {
      conductUp(posNodes[parentPos].key, !allSubChecked)
    }
  }

  // Conduct down
  function conductDown (key) {
    if (tgtCheckedKeys[key]) return
    const { subNodes = [], node } = keyNodes[key]

    if (isCheckDisabled(node)) return

    tgtCheckedKeys[key] = true

    subNodes.forEach((sub) => {
      conductDown(sub.key)
    })
  }

  function conduct (key) {
    if (!keyNodes[key]) {
      warning(false, `'${key}' does not exist in the tree.`)
      return
    }

    const { subNodes = [], parentPos, node } = keyNodes[key]

    tgtCheckedKeys[key] = true

    if (isCheckDisabled(node)) return

    // Conduct down
    subNodes
      .filter(sub => !isCheckDisabled(sub.node))
      .forEach((sub) => {
        conductDown(sub.key)
      })

    // Conduct up
    if (parentPos !== null) {
      conductUp(posNodes[parentPos].key)
    }
  }

  checkedKeys.forEach((key) => {
    conduct(key)
  })

  return {
    checkedKeys: Object.keys(tgtCheckedKeys),
    halfCheckedKeys: Object.keys(tgtHalfCheckedKeys)
      .filter(key => !tgtCheckedKeys[key]),
  }
}

function keyListToString (keyList) {
  if (!keyList) return keyList
  return keyList.map(key => String(key))
}

/**
 * Calculate the value of checked and halfChecked keys.
 * This should be only run in init or props changed.
 */
export function calcCheckedKeys (keys, props, children = []) {
  const { checkable, checkStrictly } = props

  if (!checkable || !keys) {
    return null
  }

  // Convert keys to object format
  let keyProps
  if (Array.isArray(keys)) {
    // [Legacy] Follow the api doc
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined,
    }
  } else if (typeof keys === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined,
    }
  } else {
    warning(false, '`CheckedKeys` is not an array or an object')
    return null
  }

  keyProps.checkedKeys = keyListToString(keyProps.checkedKeys)
  keyProps.halfCheckedKeys = keyListToString(keyProps.halfCheckedKeys)

  // Do nothing if is checkStrictly mode
  if (checkStrictly) {
    return keyProps
  }

  // Conduct calculate the check status
  const { checkedKeys = [] } = keyProps
  return calcCheckStateConduct(children, checkedKeys)
}
