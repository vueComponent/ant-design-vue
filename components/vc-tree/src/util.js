/* eslint no-loop-func: 0*/
import warning from 'warning';
import omit from 'omit.js';
import TreeNode from './TreeNode';
import { getSlotOptions, getOptionProps } from '../../_util/props-util';
const DRAG_SIDE_RANGE = 0.25;
const DRAG_MIN_GAP = 2;

let onlyTreeNodeWarned = false;

export function warnOnlyTreeNode() {
  if (onlyTreeNodeWarned) return;

  onlyTreeNodeWarned = true;
  warning(false, 'Tree only accept TreeNode as children.');
}

export function arrDel(list, value) {
  const clone = list.slice();
  const index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}

export function arrAdd(list, value) {
  const clone = list.slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}

export function posToArr(pos) {
  return pos.split('-');
}

export function getPosition(level, index) {
  return `${level}-${index}`;
}

export function isTreeNode(node) {
  return getSlotOptions(node).isTreeNode;
}

export function getNodeChildren(children = []) {
  return children.filter(isTreeNode);
}

export function isCheckDisabled(node) {
  const { disabled, disableCheckbox } = getOptionProps(node) || {};
  return !!(disabled || disableCheckbox);
}

export function traverseTreeNodes(treeNodes, callback) {
  function processNode(node, index, parent) {
    const children = node ? node.componentOptions.children : treeNodes;
    const pos = node ? getPosition(parent.pos, index) : 0;

    // Filter children
    const childList = getNodeChildren(children);

    // Process node if is not root
    if (node) {
      let key = node.key;
      if (!key && (key === undefined || key === null)) {
        key = pos;
      }
      const data = {
        node,
        index,
        pos,
        key,
        parentPos: parent.node ? parent.pos : null,
      };
      callback(data);
    }

    // Process children node
    childList.forEach((subNode, subIndex) => {
      processNode(subNode, subIndex, { node, pos });
    });
  }

  processNode(null);
}

/**
 * Use `rc-util` `toArray` to get the children list which keeps the key.
 * And return single node if children is only one(This can avoid `key` missing check).
 */
export function mapChildren(children = [], func) {
  const list = children.map(func);
  if (list.length === 1) {
    return list[0];
  }
  return list;
}

export function getDragNodesKeys(treeNodes, node) {
  const { eventKey, pos } = getOptionProps(node);
  const dragNodesKeys = [];

  traverseTreeNodes(treeNodes, ({ key }) => {
    dragNodesKeys.push(key);
  });
  dragNodesKeys.push(eventKey || pos);
  return dragNodesKeys;
}

export function calcDropPosition(event, treeNode) {
  const { clientY } = event;
  const { top, bottom, height } = treeNode.$refs.selectHandle.getBoundingClientRect();
  const des = Math.max(height * DRAG_SIDE_RANGE, DRAG_MIN_GAP);

  if (clientY <= top + des) {
    return -1;
  } else if (clientY >= bottom - des) {
    return 1;
  }
  return 0;
}

/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
export function calcSelectedKeys(selectedKeys, props) {
  if (!selectedKeys) {
    return undefined;
  }

  const { multiple } = props;
  if (multiple) {
    return selectedKeys.slice();
  }

  if (selectedKeys.length) {
    return [selectedKeys[0]];
  }
  return selectedKeys;
}

/**
 * Since React internal will convert key to string,
 * we need do this to avoid `checkStrictly` use number match
 */
// function keyListToString (keyList) {
//   if (!keyList) return keyList
//   return keyList.map(key => String(key))
// }

const internalProcessProps = (props = {}) => {
  return {
    props: omit(props, ['on', 'key', 'class', 'className', 'style']),
    on: props.on || {},
    class: props.class || props.className,
    style: props.style,
    key: props.key,
  };
};
export function convertDataToTree(h, treeData, processer) {
  if (!treeData) return [];

  const { processProps = internalProcessProps } = processer || {};
  const list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(({ children, ...props }) => {
    const childrenNodes = convertDataToTree(h, children, processer);
    return <TreeNode {...processProps(props)}>{childrenNodes}</TreeNode>;
  });
}

// TODO: ========================= NEW LOGIC =========================
/**
 * Calculate treeNodes entities. `processTreeEntity` is used for `rc-tree-select`
 * @param treeNodes
 * @param processTreeEntity  User can customize the entity
 */
export function convertTreeToEntities(
  treeNodes,
  { initWrapper, processEntity, onProcessFinished } = {},
) {
  const posEntities = new Map();
  const keyEntities = new Map();
  let wrapper = {
    posEntities,
    keyEntities,
  };

  if (initWrapper) {
    wrapper = initWrapper(wrapper) || wrapper;
  }

  traverseTreeNodes(treeNodes, item => {
    const { node, index, pos, key, parentPos } = item;
    const entity = { node, index, key, pos };

    posEntities.set(pos, entity);
    keyEntities.set(key, entity);

    // Fill children
    entity.parent = posEntities.get(parentPos);
    if (entity.parent) {
      entity.parent.children = entity.parent.children || [];
      entity.parent.children.push(entity);
    }

    if (processEntity) {
      processEntity(entity, wrapper);
    }
  });

  if (onProcessFinished) {
    onProcessFinished(wrapper);
  }

  return wrapper;
}

/**
 * Parse `checkedKeys` to { checkedKeys, halfCheckedKeys } style
 */
export function parseCheckedKeys(keys) {
  if (!keys) {
    return null;
  }

  // Convert keys to object format
  let keyProps;
  if (Array.isArray(keys)) {
    // [Legacy] Follow the api doc
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined,
    };
  } else if (typeof keys === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined,
    };
  } else {
    warning(false, '`checkedKeys` is not an array or an object');
    return null;
  }

  // keyProps.checkedKeys = keyListToString(keyProps.checkedKeys)
  // keyProps.halfCheckedKeys = keyListToString(keyProps.halfCheckedKeys)

  return keyProps;
}

/**
 * Conduct check state by the keyList. It will conduct up & from the provided key.
 * If the conduct path reach the disabled or already checked / unchecked node will stop conduct.
 * @param keyList       list of keys
 * @param isCheck       is check the node or not
 * @param keyEntities   parsed by `convertTreeToEntities` function in Tree
 * @param checkStatus   Can pass current checked status for process (usually for uncheck operation)
 * @returns {{checkedKeys: [], halfCheckedKeys: []}}
 */
export function conductCheck(keyList, isCheck, keyEntities, checkStatus = {}) {
  const checkedKeys = new Map();
  const halfCheckedKeys = new Map(); // Record the key has some child checked (include child half checked)

  (checkStatus.checkedKeys || []).forEach(key => {
    checkedKeys.set(key, true);
  });

  (checkStatus.halfCheckedKeys || []).forEach(key => {
    halfCheckedKeys.set(key, true);
  });

  // Conduct up
  function conductUp(key) {
    if (checkedKeys.get(key) === isCheck) return;

    const entity = keyEntities.get(key);
    if (!entity) return;

    const { children, parent, node } = entity;

    if (isCheckDisabled(node)) return;

    // Check child node checked status
    let everyChildChecked = true;
    let someChildChecked = false; // Child checked or half checked

    (children || [])
      .filter(child => !isCheckDisabled(child.node))
      .forEach(({ key: childKey }) => {
        const childChecked = checkedKeys.get(childKey);
        const childHalfChecked = halfCheckedKeys.get(childKey);

        if (childChecked || childHalfChecked) someChildChecked = true;
        if (!childChecked) everyChildChecked = false;
      });

    // Update checked status
    if (isCheck) {
      checkedKeys.set(key, everyChildChecked);
    } else {
      checkedKeys.set(key, false);
    }
    halfCheckedKeys.set(key, someChildChecked);

    if (parent) {
      conductUp(parent.key);
    }
  }

  // Conduct down
  function conductDown(key) {
    if (checkedKeys.get(key) === isCheck) return;

    const entity = keyEntities.get(key);
    if (!entity) return;

    const { children, node } = entity;

    if (isCheckDisabled(node)) return;

    checkedKeys.set(key, isCheck);

    (children || []).forEach(child => {
      conductDown(child.key);
    });
  }

  function conduct(key) {
    const entity = keyEntities.get(key);

    if (!entity) {
      warning(false, `'${key}' does not exist in the tree.`);
      return;
    }
    const { children, parent, node } = entity;
    checkedKeys.set(key, isCheck);

    if (isCheckDisabled(node)) return;

    // Conduct down
    (children || [])
      .filter(child => !isCheckDisabled(child.node))
      .forEach(child => {
        conductDown(child.key);
      });

    // Conduct up
    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach(key => {
    conduct(key);
  });

  const checkedKeyList = [];
  const halfCheckedKeyList = [];

  // Fill checked list
  for (const [key, value] of checkedKeys) {
    if (value) {
      checkedKeyList.push(key);
    }
  }

  // Fill half checked list
  for (const [key, value] of halfCheckedKeys) {
    if (!checkedKeys.get(key) && value) {
      halfCheckedKeyList.push(key);
    }
  }

  return {
    checkedKeys: checkedKeyList,
    halfCheckedKeys: halfCheckedKeyList,
  };
}

/**
 * If user use `autoExpandParent` we should get the list of parent node
 * @param keyList
 * @param keyEntities
 */
export function conductExpandParent(keyList, keyEntities) {
  const expandedKeys = new Map();

  function conductUp(key) {
    if (expandedKeys.get(key)) return;

    const entity = keyEntities.get(key);
    if (!entity) return;

    expandedKeys.set(key, true);

    const { parent, node } = entity;

    if (isCheckDisabled(node)) return;

    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach(key => {
    conductUp(key);
  });

  return [...expandedKeys.keys()];
}

/**
 * Returns only the data- and aria- key/value pairs
 * @param {object} props
 */
export function getDataAndAria(props) {
  return Object.keys(props).reduce((prev, key) => {
    if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-') {
      prev[key] = props[key];
    }
    return prev;
  }, {});
}
