'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.arrDel = arrDel;
exports.arrAdd = arrAdd;
exports.posToArr = posToArr;
exports.getPosition = getPosition;
exports.getNodeChildren = getNodeChildren;
exports.isCheckDisabled = isCheckDisabled;
exports.traverseTreeNodes = traverseTreeNodes;
exports.getStrictlyValue = getStrictlyValue;
exports.getFullKeyList = getFullKeyList;
exports.isParent = isParent;
exports.getNodesStatistic = getNodesStatistic;
exports.getDragNodesKeys = getDragNodesKeys;
exports.calcDropPosition = calcDropPosition;
exports.calcExpandedKeys = calcExpandedKeys;
exports.calcSelectedKeys = calcSelectedKeys;
exports.calcCheckStateConduct = calcCheckStateConduct;
exports.calcCheckedKeys = calcCheckedKeys;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint no-loop-func: 0*/
var DRAG_SIDE_RANGE = 0.25;
var DRAG_MIN_GAP = 2;

function arrDel(list, value) {
  var clone = list.slice();
  var index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}

function arrAdd(list, value) {
  var clone = list.slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}

function posToArr(pos) {
  return pos.split('-');
}

function getPosition(level, index) {
  return level + '-' + index;
}

function getNodeChildren() {
  var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return children.filter(function (child) {
    return (0, _propsUtil.getSlotOptions)(child).isTreeNode;
  });
}

function isCheckDisabled(node) {
  var _ref = (0, _propsUtil.getOptionProps)(node) || {},
      disabled = _ref.disabled,
      disableCheckbox = _ref.disableCheckbox;

  return !!(disabled || disableCheckbox);
}

function traverseTreeNodes(treeNodes, subTreeData, callback) {
  if (typeof subTreeData === 'function') {
    callback = subTreeData;
    subTreeData = false;
  }

  function processNode(node, index, parent) {
    var children = node ? node.componentOptions.children : treeNodes;
    var pos = node ? getPosition(parent.pos, index) : 0;

    // Filter children
    var childList = getNodeChildren(children);

    // Process node if is not root
    if (node) {
      var data = {
        node: node,
        index: index,
        pos: pos,
        key: node.key || pos,
        parentPos: parent.node ? parent.pos : null

        // Children data is not must have
      };if (subTreeData) {
        // Statistic children
        var subNodes = [];
        childList.forEach(function (subNode, subIndex) {
          // Provide limit snapshot
          var subPos = getPosition(pos, index);
          subNodes.push({
            node: subNode,
            key: subNode.key || subPos,
            pos: subPos,
            index: subIndex
          });
        });
        data.subNodes = subNodes;
      }

      // Can break traverse by return false
      if (callback(data) === false) {
        return;
      }
    }

    // Process children node
    childList.forEach(function (subNode, subIndex) {
      processNode(subNode, subIndex, { node: node, pos: pos });
    });
  }

  processNode(null);
}

/**
 * [Legacy] Return halfChecked when it has value.
 * @param checkedKeys
 * @param halfChecked
 * @returns {*}
 */
function getStrictlyValue(checkedKeys, halfChecked) {
  if (halfChecked) {
    return { checked: checkedKeys, halfChecked: halfChecked };
  }
  return checkedKeys;
}

function getFullKeyList(treeNodes) {
  var keyList = [];
  traverseTreeNodes(treeNodes, function (_ref2) {
    var key = _ref2.key;

    keyList.push(key);
  });
  return keyList;
}

/**
 * Check position relation.
 * @param parentPos
 * @param childPos
 * @param directly only directly parent can be true
 * @returns {boolean}
 */
function isParent(parentPos, childPos) {
  var directly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!parentPos || !childPos || parentPos.length > childPos.length) return false;

  var parentPath = posToArr(parentPos);
  var childPath = posToArr(childPos);

  // Directly check
  if (directly && parentPath.length !== childPath.length - 1) return false;

  var len = parentPath.length;
  for (var i = 0; i < len; i += 1) {
    if (parentPath[i] !== childPath[i]) return false;
  }

  return true;
}

/**
 * Statistic TreeNodes info
 * @param treeNodes
 * @returns {{}}
 */
function getNodesStatistic(treeNodes) {
  var statistic = {
    keyNodes: {},
    posNodes: {},
    nodeList: []
  };

  traverseTreeNodes(treeNodes, true, function (_ref3) {
    var node = _ref3.node,
        index = _ref3.index,
        pos = _ref3.pos,
        key = _ref3.key,
        subNodes = _ref3.subNodes,
        parentPos = _ref3.parentPos;

    var data = { node: node, index: index, pos: pos, key: key, subNodes: subNodes, parentPos: parentPos };
    statistic.keyNodes[key] = data;
    statistic.posNodes[pos] = data;
    statistic.nodeList.push(data);
  });

  return statistic;
}

function getDragNodesKeys(treeNodes, node) {
  var _getOptionProps = (0, _propsUtil.getOptionProps)(node),
      eventKey = _getOptionProps.eventKey,
      pos = _getOptionProps.pos;

  var dragNodesKeys = [];

  traverseTreeNodes(treeNodes, function (_ref4) {
    var nodePos = _ref4.pos,
        key = _ref4.key;

    if (isParent(pos, nodePos)) {
      dragNodesKeys.push(key);
    }
  });
  dragNodesKeys.push(eventKey || pos);
  return dragNodesKeys;
}

function calcDropPosition(event, treeNode) {
  var clientY = event.clientY;

  var _treeNode$$refs$selec = treeNode.$refs.selectHandle.getBoundingClientRect(),
      top = _treeNode$$refs$selec.top,
      bottom = _treeNode$$refs$selec.bottom,
      height = _treeNode$$refs$selec.height;

  var des = Math.max(height * DRAG_SIDE_RANGE, DRAG_MIN_GAP);

  if (clientY <= top + des) {
    return -1;
  } else if (clientY >= bottom - des) {
    return 1;
  }
  return 0;
}

/**
 * Auto expand all related node when sub node is expanded
 * @param keyList
 * @param props
 * @returns [string]
 */
function calcExpandedKeys(keyList, props) {
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!keyList) {
    return [];
  }

  // Fill parent expanded keys

  var _getNodesStatistic = getNodesStatistic(children),
      keyNodes = _getNodesStatistic.keyNodes,
      nodeList = _getNodesStatistic.nodeList;

  var needExpandKeys = {};
  var needExpandPathList = [];

  // Fill expanded nodes
  keyList.forEach(function (key) {
    var node = keyNodes[key];
    if (node) {
      needExpandKeys[key] = true;
      needExpandPathList.push(node.pos);
    }
  });

  // Match parent by path
  nodeList.forEach(function (_ref5) {
    var pos = _ref5.pos,
        key = _ref5.key;

    if (needExpandPathList.some(function (childPos) {
      return isParent(pos, childPos);
    })) {
      needExpandKeys[key] = true;
    }
  });

  var calcExpandedKeyList = Object.keys(needExpandKeys);

  // [Legacy] Return origin keyList if calc list is empty
  return calcExpandedKeyList.length ? calcExpandedKeyList : keyList;
}

/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
function calcSelectedKeys(selectedKeys, props) {
  if (!selectedKeys) {
    return undefined;
  }

  var multiple = props.multiple;

  if (multiple) {
    return selectedKeys.slice();
  }

  if (selectedKeys.length) {
    return [selectedKeys[0]];
  }
  return selectedKeys;
}

/**
 * Check conduct is by key level. It pass though up & down.
 * When conduct target node is check means already conducted will be skip.
 * @param treeNodes
 * @param checkedKeys
 * @returns {{checkedKeys: Array, halfCheckedKeys: Array}}
 */
function calcCheckStateConduct(treeNodes, checkedKeys) {
  var _getNodesStatistic2 = getNodesStatistic(treeNodes),
      keyNodes = _getNodesStatistic2.keyNodes,
      posNodes = _getNodesStatistic2.posNodes;

  var tgtCheckedKeys = {};
  var tgtHalfCheckedKeys = {};

  // Conduct up
  function conductUp(key, halfChecked) {
    if (tgtCheckedKeys[key]) return;

    var _keyNodes$key = keyNodes[key],
        _keyNodes$key$subNode = _keyNodes$key.subNodes,
        subNodes = _keyNodes$key$subNode === undefined ? [] : _keyNodes$key$subNode,
        parentPos = _keyNodes$key.parentPos,
        node = _keyNodes$key.node;

    if (isCheckDisabled(node)) return;

    var allSubChecked = !halfChecked && subNodes.filter(function (sub) {
      return !isCheckDisabled(sub.node);
    }).every(function (sub) {
      return tgtCheckedKeys[sub.key];
    });

    if (allSubChecked) {
      tgtCheckedKeys[key] = true;
    } else {
      tgtHalfCheckedKeys[key] = true;
    }

    if (parentPos !== null) {
      conductUp(posNodes[parentPos].key, !allSubChecked);
    }
  }

  // Conduct down
  function conductDown(key) {
    if (tgtCheckedKeys[key]) return;
    var _keyNodes$key2 = keyNodes[key],
        _keyNodes$key2$subNod = _keyNodes$key2.subNodes,
        subNodes = _keyNodes$key2$subNod === undefined ? [] : _keyNodes$key2$subNod,
        node = _keyNodes$key2.node;


    if (isCheckDisabled(node)) return;

    tgtCheckedKeys[key] = true;

    subNodes.forEach(function (sub) {
      conductDown(sub.key);
    });
  }

  function conduct(key) {
    if (!keyNodes[key]) {
      (0, _warning2['default'])(false, '\'' + key + '\' does not exist in the tree.');
      return;
    }

    var _keyNodes$key3 = keyNodes[key],
        _keyNodes$key3$subNod = _keyNodes$key3.subNodes,
        subNodes = _keyNodes$key3$subNod === undefined ? [] : _keyNodes$key3$subNod,
        parentPos = _keyNodes$key3.parentPos,
        node = _keyNodes$key3.node;


    tgtCheckedKeys[key] = true;

    if (isCheckDisabled(node)) return;

    // Conduct down
    subNodes.filter(function (sub) {
      return !isCheckDisabled(sub.node);
    }).forEach(function (sub) {
      conductDown(sub.key);
    });

    // Conduct up
    if (parentPos !== null) {
      conductUp(posNodes[parentPos].key);
    }
  }

  checkedKeys.forEach(function (key) {
    conduct(key);
  });

  return {
    checkedKeys: Object.keys(tgtCheckedKeys),
    halfCheckedKeys: Object.keys(tgtHalfCheckedKeys).filter(function (key) {
      return !tgtCheckedKeys[key];
    })
  };
}

// function keyListToString (keyList) {
//   if (!keyList) return keyList
//   return keyList.map(key => String(key))
// }

/**
 * Calculate the value of checked and halfChecked keys.
 * This should be only run in init or props changed.
 */
function calcCheckedKeys(keys, props) {
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var checkable = props.checkable,
      checkStrictly = props.checkStrictly;


  if (!checkable || !keys) {
    return null;
  }

  // Convert keys to object format
  var keyProps = void 0;
  if (Array.isArray(keys)) {
    // [Legacy] Follow the api doc
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined
    };
  } else if ((typeof keys === 'undefined' ? 'undefined' : (0, _typeof3['default'])(keys)) === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined
    };
  } else {
    (0, _warning2['default'])(false, '`CheckedKeys` is not an array or an object');
    return null;
  }

  // keyProps.checkedKeys = keyListToString(keyProps.checkedKeys)
  // keyProps.halfCheckedKeys = keyListToString(keyProps.halfCheckedKeys)

  // Do nothing if is checkStrictly mode
  if (checkStrictly) {
    return keyProps;
  }

  // Conduct calculate the check status
  var _keyProps = keyProps,
      _keyProps$checkedKeys = _keyProps.checkedKeys,
      checkedKeys = _keyProps$checkedKeys === undefined ? [] : _keyProps$checkedKeys;

  return calcCheckStateConduct(children, checkedKeys);
}