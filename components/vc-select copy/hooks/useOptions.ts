import type { Ref } from 'vue';
import { computed } from 'vue';
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
  return computed(() => {
    let mergedOptions = options.value;
    const childrenAsData = !options.value;

    if (childrenAsData) {
      mergedOptions = convertChildrenToData(children.value);
    }

    const valueOptions = new Map<RawValueType, OptionType>();
    const labelOptions = new Map<any, OptionType>();

    function dig(optionList: OptionType[], isChildren = false) {
      // for loop to speed up collection speed
      for (let i = 0; i < optionList.length; i += 1) {
        const option = optionList[i];
        if (!option[fieldNames.value.options] || isChildren) {
          valueOptions.set(option[fieldNames.value.value], option);
          labelOptions.set(option[fieldNames.value.label], option);
        } else {
          dig(option[fieldNames.value.options], true);
        }
      }
    }
    dig(mergedOptions);

    return {
      options: mergedOptions,
      valueOptions,
      labelOptions,
    };
  });
}
