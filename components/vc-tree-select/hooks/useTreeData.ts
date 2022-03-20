import type { Ref } from 'vue';
import { toRaw, computed } from 'vue';
import type { DataNode, SimpleModeConfig } from '../interface';
import { convertChildrenToData } from '../utils/legacyUtil';
import type { DefaultOptionType } from '../TreeSelect';
import type { VueNode } from '../../_util/type';

function parseSimpleTreeData(
  treeData: DataNode[],
  { id, pId, rootPId }: SimpleModeConfig,
): DataNode[] {
  const keyNodes = {};
  const rootNodeList = [];

  // Fill in the map
  const nodeList = treeData.map(node => {
    const clone = { ...node };
    const key = clone[id];
    keyNodes[key] = clone;
    clone.key = clone.key || key;
    return clone;
  });

  // Connect tree
  nodeList.forEach(node => {
    const parentKey = node[pId];
    const parent = keyNodes[parentKey];

    // Fill parent
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }

    // Fill root tree node
    if (parentKey === rootPId || (!parent && rootPId === null)) {
      rootNodeList.push(node);
    }
  });

  return rootNodeList;
}

/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
export default function useTreeData(
  treeData: Ref<DataNode[]>,
  children: Ref<VueNode[]>,
  simpleMode: Ref<boolean | SimpleModeConfig>,
): Ref<DefaultOptionType[]> {
  return computed(() => {
    const simpleModeValue = simpleMode.value;
    if (treeData.value) {
      return simpleMode.value
        ? parseSimpleTreeData(toRaw(treeData.value), {
            id: 'id',
            pId: 'pId',
            rootPId: null,
            ...(simpleModeValue !== true ? simpleModeValue : {}),
          })
        : treeData.value;
    }

    return convertChildrenToData(toRaw(children.value));
  });
}
