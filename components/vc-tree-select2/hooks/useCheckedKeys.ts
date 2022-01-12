import type { Key } from '../../_util/type';
import type { DataEntity } from '../../vc-tree/interface';
import { conductCheck } from '../../vc-tree/utils/conductUtil';
import type { LabeledValueType, RawValueType } from '../TreeSelect';
import type { Ref } from 'vue';
import { computed } from 'vue';

export default (
  rawLabeledValues: Ref<LabeledValueType[]>,
  rawHalfCheckedValues: Ref<LabeledValueType[]>,
  treeConduction: Ref<boolean>,
  keyEntities: Ref<Record<Key, DataEntity>>,
) =>
  computed(() => {
    let checkedKeys: RawValueType[] = rawLabeledValues.value.map(({ value }) => value);
    let halfCheckedKeys: RawValueType[] = rawHalfCheckedValues.value.map(({ value }) => value);

    const missingValues = checkedKeys.filter(key => !keyEntities[key]);

    if (treeConduction.value) {
      ({ checkedKeys, halfCheckedKeys } = conductCheck(checkedKeys, true, keyEntities.value));
    }

    return [
      // Checked keys should fill with missing keys which should de-duplicated
      Array.from(new Set([...missingValues, ...checkedKeys])),
      // Half checked keys
      halfCheckedKeys,
    ];
  });
