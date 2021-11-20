import type { Ref } from 'vue';
import { watch, shallowRef } from 'vue';
import type { Key, GetRowKey } from '../interface';

interface MapCache<RecordType> {
  kvMap?: Map<Key, RecordType>;
}

export default function useLazyKVMap<RecordType>(
  dataRef: Ref<readonly RecordType[]>,
  childrenColumnNameRef: Ref<string>,
  getRowKeyRef: Ref<GetRowKey<RecordType>>,
) {
  const mapCacheRef = shallowRef<MapCache<RecordType>>({});

  watch(
    [dataRef, childrenColumnNameRef, getRowKeyRef],
    () => {
      const kvMap = new Map<Key, RecordType>();
      const getRowKey = getRowKeyRef.value;
      const childrenColumnName = childrenColumnNameRef.value;
      /* eslint-disable no-inner-declarations */
      function dig(records: readonly RecordType[]) {
        records.forEach((record, index) => {
          const rowKey = getRowKey(record, index);
          kvMap.set(rowKey, record);

          if (record && typeof record === 'object' && childrenColumnName in record) {
            dig((record as any)[childrenColumnName] || []);
          }
        });
      }
      /* eslint-enable */

      dig(dataRef.value);

      mapCacheRef.value = {
        kvMap,
      };
    },
    {
      deep: true,
      immediate: true,
    },
  );
  function getRecordByKey(key: Key): RecordType {
    return mapCacheRef.value.kvMap!.get(key)!;
  }

  return [getRecordByKey];
}
