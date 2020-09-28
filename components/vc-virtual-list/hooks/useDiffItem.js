import { ref, toRaw, watch } from 'vue';
import cloneDeep from 'lodash-es/cloneDeep';
import { findListDiffIndex } from '../utils/algorithmUtil';

export default function useDiffItem(data, getKey, onDiff) {
  const diffItem = ref(null);
  let prevData = cloneDeep(toRaw(data));
  watch(data, val => {
    const diff = findListDiffIndex(prevData || [], val || [], getKey);
    if (diff?.index !== undefined) {
      onDiff?.(diff.index);
      diffItem = val[diff.index];
    }
    prevData = cloneDeep(toRaw(val));
  });

  return [diffItem];
}
