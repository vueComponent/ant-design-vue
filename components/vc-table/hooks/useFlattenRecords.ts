import type { Ref } from 'vue';
import { computed } from 'vue';
import type { GetRowKey, Key } from '../interface';

// recursion (flat tree structure)
function flatRecord<T>(
  record: T,
  indent: number,
  childrenColumnName: string,
  expandedKeys: Set<Key>,
  getRowKey: GetRowKey<T>,
  index: number,
) {
  const arr = [];

  arr.push({
    record,
    indent,
    index,
  });

  const key = getRowKey(record);

  const expanded = expandedKeys?.has(key);

  if (record && Array.isArray(record[childrenColumnName]) && expanded) {
    // expanded state, flat record
    for (let i = 0; i < record[childrenColumnName].length; i += 1) {
      const tempArr = flatRecord(
        record[childrenColumnName][i],
        indent + 1,
        childrenColumnName,
        expandedKeys,
        getRowKey,
        i,
      );

      arr.push(...tempArr);
    }
  }

  return arr;
}

/**
 * flat tree data on expanded state
 *
 * @export
 * @template T
 * @param {*} data : table data
 * @param {string} childrenColumnName : 指定树形结构的列名
 * @param {Set<Key>} expandedKeys : 展开的行对应的keys
 * @param {GetRowKey<T>} getRowKey  : 获取当前rowKey的方法
 * @returns flattened data
 */
export default function useFlattenRecords<T = unknown>(
  dataRef: Ref<T[]>,
  childrenColumnNameRef: Ref<string>,
  expandedKeysRef: Ref<Set<Key>>,
  getRowKey: Ref<GetRowKey<T>>,
) {
  const arr: Ref<{ record: T; indent: number; index: number }[]> = computed(() => {
    const childrenColumnName = childrenColumnNameRef.value;
    const expandedKeys = expandedKeysRef.value;
    const data = dataRef.value;
    if (expandedKeys?.size) {
      const temp: { record: T; indent: number; index: number }[] = [];

      // collect flattened record
      for (let i = 0; i < data?.length; i += 1) {
        const record = data[i];

        temp.push(
          ...flatRecord<T>(record, 0, childrenColumnName, expandedKeys, getRowKey.value, i),
        );
      }

      return temp;
    }

    return data?.map((item, index) => {
      return {
        record: item,
        indent: 0,
        index,
      };
    });
  });

  return arr;
}
