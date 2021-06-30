import type { VNode } from 'vue';
import { getNodeChildren, convertTreeToEntities } from '../vc-tree/src/util';
import { getSlot } from '../_util/props-util';
import type { TreeDataItem } from './Tree';

enum Record {
  None,
  Start,
  End,
}

type TreeKey = string | number;

// TODO: Move this logic into `rc-tree`
function traverseNodesKey(rootChildren: VNode[], callback?: Function) {
  const nodeList = getNodeChildren(rootChildren) || [];

  function processNode(node: VNode) {
    const { key } = node;
    const children = getSlot(node);
    if (callback(key, node) !== false) {
      traverseNodesKey(children, callback);
    }
  }

  nodeList.forEach(processNode);
}

export function getFullKeyList(children: VNode[]) {
  const { keyEntities } = convertTreeToEntities(children);
  return [...keyEntities.keys()];
}

/** 计算选中范围，只考虑expanded情况以优化性能 */
export function calcRangeKeys(
  rootChildren: VNode[],
  expandedKeys: TreeKey[],
  startKey: TreeKey,
  endKey: TreeKey,
) {
  const keys = [];
  let record = Record.None;

  if (startKey && startKey === endKey) {
    return [startKey];
  }
  if (!startKey || !endKey) {
    return [];
  }

  function matchKey(key: TreeKey) {
    return key === startKey || key === endKey;
  }

  traverseNodesKey(rootChildren, (key: TreeKey) => {
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

export function convertDirectoryKeysToNodes(rootChildren: VNode[], keys: TreeKey[]) {
  const restKeys = [...keys];
  const nodes = [];
  traverseNodesKey(rootChildren, (key: TreeKey, node: VNode) => {
    const index = restKeys.indexOf(key);
    if (index !== -1) {
      nodes.push(node);
      restKeys.splice(index, 1);
    }

    return !!restKeys.length;
  });
  return nodes;
}

export function getFullKeyListByTreeData(treeData: TreeDataItem[], replaceFields: any = {}) {
  let keys = [];
  const { key = 'key', children = 'children' } = replaceFields;
  (treeData || []).forEach((item: TreeDataItem) => {
    keys.push(item[key]);
    if (item[children]) {
      keys = [...keys, ...getFullKeyListByTreeData(item[children], replaceFields)];
    }
  });
  return keys;
}
