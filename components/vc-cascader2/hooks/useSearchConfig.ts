import type { CascaderProps, ShowSearchType } from '../Cascader';
import type { Ref } from 'vue';
import { computed } from 'vue';
import { warning } from '../../vc-util/warning';

// Convert `showSearch` to unique config
export default function useSearchConfig(showSearch?: Ref<CascaderProps['showSearch']>) {
  return computed(() => {
    if (!showSearch.value) {
      return [false, {}];
    }

    let searchConfig: ShowSearchType = {
      matchInputWidth: true,
      limit: 50,
    };

    if (showSearch.value && typeof showSearch.value === 'object') {
      searchConfig = {
        ...searchConfig,
        ...showSearch.value,
      };
    }

    if (searchConfig.limit <= 0) {
      delete searchConfig.limit;

      if (process.env.NODE_ENV !== 'production') {
        warning(false, "'limit' of showSearch should be positive number or false.");
      }
    }

    return [true, searchConfig];
  });
}
