import { convertDataToEntities } from '../../vc-tree/utils/treeUtil';
import type { DataEntity } from '../../vc-tree/interface';
import type { FieldNames, RawValueType } from '../TreeSelect';

import { isNil } from '../utils/valueUtil';
import type { Ref, ShallowRef } from 'vue';
import { shallowRef, watchEffect } from 'vue';
import { warning } from '../../vc-util/warning';

export default (treeData: ShallowRef<any>, fieldNames: Ref<FieldNames>) => {
  const valueEntities = shallowRef(new Map<RawValueType, DataEntity>());
  const keyEntities = shallowRef<Record<string, DataEntity>>({});
  watchEffect(() => {
    const fieldNamesValue = fieldNames.value;
    const collection = convertDataToEntities(treeData.value, {
      fieldNames: fieldNamesValue,
      initWrapper: wrapper => ({
        ...wrapper,
        valueEntities: new Map(),
      }),
      processEntity: (entity, wrapper: any) => {
        const val = entity.node[fieldNamesValue.value];

        // Check if exist same value
        if (process.env.NODE_ENV !== 'production') {
          const key = entity.node.key;

          warning(!isNil(val), 'TreeNode `value` is invalidate: undefined');
          warning(!wrapper.valueEntities.has(val), `Same \`value\` exist in the tree: ${val}`);
          warning(
            !key || String(key) === String(val),
            `\`key\` or \`value\` with TreeNode must be the same or you can remove one of them. key: ${key}, value: ${val}.`,
          );
        }
        wrapper.valueEntities.set(val, entity);
      },
    }) as any;
    valueEntities.value = collection.valueEntities;
    keyEntities.value = collection.keyEntities;
  });
  return { valueEntities, keyEntities };
};
