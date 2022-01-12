import { convertDataToEntities } from '../../vc-tree/utils/treeUtil';
import type { DataEntity } from '../../vc-tree/interface';
import type { FieldNames, RawValueType } from '../TreeSelect';

import { isNil } from '../utils/valueUtil';
import type { Ref } from 'vue';
import { computed } from 'vue';
import { warning } from '../../vc-util/warning';

export default (treeData: Ref<any>, fieldNames: Ref<FieldNames>) =>
  computed<{
    valueEntities: Map<RawValueType, DataEntity>;
    keyEntities: Record<string, DataEntity>;
  }>(() => {
    const collection = convertDataToEntities(treeData.value, {
      fieldNames: fieldNames.value,
      initWrapper: wrapper => ({
        ...wrapper,
        valueEntities: new Map(),
      }),
      processEntity: (entity, wrapper: any) => {
        const val = entity.node[fieldNames.value.value];

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
    });

    return collection as any;
  });
