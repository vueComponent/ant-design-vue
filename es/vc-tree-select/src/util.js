import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import { getPropsData, getAllProps, getKey, getAttrs, getSlotOptions, filterEmpty, getSlots } from '../../_util/props-util';
import { cloneVNodes, cloneElement } from '../../_util/vnode';
export function toTitle(title) {
  if (typeof title === 'string') {
    return title;
  }
  return null;
}

export function getValuePropValue(child) {
  var props = getAllProps(child);
  if ('value' in props) {
    return props.value;
  }
  if (getKey(child) !== undefined) {
    return getKey(child);
  }
  throw new Error('no key or value for ' + child);
}

export function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  var slots = getSlots(child);
  if (prop === 'children') {
    var newChild = child.$slots ? cloneVNodes(child.$slots['default'], true) : cloneVNodes(child.componentOptions.children, true);
    if (newChild.length === 1 && !newChild[0].tag) {
      return newChild[0].text;
    }
    return newChild;
  }
  if (slots[prop]) {
    return cloneVNodes(slots[prop], true);
  }
  var data = getPropsData(child);
  if (prop in data) {
    return data[prop];
  } else {
    return getAttrs(child)[prop];
  }
}

export function isMultiple(props) {
  return !!(props.multiple || props.treeCheckable);
}

export function toArray(value) {
  var ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

export function preventDefaultEvent(e) {
  e.preventDefault();
}

export var UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

export var UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable'
};

export function labelCompatible(prop) {
  var newProp = prop;
  if (newProp === 'label') {
    newProp = 'title';
  }
  return newProp;
}

export function isInclude(smallArray, bigArray) {
  // attention: [0,0,1] [0,0,10]
  return smallArray.every(function (ii, i) {
    return ii === bigArray[i];
  });
}

export function isPositionPrefix(smallPos, bigPos) {
  if (!bigPos || !smallPos) {
    // console.log(smallPos, bigPos);
    return false;
  }
  if (bigPos.length < smallPos.length) {
    return false;
  }
  // attention: "0-0-1" "0-0-10"
  if (bigPos.length > smallPos.length && bigPos.charAt(smallPos.length) !== '-') {
    return false;
  }
  return bigPos.substr(0, smallPos.length) === smallPos;
}

/*
export function getCheckedKeys(node, checkedKeys, allCheckedNodesKeys) {
  const nodeKey = node.props.eventKey;
  let newCks = [...checkedKeys];
  let nodePos;
  const unCheck = allCheckedNodesKeys.some(item => {
    if (item.key === nodeKey) {
      nodePos = item.pos;
      return true;
    }
  });
  if (unCheck) {
    newCks = [];
    allCheckedNodesKeys.forEach(item => {
      if (isPositionPrefix(item.pos, nodePos) || isPositionPrefix(nodePos, item.pos)) {
        return;
      }
      newCks.push(item.key);
    });
  } else {
    newCks.push(nodeKey);
  }
  return newCks;
}
*/

function getChildrenlength(children) {
  var len = 1;
  if (Array.isArray(children)) {
    len = children.length;
  }
  return len;
}

function getSiblingPosition(index, len, siblingPosition) {
  if (len === 1) {
    siblingPosition.first = true;
    siblingPosition.last = true;
  } else {
    siblingPosition.first = index === 0;
    siblingPosition.last = index === len - 1;
  }
  return siblingPosition;
}

function filterChild(childs) {
  var newChilds = [];
  childs.forEach(function (child) {
    var options = getSlotOptions(child);
    if (options.__ANT_TREE_NODE || options.__ANT_TREE_SELECT_NODE) {
      newChilds.push(child);
    }
  });
  return newChilds;
}

export function loopAllChildren(childs, callback, parent) {
  var loop = function loop(children, level, _parent) {
    var len = getChildrenlength(children);
    children.forEach(function handler(item, index) {
      // eslint-disable-line
      var pos = level + '-' + index;
      if (item && item.componentOptions && item.componentOptions.children) {
        loop(filterChild(item.componentOptions.children), pos, { node: item, pos: pos });
      }
      if (item) {
        callback(item, index, pos, item.key || pos, getSiblingPosition(index, len, {}), _parent);
      }
    });
  };
  loop(filterChild(childs), 0, parent);
}

// export function loopAllChildren(childs, callback) {
//   const loop = (children, level) => {
//     React.Children.forEach(children, (item, index) => {
//       const pos = `${level}-${index}`;
//       if (item && item.props.children) {
//         loop(item.props.children, pos);
//       }
//       if (item) {
//         callback(item, index, pos, getValuePropValue(item));
//       }
//     });
//   };
//   loop(childs, 0);
// }

// TODO: Here has the side effect. Update node children data affect.
export function flatToHierarchy(arr) {
  if (!arr.length) {
    return arr;
  }
  var hierarchyNodes = [];
  var levelObj = {};
  arr.forEach(function (item) {
    if (!item.pos) {
      return;
    }
    var posLen = item.pos.split('-').length;
    if (!levelObj[posLen]) {
      levelObj[posLen] = [];
    }
    levelObj[posLen].push(item);
  });
  var levelArr = Object.keys(levelObj).sort(function (a, b) {
    return b - a;
  });
  // const s = Date.now();
  // todo: there are performance issues!
  levelArr.reduce(function (pre, cur) {
    if (cur && cur !== pre) {
      levelObj[pre].forEach(function (item) {
        var haveParent = false;
        levelObj[cur].forEach(function (ii) {
          if (isPositionPrefix(ii.pos, item.pos)) {
            haveParent = true;
            if (!ii.children) {
              ii.children = [];
            }
            ii.children.push(item);
          }
        });
        if (!haveParent) {
          hierarchyNodes.push(item);
        }
      });
    }
    return cur;
  });
  // console.log(Date.now() - s);
  return levelObj[levelArr[levelArr.length - 1]].concat(hierarchyNodes);
}

// arr.length === 628, use time: ~20ms
export function filterParentPosition(arr) {
  var levelObj = {};
  arr.forEach(function (item) {
    var posLen = item.split('-').length;
    if (!levelObj[posLen]) {
      levelObj[posLen] = [];
    }
    levelObj[posLen].push(item);
  });
  var levelArr = Object.keys(levelObj).sort();

  var _loop = function _loop(i) {
    if (levelArr[i + 1]) {
      levelObj[levelArr[i]].forEach(function (ii) {
        var _loop2 = function _loop2(j) {
          levelObj[levelArr[j]].forEach(function (_i, index) {
            if (isPositionPrefix(ii, _i)) {
              levelObj[levelArr[j]][index] = null;
            }
          });
          levelObj[levelArr[j]] = levelObj[levelArr[j]].filter(function (p) {
            return p;
          });
        };

        for (var j = i + 1; j < levelArr.length; j++) {
          _loop2(j);
        }
      });
    }
  };

  for (var i = 0; i < levelArr.length; i++) {
    _loop(i);
  }
  var nArr = [];
  levelArr.forEach(function (i) {
    nArr = nArr.concat(levelObj[i]);
  });
  return nArr;
}
// console.log(filterParentPosition(
// ['0-2', '0-3-3', '0-10', '0-10-0', '0-0-1', '0-0', '0-1-1', '0-1']
// ));

function stripTail(str) {
  var arr = str.match(/(.+)(-[^-]+)$/);
  var st = '';
  if (arr && arr.length === 3) {
    st = arr[1];
  }
  return st;
}
function splitPosition(pos) {
  return pos.split('-');
}

// todo: do optimization.
export function handleCheckState(obj, checkedPositionArr, checkIt) {
  // console.log(stripTail('0-101-000'));
  // let s = Date.now();
  var objKeys = Object.keys(obj);

  objKeys.forEach(function (i, index) {
    var iArr = splitPosition(i);
    var saved = false;
    checkedPositionArr.forEach(function (_pos) {
      var _posArr = splitPosition(_pos);
      if (iArr.length > _posArr.length && isInclude(_posArr, iArr)) {
        obj[i].halfChecked = false;
        obj[i].checked = checkIt;
        objKeys[index] = null;
      }
      if (iArr[0] === _posArr[0] && iArr[1] === _posArr[1]) {
        saved = true;
      }
    });
    if (!saved) {
      objKeys[index] = null;
    }
  });
  objKeys = objKeys.filter(function (i) {
    return i;
  }); // filter non null;

  var _loop3 = function _loop3(_pIndex) {
    // loop to set ancestral nodes's `checked` or `halfChecked`
    var loop = function loop(__pos) {
      var _posLen = splitPosition(__pos).length;
      if (_posLen <= 2) {
        // e.g. '0-0', '0-1'
        return;
      }
      var sibling = 0;
      var siblingChecked = 0;
      var parentPosition = stripTail(__pos);
      objKeys.forEach(function (i /* , index*/) {
        var iArr = splitPosition(i);
        if (iArr.length === _posLen && isInclude(splitPosition(parentPosition), iArr)) {
          sibling++;
          if (obj[i].checked) {
            siblingChecked++;
            var _i = checkedPositionArr.indexOf(i);
            if (_i > -1) {
              checkedPositionArr.splice(_i, 1);
              if (_i <= _pIndex) {
                _pIndex--;
              }
            }
          } else if (obj[i].halfChecked) {
            siblingChecked += 0.5;
          }
          // objKeys[index] = null;
        }
      });
      // objKeys = objKeys.filter(i => i); // filter non null;
      var parent = obj[parentPosition];
      // not check, checked, halfChecked
      if (siblingChecked === 0) {
        parent.checked = false;
        parent.halfChecked = false;
      } else if (siblingChecked === sibling) {
        parent.checked = true;
        parent.halfChecked = false;
      } else {
        parent.halfChecked = true;
        parent.checked = false;
      }
      loop(parentPosition);
    };
    loop(checkedPositionArr[_pIndex], _pIndex);
    pIndex = _pIndex;
  };

  for (var pIndex = 0; pIndex < checkedPositionArr.length; pIndex++) {
    _loop3(pIndex);
  }
  // console.log(Date.now()-s, objKeys.length, checkIt);
}

function getCheck(treeNodesStates, checkedPositions) {
  var halfCheckedKeys = [];
  var checkedKeys = [];
  var checkedNodes = [];
  Object.keys(treeNodesStates).forEach(function (item) {
    var itemObj = treeNodesStates[item];
    if (itemObj.checked) {
      checkedKeys.push(itemObj.key);
      // checkedNodes.push(getValuePropValue(itemObj.node));
      checkedNodes.push(_extends({}, itemObj, { pos: item }));
    } else if (itemObj.halfChecked) {
      halfCheckedKeys.push(itemObj.key);
    }
  });
  return {
    halfCheckedKeys: halfCheckedKeys, checkedKeys: checkedKeys, checkedNodes: checkedNodes, treeNodesStates: treeNodesStates, checkedPositions: checkedPositions
  };
}

export function getTreeNodesStates(children, values) {
  var checkedPositions = [];
  var treeNodesStates = {};
  loopAllChildren(children, function (item, index, pos, keyOrPos, siblingPosition) {
    treeNodesStates[pos] = {
      node: item,
      key: keyOrPos,
      checked: false,
      halfChecked: false,
      siblingPosition: siblingPosition
    };
    if (values.indexOf(getValuePropValue(item)) !== -1) {
      treeNodesStates[pos].checked = true;
      checkedPositions.push(pos);
    }
  });

  handleCheckState(treeNodesStates, filterParentPosition(checkedPositions.sort()), true);

  return getCheck(treeNodesStates, checkedPositions);
}

// can add extra prop to every node.
export function recursiveCloneChildren(children) {
  var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (ch) {
    return ch;
  };

  // return React.Children.map(children, child => {
  return Array.from(children).map(function (child) {
    var newChild = cb(child);
    if (newChild && newChild.props && newChild.props.children) {
      return cloneElement(newChild, {
        children: recursiveCloneChildren(newChild.props.children, cb)
      });
    }
    return newChild;
  });
}
// const newChildren = recursiveCloneChildren(children, child => {
//   const extraProps = {};
//   if (child && child.type && child.type.xxx) {
//     extraProps._prop = true;
//     return React.cloneElement(child, extraProps);
//   }
//   return child;
// });

function recursiveGen(children) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return children.map(function (child, index) {
    var pos = level + '-' + index;
    var props = getAllProps(child);

    var title = props.title,
        label = props.label,
        value = props.value,
        rest = _objectWithoutProperties(props, ['title', 'label', 'value']);

    var subChildren = child.componentOptions.children;

    var o = _extends({}, rest, {
      title: title,
      label: label || title,
      value: value,
      key: child.key,
      _pos: pos
    });
    if (subChildren) {
      o.children = recursiveGen(subChildren, pos);
    }
    return o;
  });
}

function recursive(children, cb) {
  children.forEach(function (item) {
    cb(item);
    if (item.children) {
      recursive(item.children, cb);
    }
  });
}

// Get the tree's checkedNodes (todo: can merge to the `handleCheckState` function)
// If one node checked, it's all children nodes checked.
// If sibling nodes all checked, the parent checked.
export function filterAllCheckedData(vs, treeNodes) {
  var vals = [].concat(_toConsumableArray(vs));
  if (!vals.length) {
    return vals;
  }

  var data = recursiveGen(treeNodes);
  var checkedNodesPositions = [];

  function checkChildren(children) {
    children.forEach(function (item) {
      if (item.__checked) {
        return;
      }
      var ci = vals.indexOf(item.value);
      var childs = item.children;
      if (ci > -1) {
        item.__checked = true;
        checkedNodesPositions.push({ node: item, pos: item._pos });
        vals.splice(ci, 1);
        if (childs) {
          recursive(childs, function (child) {
            child.__checked = true;
            checkedNodesPositions.push({ node: child, pos: child._pos });
          });
        }
      } else {
        if (childs) {
          checkChildren(childs);
        }
      }
    });
  }

  function checkParent(children) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { root: true };

    var siblingChecked = 0;
    children.forEach(function (item) {
      var childs = item.children;
      if (childs && !item.__checked && !item.__halfChecked) {
        var p = checkParent(childs, item);
        if (p.__checked) {
          siblingChecked++;
        } else if (p.__halfChecked) {
          siblingChecked += 0.5;
        }
      } else if (item.__checked) {
        siblingChecked++;
      } else if (item.__halfChecked) {
        siblingChecked += 0.5;
      }
    });
    var len = children.length;
    if (siblingChecked === len) {
      parent.__checked = true;
      checkedNodesPositions.push({ node: parent, pos: parent._pos });
    } else if (siblingChecked < len && siblingChecked > 0) {
      parent.__halfChecked = true;
    }
    if (parent.root) {
      return children;
    }
    return parent;
  }
  checkChildren(data);
  checkParent(data);

  checkedNodesPositions.forEach(function (i, index) {
    // clear private metadata
    delete checkedNodesPositions[index].node.__checked;
    delete checkedNodesPositions[index].node._pos;
    // create the same structure of `onCheck`'s return.
    checkedNodesPositions[index].node.props = {
      title: checkedNodesPositions[index].node.title,
      label: checkedNodesPositions[index].node.label || checkedNodesPositions[index].node.title,
      value: checkedNodesPositions[index].node.value
    };
    if (checkedNodesPositions[index].node.children) {
      checkedNodesPositions[index].node.props.children = checkedNodesPositions[index].node.children;
    }
    delete checkedNodesPositions[index].node.title;
    delete checkedNodesPositions[index].node.label;
    delete checkedNodesPositions[index].node.value;
    delete checkedNodesPositions[index].node.children;
  });
  return checkedNodesPositions;
}

export function processSimpleTreeData(treeData, format) {
  function unflatten2(array) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defineProperty({}, format.id, format.rootPId);

    var children = [];
    for (var i = 0; i < array.length; i++) {
      array[i] = _extends({}, array[i]); // copy, can not corrupts original data
      if (array[i][format.pId] === parent[format.id]) {
        array[i].key = array[i][format.id];
        children.push(array[i]);
        array.splice(i--, 1);
      }
    }
    if (children.length) {
      parent.children = children;
      children.forEach(function (child) {
        return unflatten2(array, child);
      });
    }
    if (parent[format.id] === format.rootPId) {
      return children;
    }
  }
  return unflatten2(treeData);
}

export function saveRef(instance, name) {
  if (!instance.saveRefs) {
    instance.saveRefs = {};
  }
  if (!instance.saveRefs[name]) {
    instance.saveRefs[name] = function (node) {
      instance[name] = node;
    };
  }
  return instance.saveRefs[name];
}