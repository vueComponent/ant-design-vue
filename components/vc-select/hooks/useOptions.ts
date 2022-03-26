import type { Ref } from 'vue';
import { toRaw, shallowRef, watchEffect, watch } from 'vue';
import type { FieldNames, RawValueType } from '../Select';
import { convertChildrenToData } from '../utils/legacyUtil';

/**
 * Parse `children` to `options` if `options` is not provided.
 * Then flatten the `options`.
 */
export default function useOptions<OptionType>(
  options: Ref<OptionType[]>,
  children: Ref<any>,
  fieldNames: Ref<FieldNames>,
) {
  const mergedOptions = shallowRef();
  const valueOptions = shallowRef();
  const labelOptions = shallowRef();
  const tempMergedOptions = shallowRef([]);
  watch(
    [options, children],
    () => {
      if (options.value) {
        tempMergedOptions.value = toRaw(options.value).slice();
      } else {
        tempMergedOptions.value = convertChildrenToData(children.value);
      }
    },
    { immediate: true, deep: true },
  );
  watchEffect(() => {
    const newOptions = tempMergedOptions.value;

    const newValueOptions = new Map<RawValueType, OptionType>();
    const newLabelOptions = new Map<any, OptionType>();
    const fieldNamesValue = fieldNames.value;
    function dig(optionList: OptionType[], isChildren = false) {
      // for loop to speed up collection speed
      for (let i = 0; i < optionList.length; i += 1) {
        const option = optionList[i];
        if (!option[fieldNamesValue.options] || isChildren) {
          newValueOptions.set(option[fieldNamesValue.value], option);
          newLabelOptions.set(option[fieldNamesValue.label], option);
        } else {
          dig(option[fieldNamesValue.options], true);
        }
      }
    }
    dig(newOptions);
    mergedOptions.value = newOptions;
    valueOptions.value = newValueOptions;
    labelOptions.value = newLabelOptions;
  });
  return {
    options: mergedOptions,
    valueOptions,
    labelOptions,
  };
}
