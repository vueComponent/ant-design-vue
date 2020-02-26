import { getNodeChildren, convertTreeToEntities } from '../vc-tree/src/util';
import { getSlots } from '../_util/props-util';

const Record = {
  None: 'node',
  Start: 'start',
  End: 'end',
};

// TODO: Move this logic into `rc-tree`
function traverseNodesKey(rootChildren, callback) {
  const nodeList = getNodeChildren(rootChildren) || [];

  function processNode(node) {
    const { key } = node;
    const children = getSlots(node).default;
    if (callback(key, node) !== false) {
      traverseNodesKey(typeof children === 'function' ? children() : children, callback);
    }
  }

  nodeList.forEach(processNode);
}

export function getFullKeyList(children) {
  const { keyEntities } = convertTreeToEntities(children);
  return [...keyEntities.keys()];
}

/** 计算选中范围，只考虑expanded情况以优化性能 */
export function calcRangeKeys(rootChildren, expandedKeys, startKey, endKey) {
  const keys = [];
  let record = Record.None;

  if (startKey && startKey === endKey) {
    return [startKey];
  }
  if (!startKey || !endKey) {
    return [];
  }

  function matchKey(key) {
    return key === startKey || key === endKey;
  }

  traverseNodesKey(rootChildren, key => {
    if (record === Record.End) {
      return false;
    }

    if (matchKey(key)) {
      // Match test
      keys.push(key);

      if (record === Record.None) {
        record = Record.Start;
      } else if (record === Record.Start) {
        record = Record.End;
        return false;
      }
    } else if (record === Record.Start) {
      // Append selection
      keys.push(key);
    }

    if (expandedKeys.indexOf(key) === -1) {
      return false;
    }

    return true;
  });

  return keys;
}

export function convertDirectoryKeysToNodes(rootChildren, keys) {
  const restKeys = [...keys];
  const nodes = [];
  traverseNodesKey(rootChildren, (key, node) => {
    const index = restKeys.indexOf(key);
    if (index !== -1) {
      nodes.push(node);
      restKeys.splice(index, 1);
    }

    return !!restKeys.length;
  });
  return nodes;
}

export function getFullKeyListByTreeData(treeData) {
  let keys = [];

  (treeData || []).forEach(item => {
    keys.push(item.key);
    if (item.children) {
      keys = [...keys, ...getFullKeyListByTreeData(item.children)];
    }
  });
  return keys;
}
