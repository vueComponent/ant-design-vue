import type { Ref } from 'vue';
import { computed } from 'vue';
import type { SingleValueType, DefaultOptionType, InternalFieldNames } from '../Cascader';
import { toPathOptions } from '../utils/treeUtil';

export default (
  options: Ref<DefaultOptionType[]>,
  fieldNames: Ref<InternalFieldNames>,
  rawValues: Ref<SingleValueType[]>,
) => {
  return computed(() => {
    const missingValues: SingleValueType[] = [];
    const existsValues: SingleValueType[] = [];

    rawValues.value.forEach(valueCell => {
      const pathOptions = toPathOptions(valueCell, options.value, fieldNames.value);
      if (pathOptions.every(opt => opt.option)) {
        existsValues.push(valueCell);
      } else {
        missingValues.push(valueCell);
      }
    });

    return [existsValues, missingValues];
  });
};
