import type { RawValueType, FlattenDataNode, Key, LabelValueType } from '../interface';
import type { SkipType } from './useKeyValueMapping';
import { getRawValueLabeled } from '../utils/valueUtil';
import type { CheckedStrategy } from '../utils/strategyUtil';
import { formatStrategyKeys } from '../utils/strategyUtil';
import type { DefaultValueType } from '../../vc-select/interface/generator';
import type { DataEntity } from '../../vc-tree/interface';
import type { Ref } from 'vue';
import { shallowRef, watchEffect } from 'vue';

interface Config {
  treeConduction: Ref<boolean>;
  /** Current `value` of TreeSelect */
  value: Ref<DefaultValueType>;
  showCheckedStrategy: Ref<CheckedStrategy>;
  conductKeyEntities: Ref<Record<Key, DataEntity>>;
  getEntityByKey: (key: Key, skipType?: SkipType, ignoreDisabledCheck?: boolean) => FlattenDataNode;
  getEntityByValue: (
    value: RawValueType,
    skipType?: SkipType,
    ignoreDisabledCheck?: boolean,
  ) => FlattenDataNode;
  getLabelProp: (entity: FlattenDataNode) => any;
}

/** Return  */
export default function useSelectValues(
  rawValues: Ref<RawValueType[]>,
  {
    value,
    getEntityByValue,
    getEntityByKey,
    treeConduction,
    showCheckedStrategy,
    conductKeyEntities,
    getLabelProp,
  }: Config,
): Ref<LabelValueType[]> {
  const rawValueLabeled = shallowRef([]);
  watchEffect(() => {
    let mergedRawValues = rawValues.value;

    if (treeConduction.value) {
      const rawKeys = formatStrategyKeys(
        rawValues.value.map(val => {
          const entity = getEntityByValue(val);
          return entity ? entity.key : val;
        }),
        showCheckedStrategy.value,
        conductKeyEntities.value,
      );

      mergedRawValues = rawKeys.map(key => {
        const entity = getEntityByKey(key);
        return entity ? entity.data.value : key;
      });
    }

    rawValueLabeled.value = getRawValueLabeled(
      mergedRawValues,
      value.value,
      getEntityByValue,
      getLabelProp,
    );
  });
  return rawValueLabeled;
}
