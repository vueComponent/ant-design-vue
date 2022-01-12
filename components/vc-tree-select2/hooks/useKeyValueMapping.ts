import type { Ref } from 'vue';
import type { FlattenDataNode, Key, RawValueType } from '../interface';

export type SkipType = null | 'select' | 'checkbox';

export function isDisabled(dataNode: FlattenDataNode, skipType: SkipType): boolean {
  if (!dataNode) {
    return true;
  }

  const { disabled, disableCheckbox } = dataNode.data.node;

  switch (skipType) {
    case 'checkbox':
      return disabled || disableCheckbox;

    default:
      return disabled;
  }
}

export default function useKeyValueMapping(
  cacheKeyMap: Ref<Map<Key, FlattenDataNode>>,
  cacheValueMap: Ref<Map<RawValueType, FlattenDataNode>>,
): [
  (key: Key, skipType?: SkipType, ignoreDisabledCheck?: boolean) => FlattenDataNode,
  (value: RawValueType, skipType?: SkipType, ignoreDisabledCheck?: boolean) => FlattenDataNode,
] {
  const getEntityByKey = (
    key: Key,
    skipType: SkipType = 'select',
    ignoreDisabledCheck?: boolean,
  ) => {
    const dataNode = cacheKeyMap.value.get(key);

    if (!ignoreDisabledCheck && isDisabled(dataNode, skipType)) {
      return null;
    }

    return dataNode;
  };

  const getEntityByValue = (
    value: RawValueType,
    skipType: SkipType = 'select',
    ignoreDisabledCheck?: boolean,
  ) => {
    const dataNode = cacheValueMap.value.get(value);

    if (!ignoreDisabledCheck && isDisabled(dataNode, skipType)) {
      return null;
    }

    return dataNode;
  };

  return [getEntityByKey, getEntityByValue];
}
