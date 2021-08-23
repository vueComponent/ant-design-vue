import { warning } from '../../vc-util/warning';
import type { ComputedRef, Ref } from 'vue';
import { computed } from 'vue';
import type {
  DataNode,
  InternalDataEntity,
  SimpleModeConfig,
  RawValueType,
  FieldNames,
} from '../interface';
import { convertChildrenToData } from '../utils/legacyUtil';

const MAX_WARNING_TIMES = 10;

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
 * Format `treeData` with `value` & `key` which is used for calculation
 */
function formatTreeData(
  treeData: DataNode[],
  getLabelProp: (node: DataNode) => any,
  fieldNames: FieldNames,
): InternalDataEntity[] {
  let warningTimes = 0;
  const valueSet = new Set<RawValueType>();

  // Field names
  const { value: fieldValue, children: fieldChildren } = fieldNames;

  function dig(dataNodes: DataNode[]) {
    return (dataNodes || []).map(node => {
      const { key, disableCheckbox, disabled } = node;

      const value = node[fieldValue];
      const mergedValue = fieldValue in node ? value : key;

      const dataNode: InternalDataEntity = {
        disableCheckbox,
        disabled,
        key: key !== null && key !== undefined ? key : mergedValue,
        value: mergedValue,
        title: getLabelProp(node),
        node,
        dataRef: node,
      };

      if (node.slots) {
        dataNode.slots = node.slots;
      }

      // Check `key` & `value` and warning user
      if (process.env.NODE_ENV !== 'production') {
        if (
          key !== null &&
          key !== undefined &&
          value !== undefined &&
          String(key) !== String(value) &&
          warningTimes < MAX_WARNING_TIMES
        ) {
          warningTimes += 1;
          warning(
            false,
            `\`key\` or \`value\` with TreeNode must be the same or you can remove one of them. key: ${key}, value: ${value}.`,
          );
        }

        warning(!valueSet.has(value), `Same \`value\` exist in the tree: ${value}`);
        valueSet.add(value);
      }

      if (fieldChildren in node) {
        dataNode.children = dig(node[fieldChildren]);
      }

      return dataNode;
    });
  }

  return dig(treeData);
}

/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
export default function useTreeData(
  treeData: Ref<DataNode[]>,
  children: Ref<any[]>,
  {
    getLabelProp,
    simpleMode,
    fieldNames,
  }: {
    getLabelProp: (node: DataNode) => any;
    simpleMode: Ref<boolean | SimpleModeConfig>;
    fieldNames: Ref<FieldNames>;
  },
): ComputedRef<InternalDataEntity[]> {
  return computed(() => {
    if (treeData.value) {
      return formatTreeData(
        simpleMode.value
          ? parseSimpleTreeData(treeData.value, {
              id: 'id',
              pId: 'pId',
              rootPId: null,
              ...(simpleMode.value !== true ? simpleMode.value : {}),
            })
          : treeData.value,
        getLabelProp,
        fieldNames.value,
      );
    } else {
      return formatTreeData(convertChildrenToData(children.value), getLabelProp, fieldNames.value);
    }
  });
}
