import type { Key } from '../../_util/type';
import type { DataEntity } from '../../vc-tree/interface';
import { conductCheck } from '../../vc-tree/utils/conductUtil';
import type { LabeledValueType, RawValueType } from '../TreeSelect';
import type { Ref } from 'vue';
import { shallowRef, watchEffect } from 'vue';

export default (
  rawLabeledValues: Ref<LabeledValueType[]>,
  rawHalfCheckedValues: Ref<LabeledValueType[]>,
  treeConduction: Ref<boolean>,
  keyEntities: Ref<Record<Key, DataEntity>>,
) => {
  const newRawCheckedValues = shallowRef<RawValueType[]>([]);
  const newRawHalfCheckedValues = shallowRef<RawValueType[]>([]);

  watchEffect(() => {
    let checkedKeys: RawValueType[] = rawLabeledValues.value.map(({ value }) => value);
    let halfCheckedKeys: RawValueType[] = rawHalfCheckedValues.value.map(({ value }) => value);

    const missingValues = checkedKeys.filter(key => !keyEntities.value[key]);

    if (treeConduction.value) {
      ({ checkedKeys, halfCheckedKeys } = conductCheck(checkedKeys, true, keyEntities.value));
    }
    newRawCheckedValues.value = Array.from(new Set([...missingValues, ...checkedKeys]));
    newRawHalfCheckedValues.value = halfCheckedKeys;
  });
  return [newRawCheckedValues, newRawHalfCheckedValues];
};
