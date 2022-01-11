import type { Ref } from 'vue';
import { shallowRef, watchEffect } from 'vue';
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
  watchEffect(() => {
    let newOptions = options.value;
    const childrenAsData = !options.value;

    if (childrenAsData) {
      newOptions = convertChildrenToData(children.value);
    }

    const newValueOptions = new Map<RawValueType, OptionType>();
    const newLabelOptions = new Map<any, OptionType>();

    function dig(optionList: OptionType[], isChildren = false) {
      // for loop to speed up collection speed
      for (let i = 0; i < optionList.length; i += 1) {
        const option = optionList[i];
        if (!option[fieldNames.value.options] || isChildren) {
          newValueOptions.set(option[fieldNames.value.value], option);
          newLabelOptions.set(option[fieldNames.value.label], option);
        } else {
          dig(option[fieldNames.value.options], true);
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
