import type { Ref } from 'vue';
import { shallowRef, computed } from 'vue';
import type { RawValueType } from '../BaseSelect';
import type { DefaultOptionType, LabelInValueType } from '../Select';

/**
 * Cache `value` related LabeledValue & options.
 */
export default (
  labeledValues: Ref<LabelInValueType[]>,
  valueOptions: Ref<Map<RawValueType, DefaultOptionType>>,
): [Ref<LabelInValueType[]>, (val: RawValueType) => DefaultOptionType] => {
  const cacheRef = shallowRef({
    values: new Map<RawValueType, LabelInValueType>(),
    options: new Map<RawValueType, DefaultOptionType>(),
  });

  const filledLabeledValues = computed(() => {
    const { values: prevValueCache, options: prevOptionCache } = cacheRef.value;

    // Fill label by cache
    const patchedValues = labeledValues.value.map(item => {
      if (item.label === undefined) {
        return {
          ...item,
          label: prevValueCache.get(item.value)?.label,
        };
      }

      return item;
    });

    // Refresh cache
    const valueCache = new Map<RawValueType, LabelInValueType>();
    const optionCache = new Map<RawValueType, DefaultOptionType>();

    patchedValues.forEach(item => {
      valueCache.set(item.value, item);
      optionCache.set(
        item.value,
        valueOptions.value.get(item.value) || prevOptionCache.get(item.value),
      );
    });

    cacheRef.value.values = valueCache;
    cacheRef.value.options = optionCache;

    return patchedValues;
  });

  const getOption = (val: RawValueType) =>
    valueOptions.value.get(val) || cacheRef.value.options.get(val);

  return [filledLabeledValues, getOption];
};
