import { computed, Ref, VNodeChild } from 'vue';
import { RawValueType, FlattenOptionsType, Key } from '../interface/generator';

export default function useCacheOptions<
  OptionsType extends {
    value?: RawValueType;
    label?: VNodeChild;
    key?: Key;
    disabled?: boolean;
  }[]
>(_values: RawValueType[], options: Ref) {
  const optionMap = computed(() => {
    const map: Map<RawValueType, FlattenOptionsType<OptionsType>[number]> = new Map();
    options.value.forEach((item: any) => {
      const {
        data: { value },
      } = item;
      map.set(value, item);
    });
    return map;
  });

  const getValueOption = (vals: RawValueType[]): FlattenOptionsType<OptionsType> =>
    vals.map(value => optionMap.value.get(value)).filter(Boolean);

  return getValueOption;
}
